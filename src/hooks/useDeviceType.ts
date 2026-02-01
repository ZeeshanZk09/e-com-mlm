'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getDeviceType,
  getDeviceInfo,
  isMobile,
  isTablet,
  isDesktop,
  isTouchDevice,
  type DeviceType,
  type DeviceInfo,
  BREAKPOINTS,
} from '@/lib/device';

/**
 * Hook to detect current device type with SSR support
 * Returns device info that updates on window resize
 */
export function useDeviceType(): {
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  isLoading: boolean;
} {
  const [deviceInfo, setDeviceInfo] = useState<{
    deviceType: DeviceType;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isTouchDevice: boolean;
    isLoading: boolean;
  }>({
    deviceType: 'desktop',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    isLoading: true,
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const type = getDeviceType(width);

      setDeviceInfo({
        deviceType: type,
        isMobile: isMobile(width),
        isTablet: isTablet(width),
        isDesktop: isDesktop(width),
        isTouchDevice: isTouchDevice(),
        isLoading: false,
      });
    };

    updateDeviceInfo();

    window.addEventListener('resize', updateDeviceInfo);
    return () => window.removeEventListener('resize', updateDeviceInfo);
  }, []);

  return deviceInfo;
}

/**
 * Hook to get comprehensive device information
 */
export function useDeviceInfo(): DeviceInfo & { isLoading: boolean } {
  const [info, setInfo] = useState<DeviceInfo & { isLoading: boolean }>({
    type: 'desktop',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    screenWidth: 1024,
    screenHeight: 768,
    userAgent: '',
    isLoading: true,
  });

  useEffect(() => {
    const updateInfo = () => {
      setInfo({
        ...getDeviceInfo(),
        isLoading: false,
      });
    };

    updateInfo();

    window.addEventListener('resize', updateInfo);
    window.addEventListener('orientationchange', updateInfo);

    return () => {
      window.removeEventListener('resize', updateInfo);
      window.removeEventListener('orientationchange', updateInfo);
    };
  }, []);

  return info;
}

/**
 * Hook to check if current breakpoint matches
 */
export function useBreakpoint(breakpoint: keyof typeof BREAKPOINTS): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const checkBreakpoint = () => {
      setMatches(window.innerWidth >= BREAKPOINTS[breakpoint]);
    };

    checkBreakpoint();

    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, [breakpoint]);

  return matches;
}

/**
 * Hook to get responsive value based on current device
 */
export function useResponsiveValue<T>(mobile: T, tablet: T, desktop: T): T {
  const { deviceType, isLoading } = useDeviceType();

  if (isLoading) {
    return desktop; // Default to desktop during SSR
  }

  switch (deviceType) {
    case 'mobile':
      return mobile;
    case 'tablet':
      return tablet;
    case 'desktop':
    default:
      return desktop;
  }
}

/**
 * Hook to detect media query match
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Hook to detect reduced motion preference
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * Hook to detect orientation
 */
export function useOrientation(): 'portrait' | 'landscape' {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    updateOrientation();

    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);

    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  return orientation;
}

/**
 * Hook to conditionally render content based on device
 * Useful for avoiding hydration mismatches
 */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * Hook to get window dimensions with SSR support
 */
export function useWindowSize(): { width: number; height: number } {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();

    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}

/**
 * Hook to track scroll position with throttling
 */
export function useScrollPosition(throttleMs: number = 100): { x: number; y: number } {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let ticking = false;
    let lastTime = 0;

    const updatePosition = () => {
      const now = Date.now();
      if (now - lastTime >= throttleMs) {
        setPosition({
          x: window.scrollX,
          y: window.scrollY,
        });
        lastTime = now;
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updatePosition);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [throttleMs]);

  return position;
}

/**
 * Hook to detect if scrolled past threshold
 */
export function useScrolledPast(threshold: number): boolean {
  const { y } = useScrollPosition(50);
  return y > threshold;
}
