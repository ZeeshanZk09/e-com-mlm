'use client';

import { format } from 'date-fns';
import { Download, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
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
  order?: {
    id: string;
    orderNumber: string;
    totalAmount: string;
  } | null;
}

interface Summary {
  totalEarned: number;
  pending: number;
  approved: number;
  paid: number;
  cancelled: number;
}

interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-blue-100 text-blue-800',
  PAID: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const typeColors = {
  SALE: 'bg-purple-100 text-purple-800',
  SIGNUP: 'bg-green-100 text-green-800',
  LEVEL_UP: 'bg-blue-100 text-blue-800',
  BONUS: 'bg-orange-100 text-orange-800',
};

export default function CommissionTable() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    fetchCommissions();
  }, [page, filterType, filterStatus]);

  async function fetchCommissions() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '10',
      });
      if (filterType) params.append('type', filterType);
      if (filterStatus) params.append('status', filterStatus);

      const res = await fetch(`/api/mlm/commissions?${params}`);
      if (res.ok) {
        const data = await res.json();
        setCommissions(data.data);
        setSummary(data.summary);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching commissions:', error);
    } finally {
      setLoading(false);
    }
  }

  function exportToCSV() {
    const headers = ['Date', 'Type', 'Level', 'Amount', 'Status', 'Order'];
    const rows = commissions.map((c) => [
      format(new Date(c.createdAt), 'yyyy-MM-dd HH:mm'),
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
    <Card className='p-6'>
      {/* Summary Cards */}
      {summary && (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
          <div className='text-center p-3 bg-muted rounded-lg'>
            <p className='text-sm text-muted-foreground'>Total Earned</p>
            <p className='text-xl font-bold'>Rs. {summary.totalEarned.toLocaleString()}</p>
          </div>
          <div className='text-center p-3 bg-yellow-50 rounded-lg'>
            <p className='text-sm text-yellow-700'>Pending</p>
            <p className='text-xl font-bold text-yellow-700'>
              Rs. {summary.pending.toLocaleString()}
            </p>
          </div>
          <div className='text-center p-3 bg-blue-50 rounded-lg'>
            <p className='text-sm text-blue-700'>Approved</p>
            <p className='text-xl font-bold text-blue-700'>
              Rs. {summary.approved.toLocaleString()}
            </p>
          </div>
          <div className='text-center p-3 bg-green-50 rounded-lg'>
            <p className='text-sm text-green-700'>Paid</p>
            <p className='text-xl font-bold text-green-700'>Rs. {summary.paid.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Filters and Export */}
      <div className='flex flex-wrap items-center justify-between gap-4 mb-4'>
        <div className='flex items-center gap-2'>
          <Filter className='h-4 w-4 text-muted-foreground' />
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
        <Button variant='outline' size='sm' onClick={exportToCSV}>
          <Download className='h-4 w-4 mr-2' />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className='animate-pulse space-y-3'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='h-12 bg-gray-100 rounded' />
          ))}
        </div>
      ) : commissions.length === 0 ? (
        <div className='text-center py-12 text-muted-foreground'>No commissions found</div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b text-left text-sm text-muted-foreground'>
                <th className='pb-3 font-medium'>Date</th>
                <th className='pb-3 font-medium'>Type</th>
                <th className='pb-3 font-medium'>Level</th>
                <th className='pb-3 font-medium'>Amount</th>
                <th className='pb-3 font-medium'>Status</th>
                <th className='pb-3 font-medium'>Order</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((commission) => (
                <tr key={commission.id} className='border-b'>
                  <td className='py-3 text-sm'>
                    {format(new Date(commission.createdAt), 'MMM dd, yyyy')}
                    <br />
                    <span className='text-xs text-muted-foreground'>
                      {format(new Date(commission.createdAt), 'HH:mm')}
                    </span>
                  </td>
                  <td className='py-3'>
                    <Badge className={typeColors[commission.type]}>{commission.type}</Badge>
                  </td>
                  <td className='py-3 text-sm'>Level {commission.level}</td>
                  <td className='py-3 font-medium'>
                    Rs. {parseFloat(commission.amount).toLocaleString()}
                  </td>
                  <td className='py-3'>
                    <Badge className={statusColors[commission.status]}>{commission.status}</Badge>
                  </td>
                  <td className='py-3 text-sm text-muted-foreground'>
                    {commission.order?.orderNumber || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className='flex items-center justify-between mt-4'>
          <p className='text-sm text-muted-foreground'>
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </p>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant='outline'
              size='sm'
              disabled={page === pagination.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
