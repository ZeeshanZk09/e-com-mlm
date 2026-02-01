// MLM Commission Calculator Service
// Handles commission calculations for sales, signups, and bonuses

import { Decimal } from '@prisma/client/runtime/client';
import prisma from '@/shared/lib/prisma';
import type { CommissionType } from '@/shared/lib/generated/prisma/enums';
import type { CommissionCalculation } from '@/types/mlm';
import { getUpline } from './hierarchyManager';

/**
 * Get MLM settings (or defaults)
 */
export async function getMLMSettings() {
  const settings = await prisma.mLMSettings.findFirst();
  return {
    isMLMEnabled: settings?.isMLMEnabled ?? true,
    maxLevels: settings?.maxLevels ?? 5,
    minWithdrawal: Number(settings?.minWithdrawal ?? 500),
    withdrawalFeePercent: Number(settings?.withdrawalFeePercent ?? 0),
    defaultSignupBonus: Number(settings?.defaultSignupBonus ?? 0),
    autoApproveCommissions: settings?.autoApproveCommissions ?? false,
    autoEnableMLM: settings?.autoEnableMLM ?? true,
  };
}

/**
 * Get commission rules for a specific type
 */
export async function getCommissionRules(type: CommissionType) {
  return prisma.commissionRule.findMany({
    where: {
      type,
      isActive: true,
    },
    orderBy: [{ priority: 'desc' }, { level: 'asc' }],
  });
}

/**
 * Calculate commissions for an order
 */
export async function calculateOrderCommissions(orderId: string): Promise<CommissionCalculation[]> {
  const settings = await getMLMSettings();

  if (!settings.isMLMEnabled) {
    return [];
  }

  // Get the order with user info
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select: {
          id: true,
          isMLMEnabled: true,
          uplineId: true,
          hierarchy: true,
        },
      },
    },
  });

  if (!order || !order.user.isMLMEnabled || !order.user.uplineId) {
    return [];
  }

  const orderTotal = Number(order.totalAmount);
  const calculations: CommissionCalculation[] = [];

  // Get commission rules for SALE type
  const rules = await getCommissionRules('SALE');

  if (rules.length === 0) {
    // Use default percentages if no rules defined
    const defaultPercentages = [10, 5, 3, 2, 1]; // Level 1-5
    for (let i = 0; i < Math.min(settings.maxLevels, defaultPercentages.length); i++) {
      rules.push({
        id: `default-${i}`,
        name: `Level ${i + 1} Sales`,
        type: 'SALE',
        level: i + 1,
        percentage: new Decimal(defaultPercentages[i]),
        fixedAmount: null,
        minOrderValue: null,
        maxCommission: null,
        isActive: true,
        priority: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  // Get upline users
  const uplineUsers = await getUpline(order.user.id, settings.maxLevels);

  // Calculate commission for each upline level
  for (let levelIndex = 0; levelIndex < uplineUsers.length; levelIndex++) {
    const uplineUser = uplineUsers[levelIndex];
    const level = levelIndex + 1;

    // Find applicable rule for this level
    const rule = rules.find((r) => r.level === level);
    if (!rule) continue;

    // Check minimum order value
    if (rule.minOrderValue && orderTotal < Number(rule.minOrderValue)) {
      continue;
    }

    // Calculate commission amount
    let amount = 0;
    if (rule.fixedAmount) {
      amount = Number(rule.fixedAmount);
    } else {
      amount = (orderTotal * Number(rule.percentage)) / 100;
    }

    // Apply max commission cap
    if (rule.maxCommission && amount > Number(rule.maxCommission)) {
      amount = Number(rule.maxCommission);
    }

    if (amount > 0) {
      calculations.push({
        userId: uplineUser.id,
        amount,
        level,
        type: 'SALE',
        percentage: Number(rule.percentage),
      });
    }
  }

  return calculations;
}

/**
 * Calculate signup bonus for a new referral
 */
export async function calculateSignupBonus(
  newUserId: string,
  sponsorId: string
): Promise<CommissionCalculation[]> {
  const settings = await getMLMSettings();

  if (!settings.isMLMEnabled) {
    return [];
  }

  // Get signup bonus rules
  const rules = await getCommissionRules('SIGNUP');
  const calculations: CommissionCalculation[] = [];

  // If no rules, use default signup bonus from settings
  if (rules.length === 0 && settings.defaultSignupBonus > 0) {
    calculations.push({
      userId: sponsorId,
      amount: settings.defaultSignupBonus,
      level: 1,
      type: 'SIGNUP',
      percentage: 0,
    });
    return calculations;
  }

  // Get sponsor and their upline
  const sponsor = await prisma.user.findUnique({
    where: { id: sponsorId },
    select: { id: true, isMLMEnabled: true },
  });

  if (!sponsor?.isMLMEnabled) {
    return [];
  }

  // Get upline for multi-level signup bonuses
  const uplineUsers = [sponsor, ...(await getUpline(sponsorId, settings.maxLevels - 1))];

  for (let levelIndex = 0; levelIndex < uplineUsers.length; levelIndex++) {
    const user = uplineUsers[levelIndex];
    const level = levelIndex + 1;

    const rule = rules.find((r) => r.level === level);
    if (!rule) continue;

    let amount = 0;
    if (rule.fixedAmount) {
      amount = Number(rule.fixedAmount);
    }

    if (amount > 0) {
      calculations.push({
        userId: user.id,
        amount,
        level,
        type: 'SIGNUP',
        percentage: 0,
      });
    }
  }

  return calculations;
}

/**
 * Create commission records and update wallets
 */
export async function processCommissions(
  calculations: CommissionCalculation[],
  orderId?: string,
  sourceUserId?: string
): Promise<{ success: boolean; created: number; errors: string[] }> {
  const settings = await getMLMSettings();
  const errors: string[] = [];
  let created = 0;

  for (const calc of calculations) {
    try {
      // Create commission record
      await prisma.commission.create({
        data: {
          userId: calc.userId,
          orderId: orderId || null,
          sourceUserId: sourceUserId || null,
          amount: new Decimal(calc.amount),
          type: calc.type,
          level: calc.level,
          status: settings.autoApproveCommissions ? 'APPROVED' : 'PENDING',
          description: `${calc.type} commission (Level ${calc.level}, ${calc.percentage}%)`,
        },
      });

      // Update wallet
      await prisma.wallet.upsert({
        where: { userId: calc.userId },
        create: {
          userId: calc.userId,
          balance: settings.autoApproveCommissions ? new Decimal(calc.amount) : new Decimal(0),
          pending: settings.autoApproveCommissions ? new Decimal(0) : new Decimal(calc.amount),
          totalEarned: new Decimal(calc.amount),
        },
        update: settings.autoApproveCommissions
          ? {
              balance: { increment: calc.amount },
              totalEarned: { increment: calc.amount },
            }
          : {
              pending: { increment: calc.amount },
              totalEarned: { increment: calc.amount },
            },
      });

      created++;
    } catch (err) {
      errors.push(`Failed to create commission for user ${calc.userId}: ${err}`);
    }
  }

  return { success: errors.length === 0, created, errors };
}

/**
 * Approve a pending commission and move to wallet balance
 */
export async function approveCommission(
  commissionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const commission = await prisma.commission.findUnique({
      where: { id: commissionId },
    });

    if (!commission) {
      return { success: false, error: 'Commission not found' };
    }

    if (commission.status !== 'PENDING') {
      return { success: false, error: 'Commission is not pending' };
    }

    // Update commission status
    await prisma.commission.update({
      where: { id: commissionId },
      data: {
        status: 'APPROVED',
        processedAt: new Date(),
      },
    });

    // Move from pending to balance in wallet
    await prisma.wallet.update({
      where: { userId: commission.userId },
      data: {
        balance: { increment: Number(commission.amount) },
        pending: { decrement: Number(commission.amount) },
      },
    });

    return { success: true };
  } catch (err) {
    return { success: false, error: `Failed to approve commission: ${err}` };
  }
}

/**
 * Cancel a pending commission
 */
export async function cancelCommission(
  commissionId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const commission = await prisma.commission.findUnique({
      where: { id: commissionId },
    });

    if (!commission) {
      return { success: false, error: 'Commission not found' };
    }

    if (commission.status !== 'PENDING') {
      return { success: false, error: 'Commission is not pending' };
    }

    // Update commission status
    await prisma.commission.update({
      where: { id: commissionId },
      data: {
        status: 'CANCELLED',
        processedAt: new Date(),
        description: reason
          ? `${commission.description} - Cancelled: ${reason}`
          : commission.description,
      },
    });

    // Remove from pending in wallet
    await prisma.wallet.update({
      where: { userId: commission.userId },
      data: {
        pending: { decrement: Number(commission.amount) },
        totalEarned: { decrement: Number(commission.amount) },
      },
    });

    return { success: true };
  } catch (err) {
    return { success: false, error: `Failed to cancel commission: ${err}` };
  }
}

/**
 * Hook to be called when an order is placed/confirmed
 */
export async function processOrderCommissions(
  orderId: string
): Promise<{ success: boolean; commissionsCreated: number; errors: string[] }> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { userId: true, status: true },
  });

  if (!order) {
    return { success: false, commissionsCreated: 0, errors: ['Order not found'] };
  }

  // Only process commissions for confirmed/delivered orders
  if (!['CONFIRMED', 'DELIVERED', 'SHIPPED'].includes(order.status)) {
    return { success: true, commissionsCreated: 0, errors: [] };
  }

  const calculations = await calculateOrderCommissions(orderId);
  const result = await processCommissions(calculations, orderId, order.userId);

  return {
    success: result.success,
    commissionsCreated: result.created,
    errors: result.errors,
  };
}

/**
 * Hook to be called when a new user registers with a sponsor
 */
export async function processSignupBonus(
  newUserId: string,
  sponsorId: string
): Promise<{ success: boolean; commissionsCreated: number; errors: string[] }> {
  const calculations = await calculateSignupBonus(newUserId, sponsorId);
  const result = await processCommissions(calculations, undefined, newUserId);

  return {
    success: result.success,
    commissionsCreated: result.created,
    errors: result.errors,
  };
}
