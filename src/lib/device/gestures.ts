/**
 * Touch Gesture Utilities
 * Provides swipe detection, pull-to-refresh, and haptic feedback
 */

import type React from 'react';

export interface SwipeConfig {
  threshold?: number;
  velocity?: number;
  direction?: 'horizontal' | 'vertical' | 'both';
}

export interface SwipeEvent {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
  currentX: number;
  currentY: number;
  isSwiping: boolean;
}

const DEFAULT_SWIPE_CONFIG: Required<SwipeConfig> = {
  threshold: 50,
  velocity: 0.3,
  direction: 'both',
};

/**
 * Calculate swipe direction from touch points
 */
export function getSwipeDirection(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): 'left' | 'right' | 'up' | 'down' | null {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  // Determine if it's a horizontal or vertical swipe
  if (absX > absY) {
    return deltaX > 0 ? 'right' : 'left';
  }
  if (absY > absX) {
    return deltaY > 0 ? 'down' : 'up';
  }
  return null;
}

/**
 * Calculate swipe velocity
 */
export function getSwipeVelocity(distance: number, time: number): number {
  if (time === 0) return 0;
  return Math.abs(distance / time);
}

/**
 * Check if swipe meets threshold requirements
 */
export function isValidSwipe(
  event: SwipeEvent,
  config: SwipeConfig = DEFAULT_SWIPE_CONFIG
): boolean {
  const mergedConfig = { ...DEFAULT_SWIPE_CONFIG, ...config };

  // Check distance threshold
  if (event.distance < mergedConfig.threshold) {
    return false;
  }

  // Check velocity
  if (event.velocity < mergedConfig.velocity) {
    return false;
  }

  // Check direction constraint
  if (mergedConfig.direction === 'horizontal') {
    return event.direction === 'left' || event.direction === 'right';
  }
  if (mergedConfig.direction === 'vertical') {
    return event.direction === 'up' || event.direction === 'down';
  }

  return true;
}

/**
 * Trigger haptic feedback (if supported)
 */
export function hapticFeedback(type: 'light' | 'medium' | 'heavy' | 'selection' = 'light'): void {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;

  const patterns: Record<string, number | number[]> = {
    light: 10,
    medium: 20,
    heavy: 30,
    selection: [10, 50, 10],
  };

  navigator.vibrate(patterns[type]);
}

/**
 * Create touch event handlers for swipe detection
 * Returns handlers compatible with React touch events
 */
export function createSwipeHandlers(
  onSwipe: (event: SwipeEvent) => void,
  config: SwipeConfig = DEFAULT_SWIPE_CONFIG
): {
  onTouchStart: (e: React.TouchEvent | TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent | TouchEvent) => void;
  onTouchEnd: () => void;
  onTouchCancel: () => void;
} {
  let touchState: TouchState | null = null;

  const handleTouchStart = (e: React.TouchEvent | TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;

    touchState = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      currentX: touch.clientX,
      currentY: touch.clientY,
      isSwiping: false,
    };
  };

  const handleTouchMove = (e: React.TouchEvent | TouchEvent) => {
    if (!touchState) return;

    const touch = e.touches[0];
    if (!touch) return;

    touchState.currentX = touch.clientX;
    touchState.currentY = touch.clientY;
    touchState.isSwiping = true;
  };

  const handleTouchEnd = () => {
    if (!touchState?.isSwiping) {
      touchState = null;
      return;
    }

    const endTime = Date.now();
    const deltaX = touchState.currentX - touchState.startX;
    const deltaY = touchState.currentY - touchState.startY;
    const distance = Math.hypot(deltaX, deltaY);
    const time = endTime - touchState.startTime;
    const velocity = getSwipeVelocity(distance, time);
    const direction = getSwipeDirection(
      touchState.startX,
      touchState.startY,
      touchState.currentX,
      touchState.currentY
    );

    if (direction) {
      const swipeEvent: SwipeEvent = {
        direction,
        distance,
        velocity,
        startX: touchState.startX,
        startY: touchState.startY,
        endX: touchState.currentX,
        endY: touchState.currentY,
      };

      if (isValidSwipe(swipeEvent, config)) {
        hapticFeedback('light');
        onSwipe(swipeEvent);
      }
    }

    touchState = null;
  };

  const handleTouchCancel = () => {
    touchState = null;
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
  };
}

/**
 * Pull-to-refresh threshold calculator
 */
export function getPullProgress(pullDistance: number, threshold: number = 80): number {
  return Math.min(pullDistance / threshold, 1);
}

/**
 * Check if element is at scroll top (for pull-to-refresh)
 */
export function isAtScrollTop(element: HTMLElement | Window): boolean {
  if (element === globalThis.window) {
    return globalThis.scrollY === 0;
  }
  return (element as HTMLElement).scrollTop === 0;
}

/**
 * Prevent overscroll on iOS
 */
export function preventOverscroll(element: HTMLElement): () => void {
  let startY = 0;

  const handleTouchStart = (e: TouchEvent) => {
    startY = e.touches[0]?.clientY ?? 0;
  };

  const handleTouchMove = (e: TouchEvent) => {
    const currentY = e.touches[0]?.clientY ?? 0;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    // At top, trying to scroll up
    if (scrollTop === 0 && currentY > startY) {
      e.preventDefault();
    }

    // At bottom, trying to scroll down
    if (scrollTop + clientHeight >= scrollHeight && currentY < startY) {
      e.preventDefault();
    }
  };

  element.addEventListener('touchstart', handleTouchStart, { passive: true });
  element.addEventListener('touchmove', handleTouchMove, { passive: false });

  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchmove', handleTouchMove);
  };
}
