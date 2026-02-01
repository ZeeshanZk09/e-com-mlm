// GET /api/mlm/withdrawals - Get user's withdrawal history
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getWithdrawalHistory } from '@/shared/lib/services/mlm';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

    const result = await getWithdrawalHistory(session.user.id, page, pageSize);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    return NextResponse.json({ error: 'Failed to fetch withdrawals' }, { status: 500 });
  }
}
