'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { usePrefersReducedMotion, useDeviceType } from '@/hooks';

type TransitionType = 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down' | 'none';

interface PageTransitionProps {
  /** Content to animate */
  readonly children: ReactNode;
  /** Transition type */
  readonly type?: TransitionType;
  /** Duration in ms */
  readonly duration?: number;
  /** Additional class names */
  readonly className?: string;
}

const transitionClasses: Record<TransitionType, { enter: string; exit: string }> = {
  fade: {
    enter: 'opacity-0',
    exit: 'opacity-100',
  },
  'slide-left': {
    enter: 'translate-x-4 opacity-0',
    exit: 'translate-x-0 opacity-100',
  },
  'slide-right': {
    enter: '-translate-x-4 opacity-0',
    exit: 'translate-x-0 opacity-100',
  },
  'slide-up': {
    enter: 'translate-y-4 opacity-0',
    exit: 'translate-y-0 opacity-100',
  },
  'slide-down': {
    enter: '-translate-y-4 opacity-0',
    exit: 'translate-y-0 opacity-100',
  },
  none: {
    enter: '',
    exit: '',
  },
};

/**
 * Page Transition Wrapper
 *
 * Provides smooth transitions between page changes.
 * Respects prefers-reduced-motion.
 */
export default function PageTransition({
  children,
  type = 'slide-up',
  duration = 200,
  className,
}: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { isMobile } = useDeviceType();
  const [isVisible, setIsVisible] = useState(false);

  // Use faster transitions on mobile
  const actualDuration = isMobile ? duration * 0.8 : duration;
  const actualType = prefersReducedMotion ? 'none' : type;
  const classes = transitionClasses[actualType];

  useEffect(() => {
    // Reset on page change
    setIsVisible(false);

    // Small delay to ensure DOM update
    const timer = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => cancelAnimationFrame(timer);
  }, [pathname]);

  return (
    <div
      className={cn('transition-all', isVisible ? classes.exit : classes.enter, className)}
      style={{
        transitionDuration: `${actualDuration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </div>
  );
}

/**
 * Staggered List Animation
 *
 * Animates children with staggered delays for list items.
 */
interface StaggeredListProps {
  /** List items to animate */
  readonly children: ReactNode[];
  /** Delay between each item in ms */
  readonly staggerDelay?: number;
  /** Base duration for each item */
  readonly duration?: number;
  /** Additional class names */
  readonly className?: string;
  /** Item class names */
  readonly itemClassName?: string;
}

export function StaggeredList({
  children,
  staggerDelay = 50,
  duration = 200,
  className,
  itemClassName,
}: StaggeredListProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (prefersReducedMotion) {
      // Show all immediately
      setVisibleItems(new Set(children.map((_, i) => i)));
      return;
    }

    // Stagger animation
    const timers: NodeJS.Timeout[] = [];

    children.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleItems((prev) => new Set([...prev, index]));
      }, index * staggerDelay);
      timers.push(timer);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [children.length, staggerDelay, prefersReducedMotion]);

  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(
            'transition-all',
            visibleItems.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
            itemClassName
          )}
          style={{
            transitionDuration: `${duration}ms`,
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
