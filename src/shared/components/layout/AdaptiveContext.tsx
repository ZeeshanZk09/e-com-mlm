'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useDeviceType, useIsClient } from '@/hooks';
import type { DeviceType } from '@/lib/device';

interface AdaptiveContextValue {
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  isLoading: boolean;
  isClient: boolean;
}

const AdaptiveContext = createContext<AdaptiveContextValue | null>(null);

/**
 * Provider for adaptive design context
 * Wraps the app to provide device detection throughout
 */
export function AdaptiveProvider({ children }: { readonly children: ReactNode }) {
  const deviceInfo = useDeviceType();
  const isClient = useIsClient();

  return (
    <AdaptiveContext.Provider value={{ ...deviceInfo, isClient }}>
      {children}
    </AdaptiveContext.Provider>
  );
}

/**
 * Hook to access adaptive context
 */
export function useAdaptive(): AdaptiveContextValue {
  const context = useContext(AdaptiveContext);

  if (!context) {
    // Return defaults if used outside provider (for SSR)
    return {
      deviceType: 'desktop',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouchDevice: false,
      isLoading: true,
      isClient: false,
    };
  }

  return context;
}

/**
 * Component that only renders on mobile devices
 */
export function MobileOnly({
  children,
  fallback = null,
}: {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}) {
  const { isMobile, isLoading, isClient } = useAdaptive();

  // During SSR or loading, render nothing to avoid hydration mismatch
  if (!isClient || isLoading) {
    return null;
  }

  return isMobile ? <>{children}</> : <>{fallback}</>;
}

/**
 * Component that only renders on tablet devices
 */
export function TabletOnly({
  children,
  fallback = null,
}: {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}) {
  const { isTablet, isLoading, isClient } = useAdaptive();

  if (!isClient || isLoading) {
    return null;
  }

  return isTablet ? <>{children}</> : <>{fallback}</>;
}

/**
 * Component that only renders on desktop devices
 */
export function DesktopOnly({
  children,
  fallback = null,
}: {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}) {
  const { isDesktop, isLoading, isClient } = useAdaptive();

  if (!isClient || isLoading) {
    return null;
  }

  return isDesktop ? <>{children}</> : <>{fallback}</>;
}

/**
 * Component that renders on mobile and tablet (not desktop)
 */
export function TabletDown({
  children,
  fallback = null,
}: {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}) {
  const { isMobile, isTablet, isLoading, isClient } = useAdaptive();

  if (!isClient || isLoading) {
    return null;
  }

  return isMobile || isTablet ? <>{children}</> : <>{fallback}</>;
}

/**
 * Component that renders on tablet and desktop (not mobile)
 */
export function TabletUp({
  children,
  fallback = null,
}: {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}) {
  const { isTablet, isDesktop, isLoading, isClient } = useAdaptive();

  if (!isClient || isLoading) {
    return null;
  }

  return isTablet || isDesktop ? <>{children}</> : <>{fallback}</>;
}

/**
 * Renders different content based on device type
 */
export function Responsive({
  mobile,
  tablet,
  desktop,
}: {
  readonly mobile?: ReactNode;
  readonly tablet?: ReactNode;
  readonly desktop?: ReactNode;
}) {
  const { deviceType, isLoading, isClient } = useAdaptive();

  if (!isClient || isLoading) {
    return null;
  }

  switch (deviceType) {
    case 'mobile':
      return <>{mobile}</>;
    case 'tablet':
      return <>{tablet ?? mobile}</>;
    case 'desktop':
      return <>{desktop ?? tablet ?? mobile}</>;
  }
}

/**
 * Component for touch devices only
 */
export function TouchOnly({
  children,
  fallback = null,
}: {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}) {
  const { isTouchDevice, isLoading, isClient } = useAdaptive();

  if (!isClient || isLoading) {
    return null;
  }

  return isTouchDevice ? <>{children}</> : <>{fallback}</>;
}

/**
 * Component for mouse/pointer devices only
 */
export function PointerOnly({
  children,
  fallback = null,
}: {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}) {
  const { isTouchDevice, isLoading, isClient } = useAdaptive();

  if (!isClient || isLoading) {
    return null;
  }

  return !isTouchDevice ? <>{children}</> : <>{fallback}</>;
}
