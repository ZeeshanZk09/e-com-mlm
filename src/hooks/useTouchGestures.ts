'use client';

import { useCallback, useRef, useState, useEffect, type RefObject } from 'react';
import {
  createSwipeHandlers,
  hapticFeedback,
  getPullProgress,
  isAtScrollTop,
  type SwipeConfig,
  type SwipeEvent,
} from '@/lib/device';

/**
 * Hook for swipe gesture detection
 */
export function useSwipeable(
  config: SwipeConfig & {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    onSwipe?: (event: SwipeEvent) => void;
  } = {}
) {
  const { onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onSwipe, ...swipeConfig } = config;

  const handleSwipe = useCallback(
    (event: SwipeEvent) => {
      onSwipe?.(event);

      switch (event.direction) {
        case 'left':
          onSwipeLeft?.();
          break;
        case 'right':
          onSwipeRight?.();
          break;
        case 'up':
          onSwipeUp?.();
          break;
        case 'down':
          onSwipeDown?.();
          break;
      }
    },
    [onSwipe, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]
  );

  return createSwipeHandlers(handleSwipe, swipeConfig);
}

/**
 * Hook for pull-to-refresh functionality
 */
export function usePullToRefresh(
  onRefresh: () => Promise<void>,
  options: {
    threshold?: number;
    disabled?: boolean;
    containerRef?: RefObject<HTMLElement | null>;
  } = {}
): {
  pullProgress: number;
  isPulling: boolean;
  isRefreshing: boolean;
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
} {
  const { threshold = 80, disabled = false, containerRef } = options;

  const [pullProgress, setPullProgress] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || isRefreshing) return;

      const container = containerRef?.current ?? window;
      if (!isAtScrollTop(container as HTMLElement)) return;

      startYRef.current = e.touches[0]?.clientY ?? 0;
      setIsPulling(true);
    },
    [disabled, isRefreshing, containerRef]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isPulling || disabled || isRefreshing) return;

      currentYRef.current = e.touches[0]?.clientY ?? 0;
      const pullDistance = Math.max(0, currentYRef.current - startYRef.current);
      const progress = getPullProgress(pullDistance, threshold);

      setPullProgress(progress);
    },
    [isPulling, disabled, isRefreshing, threshold]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || disabled || isRefreshing) return;

    if (pullProgress >= 1) {
      hapticFeedback('medium');
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullProgress(0);
    setIsPulling(false);
    startYRef.current = 0;
    currentYRef.current = 0;
  }, [isPulling, disabled, isRefreshing, pullProgress, onRefresh]);

  return {
    pullProgress,
    isPulling,
    isRefreshing,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}

/**
 * Hook for long press detection
 */
export function useLongPress(
  onLongPress: () => void,
  options: {
    delay?: number;
    onPress?: () => void;
    onRelease?: () => void;
  } = {}
): {
  onMouseDown: () => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onTouchStart: () => void;
  onTouchEnd: () => void;
} {
  const { delay = 500, onPress, onRelease } = options;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const start = useCallback(() => {
    isLongPressRef.current = false;
    onPress?.();

    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      hapticFeedback('heavy');
      onLongPress();
    }, delay);
  }, [delay, onLongPress, onPress]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onRelease?.();
  }, [onRelease]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  };
}

/**
 * Hook for double tap detection
 */
export function useDoubleTap(
  onDoubleTap: () => void,
  options: {
    delay?: number;
    onSingleTap?: () => void;
  } = {}
): {
  onClick: () => void;
} {
  const { delay = 300, onSingleTap } = options;
  const lastTapRef = useRef(0);
  const singleTapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(() => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;

    if (timeSinceLastTap < delay && timeSinceLastTap > 0) {
      // Double tap detected
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current);
        singleTapTimerRef.current = null;
      }
      hapticFeedback('medium');
      onDoubleTap();
      lastTapRef.current = 0;
    } else {
      // First tap, wait for potential second tap
      lastTapRef.current = now;
      singleTapTimerRef.current = setTimeout(() => {
        onSingleTap?.();
        lastTapRef.current = 0;
      }, delay);
    }
  }, [delay, onDoubleTap, onSingleTap]);

  useEffect(() => {
    return () => {
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current);
      }
    };
  }, []);

  return { onClick: handleClick };
}

/**
 * Hook for pinch-to-zoom gesture
 */
export function usePinchZoom(
  onZoom: (scale: number) => void,
  options: {
    minScale?: number;
    maxScale?: number;
  } = {}
): {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  scale: number;
} {
  const { minScale = 0.5, maxScale = 3 } = options;
  const [scale, setScale] = useState(1);
  const initialDistanceRef = useRef(0);
  const initialScaleRef = useRef(1);

  const getDistance = (touches: React.TouchList): number => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    if (!touch1 || !touch2) return 0;
    return Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
  };

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        initialDistanceRef.current = getDistance(e.touches);
        initialScaleRef.current = scale;
      }
    },
    [scale]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2 && initialDistanceRef.current > 0) {
        const currentDistance = getDistance(e.touches);
        const scaleFactor = currentDistance / initialDistanceRef.current;
        const newScale = Math.min(
          maxScale,
          Math.max(minScale, initialScaleRef.current * scaleFactor)
        );
        setScale(newScale);
        onZoom(newScale);
      }
    },
    [minScale, maxScale, onZoom]
  );

  const handleTouchEnd = useCallback(() => {
    initialDistanceRef.current = 0;
  }, []);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    scale,
  };
}

/**
 * Hook for haptic feedback
 */
export function useHaptics() {
  const light = useCallback(() => hapticFeedback('light'), []);
  const medium = useCallback(() => hapticFeedback('medium'), []);
  const heavy = useCallback(() => hapticFeedback('heavy'), []);
  const selection = useCallback(() => hapticFeedback('selection'), []);

  return { light, medium, heavy, selection };
}
