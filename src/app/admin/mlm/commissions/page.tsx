'use client';

import { format } from 'date-fns';
import { Check, X, Filter, Download, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';

interface Commission {
  id: string;
  userId: string;
  orderId: string | null;
  amount: string;
  type: 'SALE' | 'SIGNUP' | 'LEVEL_UP' | 'BONUS';
  level: number;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED';
  description: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    sponsorId: string | null;
  };
  order?: {
    id: string;
    orderNumber: string;
    totalAmount: string;
  } | null;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  paid: number;
  cancelled: number;
  pendingCount: number;
}

interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-blue-100 text-blue-800',
  PAID: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const typeColors: Record<string, string> = {
  SALE: 'bg-purple-100 text-purple-800',
  SIGNUP: 'bg-green-100 text-green-800',
  LEVEL_UP: 'bg-blue-100 text-blue-800',
  BONUS: 'bg-orange-100 text-orange-800',
};

export default function AdminCommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchCommissions();
  }, [page, filterType, filterStatus]);

  async function fetchCommissions() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '20',
      });
      if (filterType) params.append('type', filterType);
      if (filterStatus) params.append('status', filterStatus);

      const res = await fetch(`/api/admin/mlm/commissions?${params}`);
      if (res.ok) {
        const data = await res.json();
        setCommissions(data.data);
        setStats(data.stats);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching commissions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(commissionId: string, action: 'approve' | 'cancel') {
    setActionLoading(commissionId);
    try {
      const res = await fetch('/api/admin/mlm/commissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commissionId, action }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Commission ${action === 'approve' ? 'approved' : 'cancelled'} successfully`);
        fetchCommissions();
      } else {
        toast.error(data.error || `Failed to ${action} commission`);
      }
    } catch (err) {
      console.error('Failed to update commission:', err);
      toast.error('Something went wrong');
    } finally {
      setActionLoading(null);
    }
  }

  function exportToCSV() {
    const headers = ['Date', 'User', 'Email', 'Type', 'Level', 'Amount', 'Status', 'Order'];
    const rows = commissions.map((c) => [
      format(new Date(c.createdAt), 'yyyy-MM-dd HH:mm'),
      c.user.name,
      c.user.email,
      c.type,
      c.level.toString(),
      c.amount,
      c.status,
      c.order?.orderNumber || '-',
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commissions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold flex items-center gap-2'>
            <TrendingUp className='h-6 w-6 text-green-600' />
            Commission Management
          </h1>
          <p className='text-muted-foreground'>View and manage all MLM commissions</p>
        </div>
        <Button variant='outline' onClick={exportToCSV}>
          <Download className='h-4 w-4 mr-2' />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
          <Card className='p-4 text-center'>
            <p className='text-sm text-muted-foreground'>Total</p>
            <p className='text-xl font-bold'>Rs. {stats.total.toLocaleString()}</p>
          </Card>
          <Card className='p-4 text-center bg-yellow-50'>
            <p className='text-sm text-yellow-700'>Pending ({stats.pendingCount})</p>
            <p className='text-xl font-bold text-yellow-700'>
              Rs. {stats.pending.toLocaleString()}
            </p>
          </Card>
          <Card className='p-4 text-center bg-blue-50'>
            <p className='text-sm text-blue-700'>Approved</p>
            <p className='text-xl font-bold text-blue-700'>Rs. {stats.approved.toLocaleString()}</p>
          </Card>
          <Card className='p-4 text-center bg-green-50'>
            <p className='text-sm text-green-700'>Paid</p>
            <p className='text-xl font-bold text-green-700'>Rs. {stats.paid.toLocaleString()}</p>
          </Card>
          <Card className='p-4 text-center bg-red-50'>
            <p className='text-sm text-red-700'>Cancelled</p>
            <p className='text-xl font-bold text-red-700'>Rs. {stats.cancelled.toLocaleString()}</p>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className='p-4'>
        <div className='flex flex-wrap items-center gap-4'>
          <div className='flex items-center gap-2'>
            <Filter className='h-4 w-4 text-muted-foreground' />
            <span className='text-sm font-medium'>Filters:</span>
          </div>
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setPage(1);
            }}
            className='border rounded px-3 py-1.5 text-sm'
          >
            <option value=''>All Types</option>
            <option value='SALE'>Sale</option>
            <option value='SIGNUP'>Signup</option>
            <option value='LEVEL_UP'>Level Up</option>
            <option value='BONUS'>Bonus</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            className='border rounded px-3 py-1.5 text-sm'
          >
            <option value=''>All Status</option>
            <option value='PENDING'>Pending</option>
            <option value='APPROVED'>Approved</option>
            <option value='PAID'>Paid</option>
            <option value='CANCELLED'>Cancelled</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card className='overflow-hidden'>
        {loading ? (
          <div className='p-6 animate-pulse space-y-3'>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <div key={`skeleton-${n}`} className='h-12 bg-gray-100 rounded' />
            ))}
          </div>
        ) : null}
        {!loading && commissions.length === 0 && (
          <div className='text-center py-12 text-muted-foreground'>No commissions found</div>
        )}
        {!loading && commissions.length > 0 && (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-muted/50'>
                <tr className='text-left text-sm'>
                  <th className='p-4 font-medium'>Date</th>
                  <th className='p-4 font-medium'>User</th>
                  <th className='p-4 font-medium'>Type</th>
                  <th className='p-4 font-medium'>Level</th>
                  <th className='p-4 font-medium'>Amount</th>
                  <th className='p-4 font-medium'>Status</th>
                  <th className='p-4 font-medium'>Order</th>
                  <th className='p-4 font-medium'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map((commission) => (
                  <tr key={commission.id} className='border-t hover:bg-muted/30'>
                    <td className='p-4 text-sm'>
                      {format(new Date(commission.createdAt), 'MMM dd, yyyy HH:mm')}
                    </td>
                    <td className='p-4'>
                      <div>
                        <p className='font-medium'>{commission.user.name}</p>
                        <p className='text-xs text-muted-foreground'>{commission.user.email}</p>
                      </div>
                    </td>
                    <td className='p-4'>
                      <Badge className={typeColors[commission.type]}>{commission.type}</Badge>
                    </td>
                    <td className='p-4 text-center'>
                      <span className='w-6 h-6 inline-flex items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-semibold'>
                        {commission.level}
                      </span>
                    </td>
                    <td className='p-4 font-semibold'>
                      Rs. {Number(commission.amount).toLocaleString()}
                    </td>
                    <td className='p-4'>
                      <Badge className={statusColors[commission.status]}>{commission.status}</Badge>
                    </td>
                    <td className='p-4 text-sm text-muted-foreground'>
                      {commission.order?.orderNumber || '-'}
                    </td>
                    <td className='p-4'>
                      {commission.status === 'PENDING' && (
                        <div className='flex gap-1'>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => handleAction(commission.id, 'approve')}
                            disabled={actionLoading === commission.id}
                            className='h-8 w-8 p-0'
                          >
                            <Check className='h-4 w-4 text-green-600' />
                          </Button>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => handleAction(commission.id, 'cancel')}
                            disabled={actionLoading === commission.id}
                            className='h-8 w-8 p-0'
                          >
                            <X className='h-4 w-4 text-red-600' />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className='flex items-center justify-between p-4 border-t'>
            <p className='text-sm text-muted-foreground'>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </p>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
