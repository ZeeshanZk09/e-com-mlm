/**
 * Responsive Utilities
 * Helper functions for responsive design and media queries
 */

import { BREAKPOINTS, type DeviceType } from './detection';

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * CSS media query strings for each breakpoint
 */
export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.md - 1}px)`,
  tablet: `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
  desktop: `(min-width: ${BREAKPOINTS.lg}px)`,
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  '2xl': `(min-width: ${BREAKPOINTS['2xl']}px)`,
  touch: '(hover: none) and (pointer: coarse)',
  mouse: '(hover: hover) and (pointer: fine)',
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  darkMode: '(prefers-color-scheme: dark)',
} as const;

/**
 * Get responsive value based on device type
 */
export function getResponsiveValue<T>(
  values: Partial<Record<DeviceType, T>>,
  deviceType: DeviceType,
  defaultValue: T
): T {
  return values[deviceType] ?? defaultValue;
}

/**
 * Create responsive class string
 */
export function createResponsiveClasses(
  baseClass: string,
  responsiveClasses: Partial<Record<Breakpoint, string>> = {}
): string {
  const classes = [baseClass];

  for (const [breakpoint, className] of Object.entries(responsiveClasses)) {
    if (className) {
      classes.push(`${breakpoint}:${className}`);
    }
  }

  return classes.join(' ');
}

/**
 * Mobile-first responsive utilities
 */
export const responsive = {
  /**
   * Show only on mobile (hidden on tablet+)
   */
  mobileOnly: 'block md:hidden',

  /**
   * Show only on tablet (hidden on mobile and desktop)
   */
  tabletOnly: 'hidden md:block lg:hidden',

  /**
   * Show only on desktop (hidden on mobile and tablet)
   */
  desktopOnly: 'hidden lg:block',

  /**
   * Show on tablet and up (hidden on mobile)
   */
  tabletUp: 'hidden md:block',

  /**
   * Show on mobile and tablet (hidden on desktop)
   */
  tabletDown: 'block lg:hidden',

  /**
   * Touch device optimized (higher touch targets, no hover)
   */
  touchOptimized: 'touch-manipulation active:scale-[0.98] transition-transform',

  /**
   * Minimum touch target size (44px)
   */
  touchTarget: 'min-h-[44px] min-w-[44px]',
} as const;

/**
 * Create container query class
 */
export function containerQuery(size: 'sm' | 'md' | 'lg' | 'xl', className: string): string {
  return `@container (min-width: ${BREAKPOINTS[size]}px) { ${className} }`;
}

/**
 * Spacing scale for different devices
 */
export const spacing = {
  mobile: {
    page: 'px-4',
    section: 'py-8',
    gap: 'gap-4',
  },
  tablet: {
    page: 'px-6',
    section: 'py-12',
    gap: 'gap-6',
  },
  desktop: {
    page: 'px-8',
    section: 'py-16',
    gap: 'gap-8',
  },
} as const;

/**
 * Get responsive spacing classes
 */
export function getResponsiveSpacing(type: 'page' | 'section' | 'gap'): string {
  return `${spacing.mobile[type]} md:${spacing.tablet[type].split(' ')[0].replace(spacing.mobile[type].split('-')[0] + '-', '')} lg:${spacing.desktop[type].split(' ')[0].replace(spacing.mobile[type].split('-')[0] + '-', '')}`;
}

/**
 * Typography scale for different devices
 */
export const typography = {
  h1: 'text-2xl sm:text-3xl lg:text-4xl xl:text-5xl',
  h2: 'text-xl sm:text-2xl lg:text-3xl xl:text-4xl',
  h3: 'text-lg sm:text-xl lg:text-2xl',
  h4: 'text-base sm:text-lg lg:text-xl',
  body: 'text-sm sm:text-base',
  small: 'text-xs sm:text-sm',
} as const;

/**
 * Grid column configurations
 */
export const gridColumns = {
  products: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  cards: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  features: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  stats: 'grid-cols-2 md:grid-cols-4',
} as const;
