// GET /api/admin/mlm/commissions - View all commissions
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/shared/lib/prisma';
import type { CommissionStatus, CommissionType } from '@/shared/lib/generated/prisma/enums';
import { approveCommission, cancelCommission } from '@/shared/lib/services/mlm';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
    const status = searchParams.get('status') as CommissionStatus | null;
    const type = searchParams.get('type') as CommissionType | null;
    const userId = searchParams.get('userId');

    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (userId) where.userId = userId;

    const [commissions, total, stats] = await Promise.all([
      prisma.commission.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, sponsorId: true },
          },
          order: {
            select: { id: true, orderNumber: true, totalAmount: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.commission.count({ where }),
      prisma.commission.groupBy({
        by: ['status'],
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    // Calculate stats
    const statsData = {
      total: 0,
      pending: 0,
      approved: 0,
      paid: 0,
      cancelled: 0,
      pendingCount: 0,
    };

    for (const item of stats) {
      const amount = Number(item._sum.amount || 0);
      statsData.total += amount;
      switch (item.status) {
        case 'PENDING':
          statsData.pending = amount;
          statsData.pendingCount = item._count;
          break;
        case 'APPROVED':
          statsData.approved = amount;
          break;
        case 'PAID':
          statsData.paid = amount;
          break;
        case 'CANCELLED':
          statsData.cancelled = amount;
          break;
      }
    }

    return NextResponse.json({
      data: commissions,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
      stats: statsData,
    });
  } catch (error) {
    console.error('Error fetching commissions:', error);
    return NextResponse.json({ error: 'Failed to fetch commissions' }, { status: 500 });
  }
}

// PUT /api/admin/mlm/commissions - Approve/cancel commissions
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { commissionId, action, reason } = body;

    if (!commissionId || !action) {
      return NextResponse.json({ error: 'Commission ID and action are required' }, { status: 400 });
    }

    let result;
    switch (action) {
      case 'approve':
        result = await approveCommission(commissionId);
        break;
      case 'cancel':
        result = await cancelCommission(commissionId, reason);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid action. Use 'approve' or 'cancel'" },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating commission:', error);
    return NextResponse.json({ error: 'Failed to update commission' }, { status: 500 });
  }
}
