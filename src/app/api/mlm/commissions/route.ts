// GET /api/mlm/commissions - Get user's commission history
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/shared/lib/prisma';
import type { CommissionStatus, CommissionType } from '@/shared/lib/generated/prisma/enums';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const type = searchParams.get('type') as CommissionType | null;
    const status = searchParams.get('status') as CommissionStatus | null;

    const skip = (page - 1) * pageSize;

    const where: {
      userId: string;
      type?: CommissionType;
      status?: CommissionStatus;
    } = {
      userId: session.user.id,
    };

    if (type) where.type = type;
    if (status) where.status = status;

    const [commissions, total, summary] = await Promise.all([
      prisma.commission.findMany({
        where,
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              totalAmount: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.commission.count({ where }),
      prisma.commission.groupBy({
        by: ['status'],
        where: { userId: session.user.id },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    // Calculate summary
    const summaryData = {
      totalEarned: 0,
      pending: 0,
      approved: 0,
      paid: 0,
      cancelled: 0,
    };

    for (const item of summary) {
      const amount = Number(item._sum.amount || 0);
      summaryData.totalEarned += amount;
      switch (item.status) {
        case 'PENDING':
          summaryData.pending = amount;
          break;
        case 'APPROVED':
          summaryData.approved = amount;
          break;
        case 'PAID':
          summaryData.paid = amount;
          break;
        case 'CANCELLED':
          summaryData.cancelled = amount;
          break;
      }
    }

    return NextResponse.json({
      data: commissions,
      summary: summaryData,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching commissions:', error);
    return NextResponse.json({ error: 'Failed to fetch commissions' }, { status: 500 });
  }
}
