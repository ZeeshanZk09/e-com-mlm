'use client';

import { RefreshCw } from 'lucide-react';
import { type ReactNode, useRef } from 'react';
import { cn } from '@/shared/lib/utils';
import { usePullToRefresh } from '@/hooks';

interface PullToRefreshProps {
  /** Content to wrap */
  readonly children: ReactNode;
  /** Callback when refresh is triggered */
  readonly onRefresh: () => Promise<void>;
  /** Whether pull-to-refresh is disabled */
  readonly disabled?: boolean;
  /** Custom threshold for triggering refresh (default: 80px) */
  readonly threshold?: number;
  /** Additional class names */
  readonly className?: string;
  /** Custom refresh indicator */
  readonly indicator?: ReactNode;
}

/**
 * Pull-to-Refresh Wrapper
 *
 * Provides mobile app-like pull-to-refresh functionality.
 * Only active on touch devices when at the top of scroll.
 */
export default function PullToRefresh({
  children,
  onRefresh,
  disabled = false,
  threshold = 80,
  className,
  indicator,
}: PullToRefreshProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { pullProgress, isPulling, isRefreshing, handlers } = usePullToRefresh(onRefresh, {
    threshold,
    disabled,
    containerRef,
  });

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-y-auto overscroll-contain', className)}
      {...handlers}
    >
      {/* Pull indicator */}
      <div
        className={cn(
          'absolute left-1/2 -translate-x-1/2 z-10',
          'transition-all duration-200',
          isPulling || isRefreshing ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{
          top: Math.max(0, pullProgress * 60 - 40),
          transform: `translateX(-50%) rotate(${pullProgress * 180}deg)`,
        }}
      >
        {indicator ?? (
          <div
            className={cn(
              'w-10 h-10 rounded-full',
              'bg-card border border-border shadow-lg',
              'flex items-center justify-center',
              isRefreshing && 'animate-spin'
            )}
          >
            <RefreshCw
              className={cn('w-5 h-5 text-muted-foreground', pullProgress >= 1 && 'text-[#0b6b2e]')}
            />
          </div>
        )}
      </div>

      {/* Content with pull offset */}
      <div
        className='transition-transform duration-150'
        style={{
          transform: isPulling ? `translateY(${pullProgress * 60}px)` : 'translateY(0)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
