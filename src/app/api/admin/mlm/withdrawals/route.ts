// GET & PUT /api/admin/mlm/withdrawals - Manage withdrawal requests
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/shared/lib/prisma';
import type { WithdrawalStatus } from '@/shared/lib/generated/prisma/enums';
import { approveWithdrawal, markWithdrawalPaid, rejectWithdrawal } from '@/shared/lib/services/mlm';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
    const status = searchParams.get('status') as WithdrawalStatus | null;

    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (status) where.status = status;

    const [withdrawals, total, stats] = await Promise.all([
      prisma.withdrawal.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, phoneNumber: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.withdrawal.count({ where }),
      prisma.withdrawal.groupBy({
        by: ['status'],
        _sum: { amount: true, netAmount: true },
        _count: true,
      }),
    ]);

    // Calculate stats
    const statsData = {
      totalRequested: 0,
      totalPaid: 0,
      pending: 0,
      pendingCount: 0,
      approved: 0,
      approvedCount: 0,
    };

    for (const item of stats) {
      const amount = Number(item._sum.amount || 0);
      const netAmount = Number(item._sum.netAmount || 0);
      statsData.totalRequested += amount;

      switch (item.status) {
        case 'PENDING':
          statsData.pending = amount;
          statsData.pendingCount = item._count;
          break;
        case 'APPROVED':
          statsData.approved = amount;
          statsData.approvedCount = item._count;
          break;
        case 'PAID':
          statsData.totalPaid += netAmount;
          break;
      }
    }

    return NextResponse.json({
      data: withdrawals,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
      stats: statsData,
    });
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    return NextResponse.json({ error: 'Failed to fetch withdrawals' }, { status: 500 });
  }
}

// PUT /api/admin/mlm/withdrawals - Approve/reject/pay withdrawals
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { withdrawalId, action, reason } = body;

    if (!withdrawalId || !action) {
      return NextResponse.json({ error: 'Withdrawal ID and action are required' }, { status: 400 });
    }

    let result;
    switch (action) {
      case 'approve':
        result = await approveWithdrawal(withdrawalId, session.user.id);
        break;
      case 'pay':
        result = await markWithdrawalPaid(withdrawalId, session.user.id);
        break;
      case 'reject':
        result = await rejectWithdrawal(withdrawalId, session.user.id, reason);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid action. Use 'approve', 'pay', or 'reject'" },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating withdrawal:', error);
    return NextResponse.json({ error: 'Failed to update withdrawal' }, { status: 500 });
  }
}
