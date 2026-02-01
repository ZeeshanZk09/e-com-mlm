'use client';

import { format } from 'date-fns';
import { Search, Users, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Switch } from '@/shared/components/ui/switch';

interface Member {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  sponsorId: string | null;
  mlmLevel: number;
  isMLMEnabled: boolean;
  createdAt: string;
  upline: {
    id: string;
    name: string;
    sponsorId: string | null;
  } | null;
  wallet: {
    balance: string;
    pending: string;
    totalEarned: string;
  } | null;
  _count: {
    downline: number;
    commissions: number;
  };
}

interface Stats {
  totalMembers: number;
  totalWalletBalance: number;
  totalEarned: number;
  pendingCommissions: number;
  pendingCommissionsCount: number;
  pendingWithdrawals: number;
}

interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function AdminMembersTable() {
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchDebounce, setSearchDebounce] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounce(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchMembers();
  }, [page, searchDebounce]);

  async function fetchMembers() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '20',
      });
      if (searchDebounce) params.append('search', searchDebounce);

      const res = await fetch(`/api/admin/mlm/members?${params}`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data.data);
        setStats(data.stats);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleMLMStatus(userId: string, isMLMEnabled: boolean) {
    try {
      const res = await fetch('/api/admin/mlm/members', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isMLMEnabled }),
      });

      if (res.ok) {
        toast.success(`MLM ${isMLMEnabled ? 'enabled' : 'disabled'} for user`);
        fetchMembers();
      } else {
        toast.error('Failed to update user');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  }

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      {stats && (
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
          <Card className='p-4 text-center'>
            <p className='text-sm text-muted-foreground'>Total Members</p>
            <p className='text-2xl font-bold'>{stats.totalMembers}</p>
          </Card>
          <Card className='p-4 text-center'>
            <p className='text-sm text-muted-foreground'>Total Balance</p>
            <p className='text-2xl font-bold'>Rs. {stats.totalWalletBalance.toLocaleString()}</p>
          </Card>
          <Card className='p-4 text-center'>
            <p className='text-sm text-muted-foreground'>Total Earned</p>
            <p className='text-2xl font-bold'>Rs. {stats.totalEarned.toLocaleString()}</p>
          </Card>
          <Card className='p-4 text-center'>
            <p className='text-sm text-muted-foreground'>Pending Commissions</p>
            <p className='text-2xl font-bold text-yellow-600'>
              Rs. {stats.pendingCommissions.toLocaleString()}
            </p>
          </Card>
          <Card className='p-4 text-center'>
            <p className='text-sm text-muted-foreground'>Pending Count</p>
            <p className='text-2xl font-bold'>{stats.pendingCommissionsCount}</p>
          </Card>
          <Card className='p-4 text-center'>
            <p className='text-sm text-muted-foreground'>Pending Withdrawals</p>
            <p className='text-2xl font-bold text-orange-600'>{stats.pendingWithdrawals}</p>
          </Card>
        </div>
      )}

      {/* Search */}
      <Card className='p-4'>
        <div className='flex items-center gap-4'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder='Search by name, email, or sponsor ID...'
              className='pl-10'
            />
          </div>
        </div>
      </Card>

      {/* Members Table */}
      <Card className='p-4 overflow-x-auto'>
        {loading ? (
          <div className='animate-pulse space-y-3'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='h-16 bg-gray-100 rounded' />
            ))}
          </div>
        ) : (
          <table className='w-full'>
            <thead>
              <tr className='border-b text-left text-sm text-muted-foreground'>
                <th className='pb-3 font-medium'>Member</th>
                <th className='pb-3 font-medium'>Sponsor ID</th>
                <th className='pb-3 font-medium'>Upline</th>
                <th className='pb-3 font-medium'>Level</th>
                <th className='pb-3 font-medium'>Downline</th>
                <th className='pb-3 font-medium'>Wallet</th>
                <th className='pb-3 font-medium'>MLM</th>
                <th className='pb-3 font-medium'>Joined</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className='border-b hover:bg-muted/50'>
                  <td className='py-3'>
                    <div>
                      <p className='font-medium'>{member.name}</p>
                      <p className='text-xs text-muted-foreground'>{member.email}</p>
                    </div>
                  </td>
                  <td className='py-3 font-mono text-sm'>{member.sponsorId || '-'}</td>
                  <td className='py-3 text-sm'>
                    {member.upline ? (
                      <span>
                        {member.upline.name}
                        <br />
                        <span className='text-xs text-muted-foreground'>
                          {member.upline.sponsorId}
                        </span>
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className='py-3'>
                    <Badge variant='secondary'>Level {member.mlmLevel}</Badge>
                  </td>
                  <td className='py-3'>
                    <div className='flex items-center gap-1'>
                      <Users className='h-4 w-4 text-muted-foreground' />
                      {member._count.downline}
                    </div>
                  </td>
                  <td className='py-3 text-sm'>
                    {member.wallet ? (
                      <div>
                        <p className='font-medium'>
                          Rs. {parseFloat(member.wallet.balance).toLocaleString()}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          Earned: Rs. {parseFloat(member.wallet.totalEarned).toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className='py-3'>
                    <Switch
                      checked={member.isMLMEnabled}
                      onCheckedChange={(checked) => toggleMLMStatus(member.id, checked)}
                    />
                  </td>
                  <td className='py-3 text-sm text-muted-foreground'>
                    {format(new Date(member.createdAt), 'MMM dd, yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className='flex items-center justify-between mt-4'>
            <p className='text-sm text-muted-foreground'>
              Page {pagination.page} of {pagination.totalPages}
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
    </div>
  );
}
