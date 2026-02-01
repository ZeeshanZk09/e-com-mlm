'use client';

import * as React from 'react';
import { cn } from '@/shared/lib/utils';

interface TooltipContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  content: React.ReactNode;
  setContent: (content: React.ReactNode) => void;
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

interface TooltipProviderProps {
  readonly children: React.ReactNode;
  readonly delayDuration?: number;
}

export function TooltipProvider({ children, delayDuration = 300 }: TooltipProviderProps) {
  return <>{children}</>;
}

interface TooltipProps {
  readonly children: React.ReactNode;
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
}

export function Tooltip({ children, open: controlledOpen, onOpenChange }: TooltipProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const [content, setContent] = React.useState<React.ReactNode>(null);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  return (
    <TooltipContext.Provider value={{ open, setOpen, content, setContent }}>
      <div className='relative inline-block'>{children}</div>
    </TooltipContext.Provider>
  );
}

interface TooltipTriggerProps {
  readonly children: React.ReactNode;
  readonly asChild?: boolean;
}

export function TooltipTrigger({ children, asChild }: TooltipTriggerProps) {
  const context = React.useContext(TooltipContext);

  if (!context) {
    return <>{children}</>;
  }

  return (
    <div
      onMouseEnter={() => context.setOpen(true)}
      onMouseLeave={() => context.setOpen(false)}
      onFocus={() => context.setOpen(true)}
      onBlur={() => context.setOpen(false)}
    >
      {children}
    </div>
  );
}

interface TooltipContentProps {
  readonly children: React.ReactNode;
  readonly side?: 'top' | 'right' | 'bottom' | 'left';
  readonly sideOffset?: number;
  readonly className?: string;
}

export function TooltipContent({
  children,
  side = 'top',
  sideOffset = 4,
  className,
}: TooltipContentProps) {
  const context = React.useContext(TooltipContext);

  if (!context?.open) {
    return null;
  }

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className={cn(
        'absolute z-50 px-3 py-1.5',
        'rounded-md bg-popover text-popover-foreground shadow-md',
        'text-sm font-medium',
        'animate-in fade-in-0 zoom-in-95',
        positionClasses[side],
        className
      )}
      style={{ marginTop: side === 'bottom' ? sideOffset : undefined }}
    >
      {children}
    </div>
  );
}
