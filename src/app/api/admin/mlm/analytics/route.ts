// GET /api/admin/mlm/analytics - MLM performance analytics
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/shared/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get basic counts
    const [
      totalMembers,
      activeMembers,
      totalCommissionsPaid,
      pendingCommissions,
      totalWithdrawals,
      pendingWithdrawals,
    ] = await Promise.all([
      prisma.user.count({ where: { isMLMEnabled: true } }),
      prisma.user.count({
        where: {
          isMLMEnabled: true,
          isActive: true,
          orders: { some: {} },
        },
      }),
      prisma.commission.aggregate({
        where: { status: 'PAID' },
        _sum: { amount: true },
      }),
      prisma.commission.aggregate({
        where: { status: 'PENDING' },
        _sum: { amount: true },
      }),
      prisma.withdrawal.aggregate({
        where: { status: 'PAID' },
        _sum: { netAmount: true },
      }),
      prisma.withdrawal.count({ where: { status: 'PENDING' } }),
    ]);

    // Get members by level
    const membersByLevel = await prisma.user.groupBy({
      by: ['mlmLevel'],
      where: { isMLMEnabled: true },
      _count: true,
      orderBy: { mlmLevel: 'asc' },
    });

    // Get commissions by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const commissionsByMonth = await prisma.$queryRaw<
      { month: string; total: number; count: bigint }[]
    >`
      SELECT 
        TO_CHAR("createdAt", 'YYYY-MM') as month,
        SUM(amount::numeric) as total,
        COUNT(*) as count
      FROM "Commission"
      WHERE "createdAt" >= ${sixMonthsAgo}
      GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
      ORDER BY month DESC
      LIMIT 6
    `;

    // Get top earners
    const topEarners = await prisma.user.findMany({
      where: {
        isMLMEnabled: true,
        wallet: { isNot: null },
      },
      select: {
        id: true,
        name: true,
        email: true,
        wallet: {
          select: { totalEarned: true },
        },
        _count: {
          select: { downline: true },
        },
      },
      orderBy: {
        wallet: {
          totalEarned: 'desc',
        },
      },
      take: 10,
    });

    // Get new signups this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newSignupsThisMonth = await prisma.user.count({
      where: {
        isMLMEnabled: true,
        createdAt: { gte: startOfMonth },
      },
    });

    // Get total wallet balances
    const totalWalletBalance = await prisma.wallet.aggregate({
      _sum: { balance: true, pending: true },
    });

    return NextResponse.json({
      overview: {
        totalMembers,
        activeMembers,
        totalCommissionsPaid: Number(totalCommissionsPaid._sum.amount || 0),
        pendingCommissions: Number(pendingCommissions._sum.amount || 0),
        totalWithdrawals: Number(totalWithdrawals._sum.netAmount || 0),
        pendingWithdrawals,
        newSignupsThisMonth,
        totalWalletBalance: Number(totalWalletBalance._sum.balance || 0),
        totalPendingInWallets: Number(totalWalletBalance._sum.pending || 0),
      },
      membersByLevel: membersByLevel.map((item) => ({
        level: item.mlmLevel,
        count: item._count,
      })),
      commissionsByMonth: commissionsByMonth.map((item) => ({
        month: item.month,
        total: Number(item.total || 0),
        count: Number(item.count),
      })),
      topEarners: topEarners.map((user) => ({
        user: { id: user.id, name: user.name, email: user.email },
        totalEarned: Number(user.wallet?.totalEarned || 0),
        downlineCount: user._count.downline,
      })),
    });
  } catch (error) {
    console.error('Error fetching MLM analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch MLM analytics' }, { status: 500 });
  }
}
