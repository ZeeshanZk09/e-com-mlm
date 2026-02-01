// MLM Wallet Service
// Handles wallet operations, withdrawals, and balance management

import { Decimal } from '@prisma/client/runtime/client';
import prisma from '@/shared/lib/prisma';
import type { WithdrawalMethod } from '@/shared/lib/generated/prisma/enums';
import type { WalletSummary, WithdrawalRequest } from '@/types/mlm';
import { getMLMSettings } from './commissionCalculator';

/**
 * Get or create wallet for a user
 */
export async function getOrCreateWallet(userId: string) {
  return prisma.wallet.upsert({
    where: { userId },
    create: {
      userId,
      balance: new Decimal(0),
      pending: new Decimal(0),
      totalEarned: new Decimal(0),
    },
    update: {},
  });
}

/**
 * Get wallet summary for a user
 */
export async function getWalletSummary(userId: string): Promise<WalletSummary> {
  const wallet = await getOrCreateWallet(userId);

  // Get total withdrawn
  const withdrawnAgg = await prisma.withdrawal.aggregate({
    where: {
      userId,
      status: 'PAID',
    },
    _sum: { netAmount: true },
  });

  // Get pending withdrawals
  const pendingWithdrawalsAgg = await prisma.withdrawal.aggregate({
    where: {
      userId,
      status: { in: ['PENDING', 'APPROVED'] },
    },
    _sum: { amount: true },
  });

  return {
    balance: Number(wallet.balance),
    pending: Number(wallet.pending),
    totalEarned: Number(wallet.totalEarned),
    totalWithdrawn: Number(withdrawnAgg._sum.netAmount || 0),
    pendingWithdrawals: Number(pendingWithdrawalsAgg._sum.amount || 0),
  };
}

/**
 * Request a withdrawal
 */
export async function requestWithdrawal(
  userId: string,
  request: WithdrawalRequest
): Promise<{ success: boolean; withdrawalId?: string; error?: string }> {
  try {
    const settings = await getMLMSettings();
    const wallet = await getOrCreateWallet(userId);

    // Validate amount
    if (request.amount <= 0) {
      return { success: false, error: 'Invalid withdrawal amount' };
    }

    if (request.amount < settings.minWithdrawal) {
      return {
        success: false,
        error: `Minimum withdrawal amount is ${settings.minWithdrawal}`,
      };
    }

    if (request.amount > Number(wallet.balance)) {
      return { success: false, error: 'Insufficient balance' };
    }

    // Calculate fee
    const fee = (request.amount * settings.withdrawalFeePercent) / 100;
    const netAmount = request.amount - fee;

    // Create withdrawal request
    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId,
        amount: new Decimal(request.amount),
        fee: new Decimal(fee),
        netAmount: new Decimal(netAmount),
        method: request.method,
        details: request.details,
        status: 'PENDING',
      },
    });

    // Deduct from wallet balance (held until processed)
    await prisma.wallet.update({
      where: { userId },
      data: {
        balance: { decrement: request.amount },
      },
    });

    return { success: true, withdrawalId: withdrawal.id };
  } catch (err) {
    return { success: false, error: `Failed to create withdrawal: ${err}` };
  }
}

/**
 * Approve a withdrawal request
 */
export async function approveWithdrawal(
  withdrawalId: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal) {
      return { success: false, error: 'Withdrawal not found' };
    }

    if (withdrawal.status !== 'PENDING') {
      return { success: false, error: 'Withdrawal is not pending' };
    }

    await prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        status: 'APPROVED',
        processedBy: adminId,
      },
    });

    return { success: true };
  } catch (err) {
    return { success: false, error: `Failed to approve withdrawal: ${err}` };
  }
}

/**
 * Mark a withdrawal as paid
 */
export async function markWithdrawalPaid(
  withdrawalId: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal) {
      return { success: false, error: 'Withdrawal not found' };
    }

    if (!['PENDING', 'APPROVED'].includes(withdrawal.status)) {
      return { success: false, error: 'Withdrawal cannot be marked as paid' };
    }

    await prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        status: 'PAID',
        processedAt: new Date(),
        processedBy: adminId,
      },
    });

    return { success: true };
  } catch (err) {
    return { success: false, error: `Failed to mark withdrawal as paid: ${err}` };
  }
}

/**
 * Reject a withdrawal request
 */
export async function rejectWithdrawal(
  withdrawalId: string,
  adminId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal) {
      return { success: false, error: 'Withdrawal not found' };
    }

    if (!['PENDING', 'APPROVED'].includes(withdrawal.status)) {
      return { success: false, error: 'Withdrawal cannot be rejected' };
    }

    // Return funds to wallet
    await prisma.wallet.update({
      where: { userId: withdrawal.userId },
      data: {
        balance: { increment: Number(withdrawal.amount) },
      },
    });

    await prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        status: 'REJECTED',
        processedAt: new Date(),
        processedBy: adminId,
        notes: reason,
      },
    });

    return { success: true };
  } catch (err) {
    return { success: false, error: `Failed to reject withdrawal: ${err}` };
  }
}

/**
 * Get withdrawal history for a user
 */
export async function getWithdrawalHistory(
  userId: string,
  page: number = 1,
  pageSize: number = 10
) {
  const skip = (page - 1) * pageSize;

  const [withdrawals, total] = await Promise.all([
    prisma.withdrawal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.withdrawal.count({ where: { userId } }),
  ]);

  return {
    data: withdrawals,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Get all pending withdrawals (for admin)
 */
export async function getPendingWithdrawals(page: number = 1, pageSize: number = 20) {
  const skip = (page - 1) * pageSize;

  const [withdrawals, total] = await Promise.all([
    prisma.withdrawal.findMany({
      where: { status: { in: ['PENDING', 'APPROVED'] } },
      include: {
        user: {
          select: { id: true, name: true, email: true, phoneNumber: true },
        },
      },
      orderBy: { createdAt: 'asc' },
      skip,
      take: pageSize,
    }),
    prisma.withdrawal.count({ where: { status: { in: ['PENDING', 'APPROVED'] } } }),
  ]);

  return {
    data: withdrawals,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
