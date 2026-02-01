// GET /api/mlm/rank - Get user's MLM rank and performance
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/shared/lib/prisma';
import { countTotalDownline, getDirectDownline } from '@/shared/lib/services/mlm';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        mlmLevel: true,
        isMLMEnabled: true,
        sponsorId: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get downline stats
    const [totalDownline, directDownline] = await Promise.all([
      countTotalDownline(user.id),
      getDirectDownline(user.id),
    ]);

    // Get commission stats
    const commissionStats = await prisma.commission.aggregate({
      where: { userId: user.id },
      _sum: { amount: true },
      _count: true,
    });

    // Get this month's earnings
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyEarnings = await prisma.commission.aggregate({
      where: {
        userId: user.id,
        createdAt: { gte: startOfMonth },
        status: { in: ['APPROVED', 'PAID'] },
      },
      _sum: { amount: true },
    });

    // Get this week's earnings
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyEarnings = await prisma.commission.aggregate({
      where: {
        userId: user.id,
        createdAt: { gte: startOfWeek },
        status: { in: ['APPROVED', 'PAID'] },
      },
      _sum: { amount: true },
    });

    // Calculate rank based on downline count and earnings
    const rank = calculateRank(totalDownline, Number(commissionStats._sum.amount || 0));

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        sponsorId: user.sponsorId,
        mlmLevel: user.mlmLevel,
        isMLMEnabled: user.isMLMEnabled,
        joinedAt: user.createdAt,
      },
      stats: {
        rank: rank.name,
        rankLevel: rank.level,
        totalDownline,
        directDownline: directDownline.length,
        totalCommissions: Number(commissionStats._sum.amount || 0),
        commissionCount: commissionStats._count,
        monthlyEarnings: Number(monthlyEarnings._sum.amount || 0),
        weeklyEarnings: Number(weeklyEarnings._sum.amount || 0),
      },
      nextRank: rank.next,
    });
  } catch (error) {
    console.error('Error fetching rank:', error);
    return NextResponse.json({ error: 'Failed to fetch rank' }, { status: 500 });
  }
}

// Rank calculation based on performance
function calculateRank(
  downlineCount: number,
  totalEarnings: number
): {
  name: string;
  level: number;
  next: { name: string; requirement: string } | null;
} {
  const ranks = [
    { name: 'Starter', level: 1, minDownline: 0, minEarnings: 0 },
    { name: 'Bronze', level: 2, minDownline: 5, minEarnings: 5000 },
    { name: 'Silver', level: 3, minDownline: 15, minEarnings: 20000 },
    { name: 'Gold', level: 4, minDownline: 50, minEarnings: 100000 },
    { name: 'Platinum', level: 5, minDownline: 100, minEarnings: 500000 },
    { name: 'Diamond', level: 6, minDownline: 250, minEarnings: 1000000 },
    { name: 'Crown', level: 7, minDownline: 500, minEarnings: 5000000 },
  ];

  let currentRank = ranks[0];
  let nextRank: (typeof ranks)[0] | null = ranks[1];

  for (let i = ranks.length - 1; i >= 0; i--) {
    if (downlineCount >= ranks[i].minDownline && totalEarnings >= ranks[i].minEarnings) {
      currentRank = ranks[i];
      nextRank = ranks[i + 1] || null;
      break;
    }
  }

  return {
    name: currentRank.name,
    level: currentRank.level,
    next: nextRank
      ? {
          name: nextRank.name,
          requirement: `${nextRank.minDownline} downlines and Rs. ${nextRank.minEarnings.toLocaleString()} earnings`,
        }
      : null,
  };
}
