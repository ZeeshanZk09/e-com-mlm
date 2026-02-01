// GET /api/mlm/referral-link - Get personalized referral link
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/shared/lib/prisma';
import { countTotalDownline } from '@/shared/lib/services/mlm';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        sponsorId: true,
        isMLMEnabled: true,
        _count: {
          select: { downline: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.isMLMEnabled) {
      return NextResponse.json({ error: 'MLM is not enabled for this account' }, { status: 403 });
    }

    if (!user.sponsorId) {
      return NextResponse.json(
        { error: 'Sponsor ID not found. Please contact support.' },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const referralUrl = `${baseUrl}/auth/sign-up?ref=${user.sponsorId}`;

    // Get referral stats
    const totalReferrals = await countTotalDownline(session.user.id);

    // Get active referrals (those who have made at least one order)
    const activeReferrals = await prisma.user.count({
      where: {
        uplineId: session.user.id,
        orders: {
          some: {
            status: { in: ['DELIVERED', 'SHIPPED', 'CONFIRMED'] },
          },
        },
      },
    });

    return NextResponse.json({
      sponsorId: user.sponsorId,
      referralUrl,
      totalReferrals,
      directReferrals: user._count.downline,
      activeReferrals,
    });
  } catch (error) {
    console.error('Error fetching referral link:', error);
    return NextResponse.json({ error: 'Failed to fetch referral link' }, { status: 500 });
  }
}
