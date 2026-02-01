'use client';

import { ChevronDown, ChevronRight, User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card } from '@/shared/components/ui/card';

interface DownlineNode {
  id: string;
  name: string;
  email: string;
  sponsorId: string | null;
  mlmLevel: number;
  isMLMEnabled: boolean;
  joinedAt: string;
  totalSales: number;
  directDownlineCount: number;
  children?: DownlineNode[];
}

interface TreeStats {
  totalDownline: number;
  directDownline: number;
}

function TreeNode({ node, level = 0 }: Readonly<{ node: DownlineNode; level?: number }>) {
  const [expanded, setExpanded] = useState(level < 1);
  const hasChildren = node.children && node.children.length > 0;

  function handleToggle() {
    if (hasChildren) setExpanded(!expanded);
  }

  return (
    <div className='ml-4 border-l-2 border-gray-200 pl-4'>
      <button
        type='button'
        className={`flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer w-full text-left ${
          level === 0 ? 'bg-muted/30' : ''
        }`}
        onClick={handleToggle}
        disabled={!hasChildren}
      >
        {hasChildren ? (
          <span className='p-1 hover:bg-muted rounded'>
            {expanded ? <ChevronDown className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
          </span>
        ) : (
          <span className='w-6' />
        )}

        <div className='h-10 w-10 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold'>
          {node.name.charAt(0).toUpperCase()}
        </div>

        <div className='flex-1'>
          <div className='flex items-center gap-2'>
            <span className='font-medium'>{node.name}</span>
            <span className='text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700'>
              Level {node.mlmLevel}
            </span>
          </div>
          <div className='text-xs text-muted-foreground flex gap-3'>
            <span>{node.email}</span>
            <span>•</span>
            <span>ID: {node.sponsorId}</span>
          </div>
        </div>

        <div className='text-right text-sm'>
          <div className='flex items-center gap-1 text-muted-foreground'>
            <Users className='h-4 w-4' />
            <span>{node.directDownlineCount}</span>
          </div>
          <div className='text-xs text-muted-foreground'>
            Sales: Rs. {node.totalSales.toLocaleString()}
          </div>
        </div>
      </button>

      {expanded && hasChildren && (
        <div className='mt-2'>
          {node.children?.map((child) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TreeViewer() {
  const [tree, setTree] = useState<DownlineNode[]>([]);
  const [stats, setStats] = useState<TreeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [depth, setDepth] = useState(3);

  useEffect(() => {
    fetchTree();
  }, [depth]);

  async function fetchTree() {
    setLoading(true);
    try {
      const res = await fetch(`/api/mlm/tree?depth=${depth}`);
      if (res.ok) {
        const data = await res.json();
        setTree(data.tree);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching tree:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Card className='p-6'>
        <div className='animate-pulse space-y-4'>
          <div className='h-6 bg-gray-200 rounded w-1/4' />
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={`skeleton-${n}`} className='flex gap-4 ml-6'>
              <div className='h-10 w-10 bg-gray-200 rounded-full' />
              <div className='flex-1 space-y-2'>
                <div className='h-4 bg-gray-200 rounded w-1/3' />
                <div className='h-3 bg-gray-200 rounded w-1/2' />
              </div>
            </div>
          ))}
          )
        </div>
      </Card>
    );
  }

  return (
    <Card className='p-6'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h2 className='text-xl font-semibold flex items-center gap-2'>
            <Users className='h-5 w-5' />
            Your Team Tree
          </h2>
          <p className='text-sm text-muted-foreground mt-1'>
            {stats?.totalDownline || 0} total members • {stats?.directDownline || 0} direct
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground'>Depth:</span>
          <select
            value={depth}
            onChange={(e) => setDepth(Number.parseInt(e.target.value))}
            className='border rounded px-2 py-1 text-sm'
          >
            <option value={1}>1 Level</option>
            <option value={2}>2 Levels</option>
            <option value={3}>3 Levels</option>
            <option value={4}>4 Levels</option>
            <option value={5}>5 Levels</option>
          </select>
        </div>
      </div>

      {tree.length === 0 ? (
        <div className='text-center py-12'>
          <User className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
          <p className='text-muted-foreground'>No team members yet</p>
          <p className='text-sm text-muted-foreground mt-2'>
            Share your referral link to start building your team!
          </p>
        </div>
      ) : (
        <div className='space-y-2'>
          {tree.map((node) => (
            <TreeNode key={node.id} node={node} />
          ))}
        </div>
      )}
    </Card>
  );
}
