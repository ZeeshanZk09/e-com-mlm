'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Users, TrendingUp, Wallet, Clock, ArrowUpRight, Network } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';

interface Analytics {
  overview: {
    totalMembers: number;
    activeMembers: number;
    totalCommissionsPaid: number;
    pendingCommissions: number;
    totalWithdrawals: number;
    pendingWithdrawals: number;
    newSignupsThisMonth: number;
    totalWalletBalance: number;
    totalPendingInWallets: number;
  };
  membersByLevel: { level: number; count: number }[];
  commissionsByMonth: { month: string; total: number; count: number }[];
  topEarners: {
    user: { id: string; name: string; email: string };
    totalEarned: number;
    downlineCount: number;
  }[];
}

export default function AdminMLMDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      const res = await fetch('/api/admin/mlm/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>MLM Dashboard</h1>
        </div>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {[1, 2, 3, 4].map((n) => (
            <Card key={`skeleton-${n}`} className='p-6 animate-pulse'>
              <div className='h-4 bg-gray-200 rounded w-1/2 mb-4' />
              <div className='h-8 bg-gray-200 rounded w-3/4' />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const overview = analytics?.overview;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold flex items-center gap-2'>
            <Network className='h-6 w-6 text-purple-600' />
            MLM Dashboard
          </h1>
          <p className='text-muted-foreground'>Overview of your multi-level marketing system</p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' asChild>
            <Link href='/admin/mlm/settings'>Settings</Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Total Members</p>
              <p className='text-2xl font-bold'>{overview?.totalMembers || 0}</p>
              <p className='text-xs text-muted-foreground mt-1'>
                Active: {overview?.activeMembers || 0}
              </p>
            </div>
            <Users className='h-8 w-8 text-blue-500' />
          </div>
        </Card>

        <Card className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Commissions Paid</p>
              <p className='text-2xl font-bold'>
                Rs. {(overview?.totalCommissionsPaid || 0).toLocaleString()}
              </p>
              <p className='text-xs text-yellow-600 mt-1'>
                Pending: Rs. {(overview?.pendingCommissions || 0).toLocaleString()}
              </p>
            </div>
            <TrendingUp className='h-8 w-8 text-green-500' />
          </div>
        </Card>

        <Card className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Wallet Balances</p>
              <p className='text-2xl font-bold'>
                Rs. {(overview?.totalWalletBalance || 0).toLocaleString()}
              </p>
              <p className='text-xs text-muted-foreground mt-1'>
                Pending: Rs. {(overview?.totalPendingInWallets || 0).toLocaleString()}
              </p>
            </div>
            <Wallet className='h-8 w-8 text-purple-500' />
          </div>
        </Card>

        <Card className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Pending Withdrawals</p>
              <p className='text-2xl font-bold'>{overview?.pendingWithdrawals || 0}</p>
              <p className='text-xs text-green-600 mt-1'>
                +{overview?.newSignupsThisMonth || 0} new this month
              </p>
            </div>
            <Clock className='h-8 w-8 text-orange-500' />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Link href='/admin/mlm/members'>
          <Card className='p-4 hover:bg-muted/50 transition-colors cursor-pointer'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Users className='h-5 w-5 text-blue-600' />
                <span className='font-medium'>View Members</span>
              </div>
              <ArrowUpRight className='h-4 w-4 text-muted-foreground' />
            </div>
          </Card>
        </Link>

        <Link href='/admin/mlm/commissions'>
          <Card className='p-4 hover:bg-muted/50 transition-colors cursor-pointer'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <TrendingUp className='h-5 w-5 text-green-600' />
                <span className='font-medium'>Manage Commissions</span>
              </div>
              <ArrowUpRight className='h-4 w-4 text-muted-foreground' />
            </div>
          </Card>
        </Link>

        <Link href='/admin/mlm/withdrawals'>
          <Card className='p-4 hover:bg-muted/50 transition-colors cursor-pointer'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Wallet className='h-5 w-5 text-purple-600' />
                <span className='font-medium'>Process Withdrawals</span>
              </div>
              <ArrowUpRight className='h-4 w-4 text-muted-foreground' />
            </div>
          </Card>
        </Link>

        <Link href='/admin/mlm/settings'>
          <Card className='p-4 hover:bg-muted/50 transition-colors cursor-pointer'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Network className='h-5 w-5 text-orange-600' />
                <span className='font-medium'>Commission Rules</span>
              </div>
              <ArrowUpRight className='h-4 w-4 text-muted-foreground' />
            </div>
          </Card>
        </Link>
      </div>

      {/* Members by Level & Top Earners */}
      <div className='grid gap-6 md:grid-cols-2'>
        {/* Members by Level */}
        <Card className='p-6'>
          <h3 className='text-lg font-semibold mb-4'>Members by Level</h3>
          <div className='space-y-3'>
            {analytics?.membersByLevel?.length ? (
              analytics.membersByLevel.map((item) => (
                <div key={item.level} className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <span className='w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-semibold'>
                      {item.level}
                    </span>
                    <span>Level {item.level}</span>
                  </div>
                  <span className='font-semibold'>{item.count}</span>
                </div>
              ))
            ) : (
              <p className='text-muted-foreground text-center py-4'>No members yet</p>
            )}
          </div>
        </Card>

        {/* Top Earners */}
        <Card className='p-6'>
          <h3 className='text-lg font-semibold mb-4'>Top Earners</h3>
          <div className='space-y-3'>
            {analytics?.topEarners?.length ? (
              analytics.topEarners.slice(0, 5).map((earner, index) => (
                <div key={earner.user.id} className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <span className='w-6 h-6 rounded-full bg-linear-to-r from-yellow-400 to-orange-500 text-white flex items-center justify-center text-xs font-semibold'>
                      {index + 1}
                    </span>
                    <div>
                      <p className='font-medium'>{earner.user.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        {earner.downlineCount} downlines
                      </p>
                    </div>
                  </div>
                  <span className='font-semibold text-green-600'>
                    Rs. {earner.totalEarned.toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className='text-muted-foreground text-center py-4'>No earners yet</p>
            )}
          </div>
        </Card>
      </div>

      {/* Commission Trend */}
      <Card className='p-6'>
        <h3 className='text-lg font-semibold mb-4'>Commission Trend (Last 6 Months)</h3>
        <div className='space-y-3'>
          {analytics?.commissionsByMonth?.length ? (
            analytics.commissionsByMonth.map((item) => (
              <div key={item.month} className='flex items-center justify-between'>
                <span className='text-muted-foreground'>{item.month}</span>
                <div className='flex items-center gap-4'>
                  <span className='text-sm text-muted-foreground'>{item.count} transactions</span>
                  <span className='font-semibold'>Rs. {item.total.toLocaleString()}</span>
                </div>
              </div>
            ))
          ) : (
            <p className='text-muted-foreground text-center py-4'>No commission data yet</p>
          )}
        </div>
      </Card>
    </div>
  );
}
