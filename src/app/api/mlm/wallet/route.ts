// GET /api/mlm/wallet - Get wallet balance and summary
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getWalletSummary } from '@/shared/lib/services/mlm';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const summary = await getWalletSummary(session.user.id);

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error fetching wallet:', error);
    return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 });
  }
}
