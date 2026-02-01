/**
 * Device Detection Utilities
 * Provides server-side and client-side device type detection
 */

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface DeviceInfo {
  type: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  screenWidth: number;
  screenHeight: number;
  userAgent: string;
}

// Breakpoints aligned with Tailwind defaults
export const BREAKPOINTS = {
  mobile: 0,
  sm: 640,
  md: 768, // Tablet starts here
  lg: 1024, // Desktop starts here
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Check if running in browser environment
 */
export function isBrowser(): boolean {
  return typeof globalThis.window !== 'undefined';
}

/**
 * Detect device type based on screen width
 */
export function getDeviceType(width?: number): DeviceType {
  const screenWidth = width ?? (isBrowser() ? globalThis.innerWidth : 1024);

  if (screenWidth < BREAKPOINTS.md) {
    return 'mobile';
  }
  if (screenWidth < BREAKPOINTS.lg) {
    return 'tablet';
  }
  return 'desktop';
}

/**
 * Check if device supports touch
 */
export function isTouchDevice(): boolean {
  if (!isBrowser()) return false;

  return (
    'ontouchstart' in globalThis ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - msMaxTouchPoints is IE-specific
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Check if device is mobile based on screen width
 */
export function isMobile(width?: number): boolean {
  const screenWidth = width ?? (isBrowser() ? globalThis.innerWidth : 1024);
  return screenWidth < BREAKPOINTS.md;
}

/**
 * Check if device is tablet based on screen width
 */
export function isTablet(width?: number): boolean {
  const screenWidth = width ?? (isBrowser() ? window.innerWidth : 1024);
  return screenWidth >= BREAKPOINTS.md && screenWidth < BREAKPOINTS.lg;
}

/**
 * Check if device is desktop based on screen width
 */
export function isDesktop(width?: number): boolean {
  const screenWidth = width ?? (isBrowser() ? window.innerWidth : 1024);
  return screenWidth >= BREAKPOINTS.lg;
}

/**
 * Parse user agent to detect mobile devices
 */
export function isMobileUserAgent(userAgent?: string): boolean {
  const ua = userAgent ?? (isBrowser() ? navigator.userAgent : '');
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(ua);
}

/**
 * Get comprehensive device info
 */
export function getDeviceInfo(): DeviceInfo {
  if (!isBrowser()) {
    return {
      type: 'desktop',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouchDevice: false,
      screenWidth: 1024,
      screenHeight: 768,
      userAgent: '',
    };
  }

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const type = getDeviceType(screenWidth);

  return {
    type,
    isMobile: type === 'mobile',
    isTablet: type === 'tablet',
    isDesktop: type === 'desktop',
    isTouchDevice: isTouchDevice(),
    screenWidth,
    screenHeight,
    userAgent: navigator.userAgent,
  };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (!isBrowser()) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if device is in portrait orientation
 */
export function isPortrait(): boolean {
  if (!isBrowser()) return false;
  return window.innerHeight > window.innerWidth;
}

/**
 * Check if device is in landscape orientation
 */
export function isLandscape(): boolean {
  if (!isBrowser()) return false;
  return window.innerWidth > window.innerHeight;
}

/**
 * Get safe area insets (for devices with notches)
 */
export function getSafeAreaInsets(): { top: number; right: number; bottom: number; left: number } {
  if (!isBrowser()) {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  const style = getComputedStyle(document.documentElement);

  return {
    top: parseInt(style.getPropertyValue('--sat') || '0', 10),
    right: parseInt(style.getPropertyValue('--sar') || '0', 10),
    bottom: parseInt(style.getPropertyValue('--sab') || '0', 10),
    left: parseInt(style.getPropertyValue('--sal') || '0', 10),
  };
}
