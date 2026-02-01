'use client';

import { type ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { gridColumns } from '@/lib/device/responsive';

interface ProductGridProps {
  readonly children: ReactNode;
  readonly className?: string;
  /** Grid variant - determines column count at different breakpoints */
  readonly variant?: 'default' | 'compact' | 'wide';
  /** Gap between items */
  readonly gap?: 'sm' | 'md' | 'lg';
}

/**
 * Product Grid Component
 * 
 * Responsive grid layout for product cards that adapts to device size:
 * - Mobile: 2 columns
 * - Tablet: 3 columns
 * - Desktop: 4-5 columns
 */
export function ProductGrid({
  children,
  className,
  variant = 'default',
  gap = 'md',
}: ProductGridProps) {
  const variantClasses = {
    default: gridColumns.products, // grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
    compact: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
    wide: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  const gapClasses = {
    sm: 'gap-2 sm:gap-3',
    md: 'gap-3 sm:gap-4 lg:gap-6',
    lg: 'gap-4 sm:gap-6 lg:gap-8',
  };

  return (
    <div
      className={cn(
        'grid',
        variantClasses[variant],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
}

interface ProductListProps {
  readonly children: ReactNode;
  readonly className?: string;
  /** Gap between items */
  readonly gap?: 'sm' | 'md' | 'lg';
}

/**
 * Product List Component
 * 
 * Single column list layout for mobile-optimized viewing
 * Best for detailed product information or list views
 */
export function ProductList({
  children,
  className,
  gap = 'md',
}: ProductListProps) {
  const gapClasses = {
    sm: 'space-y-2',
    md: 'space-y-3 sm:space-y-4',
    lg: 'space-y-4 sm:space-y-6',
  };

  return (
    <div className={cn(gapClasses[gap], className)}>
      {children}
    </div>
  );
}

/**
 * Export index for product components
 */
export { default as ProductCard, MobileProductCard, DesktopProductCard } from './ProductCard';
