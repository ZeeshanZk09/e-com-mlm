'use client';

import { Copy, Share2, Users, TrendingUp, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

interface ReferralData {
  sponsorId: string;
  referralUrl: string;
  totalReferrals: number;
  directReferrals: number;
  activeReferrals: number;
}

interface RankData {
  user: {
    id: string;
    name: string;
    sponsorId: string;
    mlmLevel: number;
    isMLMEnabled: boolean;
  };
  stats: {
    rank: string;
    rankLevel: number;
    totalDownline: number;
    directDownline: number;
    totalCommissions: number;
    monthlyEarnings: number;
    weeklyEarnings: number;
  };
  nextRank: {
    name: string;
    requirement: string;
  } | null;
}

interface WalletData {
  balance: number;
  pending: number;
  totalEarned: number;
  totalWithdrawn: number;
  pendingWithdrawals: number;
}

export default function MLMDashboard() {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [rankData, setRankData] = useState<RankData | null>(null);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [referralRes, rankRes, walletRes] = await Promise.all([
        fetch('/api/mlm/referral-link'),
        fetch('/api/mlm/rank'),
        fetch('/api/mlm/wallet'),
      ]);

      if (referralRes.ok) {
        setReferralData(await referralRes.json());
      }
      if (rankRes.ok) {
        setRankData(await rankRes.json());
      }
      if (walletRes.ok) {
        setWalletData(await walletRes.json());
      }
    } catch (error) {
      console.error('Error fetching MLM data:', error);
    } finally {
      setLoading(false);
    }
  }

  function copyReferralLink() {
    if (referralData?.referralUrl) {
      navigator.clipboard.writeText(referralData.referralUrl);
      toast.success('Referral link copied to clipboard!');
    }
  }

  function shareReferralLink() {
    if (referralData?.referralUrl && navigator.share) {
      navigator.share({
        title: 'Join me on Resellify!',
        text: 'Sign up using my referral link and start earning!',
        url: referralData.referralUrl,
      });
    } else {
      copyReferralLink();
    }
  }

  if (loading) {
    return (
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {[1, 2, 3, 4].map((n) => (
          <Card key={`skeleton-${n}`} className='p-6 animate-pulse'>
            <div className='h-4 bg-gray-200 rounded w-1/2 mb-4' />
            <div className='h-8 bg-gray-200 rounded w-3/4' />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {/* Wallet Balance */}
        <Card className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Wallet Balance</p>
              <p className='text-2xl font-bold'>Rs. {walletData?.balance.toLocaleString() || 0}</p>
              <p className='text-xs text-muted-foreground mt-1'>
                Pending: Rs. {walletData?.pending.toLocaleString() || 0}
              </p>
            </div>
            <Wallet className='h-8 w-8 text-green-500' />
          </div>
        </Card>

        {/* Total Earnings */}
        <Card className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Total Earnings</p>
              <p className='text-2xl font-bold'>
                Rs. {walletData?.totalEarned.toLocaleString() || 0}
              </p>
              <p className='text-xs text-muted-foreground mt-1'>
                Withdrawn: Rs. {walletData?.totalWithdrawn.toLocaleString() || 0}
              </p>
            </div>
            <TrendingUp className='h-8 w-8 text-blue-500' />
          </div>
        </Card>

        {/* Team Size */}
        <Card className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Team Size</p>
              <p className='text-2xl font-bold'>{rankData?.stats.totalDownline || 0}</p>
              <p className='text-xs text-muted-foreground mt-1'>
                Direct: {rankData?.stats.directDownline || 0}
              </p>
            </div>
            <Users className='h-8 w-8 text-purple-500' />
          </div>
        </Card>

        {/* Current Rank */}
        <Card className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Your Rank</p>
              <p className='text-2xl font-bold'>{rankData?.stats.rank || 'Starter'}</p>
              {rankData?.nextRank && (
                <p className='text-xs text-muted-foreground mt-1'>Next: {rankData.nextRank.name}</p>
              )}
            </div>
            <div className='h-8 w-8 rounded-full bg-linear-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold'>
              {rankData?.stats.rankLevel || 1}
            </div>
          </div>
        </Card>
      </div>

      {/* Referral Link Section */}
      <Card className='p-6'>
        <h3 className='text-lg font-semibold mb-4'>Your Referral Link</h3>
        <div className='flex flex-col sm:flex-row gap-3'>
          <div className='flex-1 bg-muted rounded-lg px-4 py-3 font-mono text-sm break-all'>
            {referralData?.referralUrl || 'Loading...'}
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={copyReferralLink}
              className='flex items-center gap-2'
            >
              <Copy className='h-4 w-4' />
              Copy
            </Button>
            <Button onClick={shareReferralLink} className='flex items-center gap-2'>
              <Share2 className='h-4 w-4' />
              Share
            </Button>
          </div>
        </div>
        <div className='mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground'>
          <span>
            Sponsor ID: <strong>{referralData?.sponsorId}</strong>
          </span>
          <span>
            Total Referrals: <strong>{referralData?.totalReferrals || 0}</strong>
          </span>
          <span>
            Active Referrals: <strong>{referralData?.activeReferrals || 0}</strong>
          </span>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className='grid gap-4 md:grid-cols-2'>
        {/* Monthly Earnings */}
        <Card className='p-6'>
          <h3 className='text-lg font-semibold mb-4'>This Month</h3>
          <div className='space-y-3'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Earnings</span>
              <span className='font-semibold'>
                Rs. {rankData?.stats.monthlyEarnings.toLocaleString() || 0}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>This Week</span>
              <span className='font-semibold'>
                Rs. {rankData?.stats.weeklyEarnings.toLocaleString() || 0}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Total Commissions</span>
              <span className='font-semibold'>
                Rs. {rankData?.stats.totalCommissions.toLocaleString() || 0}
              </span>
            </div>
          </div>
        </Card>

        {/* Next Rank Progress */}
        {rankData?.nextRank && (
          <Card className='p-6'>
            <h3 className='text-lg font-semibold mb-4'>Next Rank: {rankData.nextRank.name}</h3>
            <p className='text-sm text-muted-foreground mb-4'>{rankData.nextRank.requirement}</p>
            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span>Progress</span>
                <span>
                  {rankData.stats.totalDownline} downlines, Rs.{' '}
                  {rankData.stats.totalCommissions.toLocaleString()} earned
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2.5'>
                <div
                  className='bg-linear-to-r from-green-400 to-green-600 h-2.5 rounded-full'
                  style={{
                    width: `${Math.min((rankData.stats.rankLevel / 7) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
