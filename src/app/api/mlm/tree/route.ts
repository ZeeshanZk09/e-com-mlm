// GET /api/mlm/tree - Get user's downline tree
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDownlineTree, countTotalDownline, getDirectDownline } from '@/shared/lib/services/mlm';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const depth = parseInt(searchParams.get('depth') || '3', 10);
    const maxDepth = Math.min(depth, 5); // Limit depth to 5 levels

    const [tree, totalDownline, directDownline] = await Promise.all([
      getDownlineTree(session.user.id, maxDepth),
      countTotalDownline(session.user.id),
      getDirectDownline(session.user.id),
    ]);

    return NextResponse.json({
      tree,
      stats: {
        totalDownline,
        directDownline: directDownline.length,
      },
    });
  } catch (error) {
    console.error('Error fetching MLM tree:', error);
    return NextResponse.json({ error: 'Failed to fetch MLM tree' }, { status: 500 });
  }
}
