// GET /api/admin/mlm/members - List all MLM members with stats
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/shared/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
    const search = searchParams.get('search') || '';
    const mlmEnabled = searchParams.get('mlmEnabled');
    const level = searchParams.get('level');

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { sponsorId: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (mlmEnabled !== null && mlmEnabled !== undefined) {
      where.isMLMEnabled = mlmEnabled === 'true';
    }

    if (level) {
      where.mlmLevel = parseInt(level, 10);
    }

    const [members, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          sponsorId: true,
          mlmLevel: true,
          isMLMEnabled: true,
          createdAt: true,
          upline: {
            select: { id: true, name: true, sponsorId: true },
          },
          wallet: {
            select: { balance: true, pending: true, totalEarned: true },
          },
          _count: {
            select: { downline: true, commissions: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.user.count({ where }),
    ]);

    // Get overall MLM stats
    const stats = await prisma.$transaction([
      prisma.user.count({ where: { isMLMEnabled: true } }),
      prisma.wallet.aggregate({ _sum: { balance: true, totalEarned: true } }),
      prisma.commission.aggregate({
        where: { status: 'PENDING' },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.withdrawal.count({ where: { status: 'PENDING' } }),
    ]);

    return NextResponse.json({
      data: members,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
      stats: {
        totalMembers: stats[0],
        totalWalletBalance: Number(stats[1]._sum.balance || 0),
        totalEarned: Number(stats[1]._sum.totalEarned || 0),
        pendingCommissions: Number(stats[2]._sum.amount || 0),
        pendingCommissionsCount: stats[2]._count,
        pendingWithdrawals: stats[3],
      },
    });
  } catch (error) {
    console.error('Error fetching MLM members:', error);
    return NextResponse.json({ error: 'Failed to fetch MLM members' }, { status: 500 });
  }
}

// PUT /api/admin/mlm/members - Update member MLM status
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, isMLMEnabled, mlmLevel } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const updateData: { isMLMEnabled?: boolean; mlmLevel?: number } = {};

    if (typeof isMLMEnabled === 'boolean') {
      updateData.isMLMEnabled = isMLMEnabled;
    }

    if (typeof mlmLevel === 'number' && mlmLevel >= 1) {
      updateData.mlmLevel = mlmLevel;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        isMLMEnabled: true,
        mlmLevel: true,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error updating MLM member:', error);
    return NextResponse.json({ error: 'Failed to update MLM member' }, { status: 500 });
  }
}
