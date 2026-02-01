'use client';

import { format } from 'date-fns';
import { Check, Filter, Download, Wallet, Clock, CheckCircle, XCircle, Ban } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';

interface Withdrawal {
  id: string;
  userId: string;
  amount: string;
  fee: string;
  netAmount: string;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';
  method: 'BANK' | 'EASYPAISA' | 'JAZZCASH' | 'CRYPTO';
  details: Record<string, string>;
  notes: string | null;
  createdAt: string;
  processedAt: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string | null;
  };
}

interface Stats {
  totalRequested: number;
  totalPaid: number;
  pending: number;
  pendingCount: number;
  approved: number;
  approvedCount: number;
}

interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const statusConfig: Record<
  string,
  { color: string; icon: React.ComponentType<{ className?: string }> }
> = {
  PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  APPROVED: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  PAID: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
  REJECTED: { color: 'bg-red-100 text-red-800', icon: XCircle },
};

const methodColors: Record<string, string> = {
  BANK: 'bg-blue-100 text-blue-800',
  EASYPAISA: 'bg-green-100 text-green-800',
  JAZZCASH: 'bg-red-100 text-red-800',
  CRYPTO: 'bg-purple-100 text-purple-800',
};

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchWithdrawals();
  }, [page, filterStatus]);

  async function fetchWithdrawals() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '20',
      });
      if (filterStatus) params.append('status', filterStatus);

      const res = await fetch(`/api/admin/mlm/withdrawals?${params}`);
      if (res.ok) {
        const data = await res.json();
        setWithdrawals(data.data);
        setStats(data.stats);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(
    withdrawalId: string,
    action: 'approve' | 'reject' | 'pay',
    reason?: string
  ) {
    setActionLoading(withdrawalId);
    try {
      const res = await fetch('/api/admin/mlm/withdrawals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withdrawalId, action, reason }),
      });

      const data = await res.json();

      if (res.ok) {
        let message = 'Withdrawal rejected';
        if (action === 'approve') message = 'Withdrawal approved';
        else if (action === 'pay') message = 'Withdrawal marked as paid';
        toast.success(message);
        fetchWithdrawals();
        setRejectDialogOpen(false);
        setRejectReason('');
        setSelectedWithdrawal(null);
      } else {
        toast.error(data.error || `Failed to ${action} withdrawal`);
      }
    } catch (err) {
      console.error('Failed to update withdrawal:', err);
      toast.error('Something went wrong');
    } finally {
      setActionLoading(null);
    }
  }

  function openRejectDialog(withdrawal: Withdrawal) {
    setSelectedWithdrawal(withdrawal);
    setRejectDialogOpen(true);
  }

  function exportToCSV() {
    const headers = [
      'Date',
      'User',
      'Email',
      'Phone',
      'Method',
      'Amount',
      'Fee',
      'Net Amount',
      'Status',
    ];
    const rows = withdrawals.map((w) => [
      format(new Date(w.createdAt), 'yyyy-MM-dd HH:mm'),
      w.user.name,
      w.user.email,
      w.user.phoneNumber || '-',
      w.method,
      w.amount,
      w.fee,
      w.netAmount,
      w.status,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `withdrawals-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold flex items-center gap-2'>
            <Wallet className='h-6 w-6 text-purple-600' />
            Withdrawal Requests
          </h1>
          <p className='text-muted-foreground'>Process and manage member withdrawal requests</p>
        </div>
        <Button variant='outline' onClick={exportToCSV}>
          <Download className='h-4 w-4 mr-2' />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card className='p-4 text-center'>
            <p className='text-sm text-muted-foreground'>Total Requested</p>
            <p className='text-xl font-bold'>Rs. {stats.totalRequested.toLocaleString()}</p>
          </Card>
          <Card className='p-4 text-center bg-yellow-50'>
            <p className='text-sm text-yellow-700'>Pending ({stats.pendingCount})</p>
            <p className='text-xl font-bold text-yellow-700'>
              Rs. {stats.pending.toLocaleString()}
            </p>
          </Card>
          <Card className='p-4 text-center bg-blue-50'>
            <p className='text-sm text-blue-700'>Approved ({stats.approvedCount})</p>
            <p className='text-xl font-bold text-blue-700'>Rs. {stats.approved.toLocaleString()}</p>
          </Card>
          <Card className='p-4 text-center bg-green-50'>
            <p className='text-sm text-green-700'>Total Paid</p>
            <p className='text-xl font-bold text-green-700'>
              Rs. {stats.totalPaid.toLocaleString()}
            </p>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className='p-4'>
        <div className='flex flex-wrap items-center gap-4'>
          <div className='flex items-center gap-2'>
            <Filter className='h-4 w-4 text-muted-foreground' />
            <span className='text-sm font-medium'>Filter by Status:</span>
          </div>
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
            <option value='REJECTED'>Rejected</option>
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
        {!loading && withdrawals.length === 0 && (
          <div className='text-center py-12 text-muted-foreground'>
            No withdrawal requests found
          </div>
        )}
        {!loading && withdrawals.length > 0 && (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-muted/50'>
                <tr className='text-left text-sm'>
                  <th className='p-4 font-medium'>Date</th>
                  <th className='p-4 font-medium'>User</th>
                  <th className='p-4 font-medium'>Method</th>
                  <th className='p-4 font-medium'>Details</th>
                  <th className='p-4 font-medium'>Amount</th>
                  <th className='p-4 font-medium'>Status</th>
                  <th className='p-4 font-medium'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal) => {
                  const StatusIcon = statusConfig[withdrawal.status].icon;
                  return (
                    <tr key={withdrawal.id} className='border-t hover:bg-muted/30'>
                      <td className='p-4 text-sm'>
                        {format(new Date(withdrawal.createdAt), 'MMM dd, yyyy HH:mm')}
                      </td>
                      <td className='p-4'>
                        <div>
                          <p className='font-medium'>{withdrawal.user.name}</p>
                          <p className='text-xs text-muted-foreground'>{withdrawal.user.email}</p>
                          {withdrawal.user.phoneNumber && (
                            <p className='text-xs text-muted-foreground'>
                              {withdrawal.user.phoneNumber}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className='p-4'>
                        <Badge className={methodColors[withdrawal.method]}>
                          {withdrawal.method}
                        </Badge>
                      </td>
                      <td className='p-4 text-sm'>
                        <div className='max-w-xs'>
                          {withdrawal.method === 'BANK' && (
                            <>
                              <p className='font-medium'>{withdrawal.details.accountTitle}</p>
                              <p className='text-muted-foreground'>{withdrawal.details.bankName}</p>
                              <p className='font-mono text-xs'>
                                {withdrawal.details.accountNumber}
                              </p>
                            </>
                          )}
                          {(withdrawal.method === 'EASYPAISA' ||
                            withdrawal.method === 'JAZZCASH') && (
                            <>
                              <p className='font-medium'>{withdrawal.details.accountTitle}</p>
                              <p className='font-mono'>{withdrawal.details.walletNumber}</p>
                            </>
                          )}
                          {withdrawal.method === 'CRYPTO' && (
                            <>
                              <p className='text-muted-foreground'>
                                {withdrawal.details.cryptoNetwork}
                              </p>
                              <p className='font-mono text-xs truncate'>
                                {withdrawal.details.cryptoAddress}
                              </p>
                            </>
                          )}
                        </div>
                      </td>
                      <td className='p-4'>
                        <div>
                          <p className='font-semibold'>
                            Rs. {Number(withdrawal.amount).toLocaleString()}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            Fee: Rs. {Number(withdrawal.fee).toLocaleString()}
                          </p>
                          <p className='text-xs text-green-600'>
                            Net: Rs. {Number(withdrawal.netAmount).toLocaleString()}
                          </p>
                        </div>
                      </td>
                      <td className='p-4'>
                        <Badge className={statusConfig[withdrawal.status].color}>
                          <StatusIcon className='h-3 w-3 mr-1' />
                          {withdrawal.status}
                        </Badge>
                        {withdrawal.notes && (
                          <p className='text-xs text-muted-foreground mt-1'>{withdrawal.notes}</p>
                        )}
                      </td>
                      <td className='p-4'>
                        <div className='flex gap-1'>
                          {withdrawal.status === 'PENDING' && (
                            <>
                              <Button
                                size='sm'
                                variant='outline'
                                onClick={() => handleAction(withdrawal.id, 'approve')}
                                disabled={actionLoading === withdrawal.id}
                                className='h-8 px-2'
                                title='Approve'
                              >
                                <Check className='h-4 w-4 text-blue-600' />
                              </Button>
                              <Button
                                size='sm'
                                variant='outline'
                                onClick={() => openRejectDialog(withdrawal)}
                                disabled={actionLoading === withdrawal.id}
                                className='h-8 px-2'
                                title='Reject'
                              >
                                <Ban className='h-4 w-4 text-red-600' />
                              </Button>
                            </>
                          )}
                          {withdrawal.status === 'APPROVED' && (
                            <>
                              <Button
                                size='sm'
                                variant='default'
                                onClick={() => handleAction(withdrawal.id, 'pay')}
                                disabled={actionLoading === withdrawal.id}
                                className='h-8'
                              >
                                <Check className='h-4 w-4 mr-1' />
                                Mark Paid
                              </Button>
                              <Button
                                size='sm'
                                variant='outline'
                                onClick={() => openRejectDialog(withdrawal)}
                                disabled={actionLoading === withdrawal.id}
                                className='h-8 px-2'
                                title='Reject'
                              >
                                <Ban className='h-4 w-4 text-red-600' />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Withdrawal</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label>Reason for rejection (optional)</Label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder='Enter reason for rejection...'
                className='mt-1'
              />
            </div>
            <div className='flex justify-end gap-2'>
              <Button variant='outline' onClick={() => setRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant='destructive'
                onClick={() =>
                  selectedWithdrawal && handleAction(selectedWithdrawal.id, 'reject', rejectReason)
                }
                disabled={actionLoading !== null}
              >
                Reject Withdrawal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
