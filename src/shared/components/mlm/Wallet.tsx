'use client';

import { format } from 'date-fns';
import { Wallet, ArrowUpRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

interface WalletSummary {
  balance: number;
  pending: number;
  totalEarned: number;
  totalWithdrawn: number;
  pendingWithdrawals: number;
}

interface Withdrawal {
  id: string;
  amount: string;
  fee: string;
  netAmount: string;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';
  method: 'BANK' | 'EASYPAISA' | 'JAZZCASH' | 'CRYPTO';
  details: Record<string, string>;
  notes: string | null;
  createdAt: string;
  processedAt: string | null;
}

const statusConfig = {
  PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  APPROVED: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  PAID: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
  REJECTED: { color: 'bg-red-100 text-red-800', icon: XCircle },
};

export default function WalletComponent() {
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Withdrawal form state
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'BANK' | 'EASYPAISA' | 'JAZZCASH' | 'CRYPTO'>('BANK');
  const [accountTitle, setAccountTitle] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [walletNumber, setWalletNumber] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [walletRes, withdrawalsRes] = await Promise.all([
        fetch('/api/mlm/wallet'),
        fetch('/api/mlm/withdrawals'),
      ]);

      if (walletRes.ok) {
        setWallet(await walletRes.json());
      }
      if (withdrawalsRes.ok) {
        const data = await withdrawalsRes.json();
        setWithdrawals(data.data);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleWithdrawal() {
    setSubmitting(true);

    try {
      const details: Record<string, string> = {};

      if (method === 'BANK') {
        details.accountTitle = accountTitle;
        details.accountNumber = accountNumber;
        details.bankName = bankName;
      } else if (method === 'EASYPAISA' || method === 'JAZZCASH') {
        details.walletNumber = walletNumber;
        details.accountTitle = accountTitle;
      }

      const res = await fetch('/api/mlm/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
          method,
          details,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Withdrawal request submitted successfully!');
        setDialogOpen(false);
        resetForm();
        fetchData();
      } else {
        toast.error(data.error || 'Failed to submit withdrawal request');
      }
    } catch (err) {
      console.error('Failed to submit withdrawal:', err);
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setAmount('');
    setMethod('BANK');
    setAccountTitle('');
    setAccountNumber('');
    setBankName('');
    setWalletNumber('');
  }

  if (loading) {
    return (
      <Card className='p-6 animate-pulse'>
        <div className='h-8 bg-gray-200 rounded w-1/4 mb-4' />
        <div className='h-16 bg-gray-200 rounded mb-6' />
        <div className='space-y-3'>
          {[1, 2, 3].map((n) => (
            <div key={`skeleton-${n}`} className='h-12 bg-gray-100 rounded' />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Wallet Balance Card */}
      <Card className='p-6 bg-linear-to-br from-green-500 to-green-700 text-white'>
        <div className='flex items-start justify-between'>
          <div>
            <p className='text-green-100 text-sm'>Available Balance</p>
            <p className='text-4xl font-bold mt-1'>Rs. {wallet?.balance.toLocaleString() || 0}</p>
            <div className='flex gap-4 mt-3 text-sm text-green-100'>
              <span>Pending: Rs. {wallet?.pending.toLocaleString() || 0}</span>
              <span>•</span>
              <span>Total Earned: Rs. {wallet?.totalEarned.toLocaleString() || 0}</span>
            </div>
          </div>
          <Wallet className='h-12 w-12 text-green-200' />
        </div>

        <div className='mt-6 flex gap-3'>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant='secondary'
                className='bg-white text-green-700 hover:bg-green-50'
                disabled={(wallet?.balance || 0) < 500}
              >
                <ArrowUpRight className='h-4 w-4 mr-2' />
                Withdraw
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Withdrawal</DialogTitle>
              </DialogHeader>
              <div className='space-y-4'>
                <div>
                  <Label>Amount (Min: Rs. 500)</Label>
                  <Input
                    type='number'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder='Enter amount'
                    min={500}
                    max={wallet?.balance || 0}
                    required
                  />
                  <p className='text-xs text-muted-foreground mt-1'>
                    Available: Rs. {wallet?.balance.toLocaleString() || 0}
                  </p>
                </div>

                <div>
                  <Label>Payment Method</Label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as typeof method)}
                    className='w-full border rounded px-3 py-2'
                    required
                  >
                    <option value='BANK'>Bank Transfer</option>
                    <option value='EASYPAISA'>Easypaisa</option>
                    <option value='JAZZCASH'>JazzCash</option>
                  </select>
                </div>

                {method === 'BANK' ? (
                  <>
                    <div>
                      <Label>Account Title</Label>
                      <Input
                        value={accountTitle}
                        onChange={(e) => setAccountTitle(e.target.value)}
                        placeholder='Account holder name'
                        required
                      />
                    </div>
                    <div>
                      <Label>Account Number / IBAN</Label>
                      <Input
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder='Enter account number'
                        required
                      />
                    </div>
                    <div>
                      <Label>Bank Name</Label>
                      <Input
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder='Enter bank name'
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label>Account Title</Label>
                      <Input
                        value={accountTitle}
                        onChange={(e) => setAccountTitle(e.target.value)}
                        placeholder='Account holder name'
                        required
                      />
                    </div>
                    <div>
                      <Label>Mobile Number</Label>
                      <Input
                        value={walletNumber}
                        onChange={(e) => setWalletNumber(e.target.value)}
                        placeholder='03XX XXXXXXX'
                        required
                      />
                    </div>
                  </>
                )}

                <Button
                  type='button'
                  className='w-full'
                  disabled={submitting}
                  onClick={handleWithdrawal}
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Withdrawal History */}
      <Card className='p-6'>
        <h3 className='text-lg font-semibold mb-4'>Withdrawal History</h3>

        {withdrawals.length === 0 ? (
          <div className='text-center py-8 text-muted-foreground'>No withdrawal requests yet</div>
        ) : (
          <div className='space-y-3'>
            {withdrawals.map((withdrawal) => {
              const StatusIcon = statusConfig[withdrawal.status].icon;
              return (
                <div
                  key={withdrawal.id}
                  className='flex items-center justify-between p-4 border rounded-lg'
                >
                  <div className='flex items-center gap-3'>
                    <StatusIcon className='h-5 w-5 text-muted-foreground' />
                    <div>
                      <p className='font-medium'>
                        Rs. {Number.parseFloat(withdrawal.amount).toLocaleString()}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {withdrawal.method} •{' '}
                        {format(new Date(withdrawal.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <Badge className={statusConfig[withdrawal.status].color}>
                      {withdrawal.status}
                    </Badge>
                    {withdrawal.fee !== '0' && (
                      <p className='text-xs text-muted-foreground mt-1'>
                        Fee: Rs. {Number.parseFloat(withdrawal.fee).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
