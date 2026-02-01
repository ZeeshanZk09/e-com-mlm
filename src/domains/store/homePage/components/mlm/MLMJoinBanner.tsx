'use client';

import { ArrowRight, TrendingUp, Users, X, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';

/**
 * MLM Join Banner
 *
 * A sticky/floating banner to promote MLM signup
 * Can be shown on product pages, checkout, etc.
 */

interface MLMJoinBannerProps {
  variant?: 'inline' | 'sticky' | 'floating';
  showDismiss?: boolean;
  className?: string;
}

export function MLMJoinBanner({
  variant = 'inline',
  showDismiss = true,
  className = '',
}: MLMJoinBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const dismissed = localStorage.getItem('mlm-banner-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('mlm-banner-dismissed', 'true');
  };

  if (isDismissed) return null;

  if (variant === 'sticky') {
    return (
      <div
        className={`sticky bottom-0 left-0 right-0 z-40 bg-linear-to-r from-[#0b6b2e] to-[#0b6b2e]/90 text-white py-3 px-4 shadow-lg ${className}`}
      >
        <div className='max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3'>
          <div className='flex items-center gap-3 text-sm'>
            <Zap className='w-5 h-5 text-[#7be08a] shrink-0' />
            <span>
              <strong>Earn up to 21% commission</strong> on every purchase in your network!
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              asChild
              size='sm'
              className='bg-white text-[#0b6b2e] hover:bg-white/90 font-semibold'
            >
              <Link href='/auth/signup?mlm=true'>
                Join Free
                <ArrowRight className='w-4 h-4 ml-1' />
              </Link>
            </Button>
            {showDismiss && (
              <button
                onClick={handleDismiss}
                className='p-1 hover:bg-white/10 rounded'
                aria-label='Dismiss banner'
              >
                <X className='w-5 h-5' />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'floating') {
    return (
      <div
        className={`fixed bottom-4 right-4 z-40 bg-card border border-border rounded-xl shadow-lg p-4 max-w-xs animate-slide-in ${className}`}
      >
        {showDismiss && (
          <button
            onClick={handleDismiss}
            className='absolute -top-2 -right-2 p-1 bg-muted rounded-full hover:bg-muted/80'
            aria-label='Dismiss'
          >
            <X className='w-4 h-4' />
          </button>
        )}
        <div className='flex items-start gap-3'>
          <div className='w-10 h-10 rounded-full bg-linear-to-br from-[#0b6b2e] to-[#7be08a] flex items-center justify-center shrink-0'>
            <TrendingUp className='w-5 h-5 text-white' />
          </div>
          <div>
            <p className='font-semibold text-sm mb-1'>Earn While You Shop!</p>
            <p className='text-xs text-muted-foreground mb-3'>
              Join our MLM network and earn commissions on every purchase.
            </p>
            <Button
              asChild
              size='sm'
              className='w-full bg-linear-to-r from-[#0b6b2e] to-[#0b6b2e]/80 text-white'
            >
              <Link href='/mlm'>Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Inline variant (default)
  return (
    <div
      className={`bg-linear-to-r from-[#0b6b2e]/10 to-[#7be08a]/10 border border-[#0b6b2e]/20 rounded-xl p-4 sm:p-6 ${className}`}
    >
      <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <div className='hidden sm:flex items-center gap-2'>
            <div className='w-12 h-12 rounded-full bg-linear-to-br from-[#0b6b2e] to-[#7be08a] flex items-center justify-center'>
              <Users className='w-6 h-6 text-white' />
            </div>
          </div>
          <div className='text-center sm:text-left'>
            <h3 className='font-semibold mb-1'>Join Our MLM Network</h3>
            <p className='text-sm text-muted-foreground'>
              Earn up to 21% commission across 5 levels. Zero investment required!
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button asChild className='bg-linear-to-r from-[#0b6b2e] to-[#0b6b2e]/80 text-white'>
            <Link href='/auth/signup?mlm=true'>
              Join Free
              <ArrowRight className='w-4 h-4 ml-2' />
            </Link>
          </Button>
          <Button asChild variant='outline'>
            <Link href='/mlm'>Learn More</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MLMJoinBanner;
