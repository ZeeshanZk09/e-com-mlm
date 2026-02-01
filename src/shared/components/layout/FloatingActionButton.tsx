'use client';

import { Plus } from 'lucide-react';
import { type ReactNode, useCallback, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { useHaptics } from '@/hooks';

interface FloatingActionButtonProps {
  /** Click handler */
  readonly onClick: () => void;
  /** Custom icon (defaults to Plus) */
  readonly icon?: ReactNode;
  /** Accessibility label */
  readonly label: string;
  /** Button variant */
  readonly variant?: 'primary' | 'secondary' | 'destructive';
  /** Size variant */
  readonly size?: 'default' | 'large';
  /** Whether to show an extended label */
  readonly extended?: boolean;
  /** Extended label text */
  readonly extendedLabel?: string;
  /** Whether the button is disabled */
  readonly disabled?: boolean;
  /** Additional class names */
  readonly className?: string;
  /** Show a mini FAB */
  readonly mini?: boolean;
}

/**
 * Floating Action Button (FAB)
 *
 * Material Design inspired FAB for mobile interfaces.
 * Provides a primary action that floats above content.
 *
 * Features:
 * - Touch-optimized with 56px touch target
 * - Haptic feedback on press
 * - Extended mode for label + icon
 * - Smooth press animation
 * - Multiple variants and sizes
 */
export default function FloatingActionButton({
  onClick,
  icon,
  label,
  variant = 'primary',
  size = 'default',
  extended = false,
  extendedLabel,
  disabled = false,
  className,
  mini = false,
}: FloatingActionButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const { medium } = useHaptics();

  const handlePress = useCallback(() => {
    if (disabled) return;
    setIsPressed(true);
    medium();
  }, [disabled, medium]);

  const handleRelease = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleClick = useCallback(() => {
    if (disabled) return;
    onClick();
  }, [disabled, onClick]);

  const variantClasses = {
    primary: 'bg-[#0b6b2e] hover:bg-[#0b6b2e]/90 text-white shadow-lg shadow-[#0b6b2e]/25',
    secondary: 'bg-card hover:bg-muted text-foreground border border-border shadow-lg',
    destructive:
      'bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg shadow-destructive/25',
  };

  const sizeClasses = mini ? 'w-10 h-10' : size === 'large' ? 'w-16 h-16' : 'w-14 h-14';

  const iconSize = mini ? 'w-4 h-4' : size === 'large' ? 'w-7 h-7' : 'w-6 h-6';

  if (extended && extendedLabel) {
    return (
      <button
        type='button'
        onClick={handleClick}
        onMouseDown={handlePress}
        onMouseUp={handleRelease}
        onMouseLeave={handleRelease}
        onTouchStart={handlePress}
        onTouchEnd={handleRelease}
        disabled={disabled}
        aria-label={label}
        className={cn(
          // Base styles
          'inline-flex items-center gap-2 px-4 rounded-full',
          'font-medium text-sm',
          'touch-manipulation',
          'transition-all duration-150',
          // Height
          mini ? 'h-10' : size === 'large' ? 'h-16' : 'h-14',
          // Variant
          variantClasses[variant],
          // States
          isPressed && 'scale-95',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        {icon ?? <Plus className={iconSize} />}
        <span>{extendedLabel}</span>
      </button>
    );
  }

  return (
    <button
      type='button'
      onClick={handleClick}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={handleRelease}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
      disabled={disabled}
      aria-label={label}
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-full',
        'touch-manipulation',
        'transition-all duration-150',
        // Size
        sizeClasses,
        // Variant
        variantClasses[variant],
        // States
        isPressed && 'scale-90',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {icon ?? <Plus className={iconSize} />}
    </button>
  );
}

/**
 * FAB Container Component
 * Positions FAB in the correct location on the screen
 */
export function FABContainer({
  children,
  position = 'bottom-right',
  offset = { bottom: 96, right: 16 },
  className,
}: {
  readonly children: ReactNode;
  readonly position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  readonly offset?: { bottom?: number; right?: number; left?: number };
  readonly className?: string;
}) {
  const positionClasses = {
    'bottom-right': 'right-4',
    'bottom-left': 'left-4',
    'bottom-center': 'left-1/2 -translate-x-1/2',
  };

  return (
    <div
      className={cn('fixed z-50 md:hidden', positionClasses[position], className)}
      style={{
        bottom: offset.bottom ?? 96,
        ...(position === 'bottom-right' && { right: offset.right ?? 16 }),
        ...(position === 'bottom-left' && { left: offset.left ?? 16 }),
      }}
    >
      {children}
    </div>
  );
}

/**
 * Speed Dial FAB
 * Expandable FAB with multiple actions
 */
export function SpeedDialFAB({
  actions,
  mainIcon,
  mainLabel,
  variant = 'primary',
}: {
  readonly actions: Array<{
    icon: ReactNode;
    label: string;
    onClick: () => void;
  }>;
  readonly mainIcon?: ReactNode;
  readonly mainLabel: string;
  readonly variant?: 'primary' | 'secondary';
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { light, medium } = useHaptics();

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
    medium();
  }, [medium]);

  const handleActionClick = useCallback(
    (action: () => void) => {
      light();
      action();
      setIsOpen(false);
    },
    [light]
  );

  return (
    <div className='relative'>
      {/* Action buttons */}
      <div
        className={cn(
          'absolute bottom-16 right-0 flex flex-col-reverse gap-3',
          'transition-all duration-200',
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        {actions.map((action, index) => (
          <div key={index} className='flex items-center gap-2 justify-end'>
            <span className='bg-card px-3 py-1.5 rounded-lg text-sm font-medium shadow-md border border-border whitespace-nowrap'>
              {action.label}
            </span>
            <FloatingActionButton
              onClick={() => handleActionClick(action.onClick)}
              icon={action.icon}
              label={action.label}
              variant='secondary'
              mini
            />
          </div>
        ))}
      </div>

      {/* Main FAB */}
      <FloatingActionButton
        onClick={handleToggle}
        icon={
          <Plus
            className={cn('w-6 h-6 transition-transform duration-200', isOpen && 'rotate-45')}
          />
        }
        label={mainLabel}
        variant={variant}
      />

      {/* Backdrop */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/20 -z-10'
          onClick={() => setIsOpen(false)}
          aria-hidden='true'
        />
      )}
    </div>
  );
}
