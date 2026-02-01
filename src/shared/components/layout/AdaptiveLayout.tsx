'use client';

import { type ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { AdaptiveProvider } from './AdaptiveContext';
import MobileBottomNav from './MobileBottomNav';
import DesktopSidebar from './DesktopSidebar';
import FloatingActionButton from './FloatingActionButton';

interface AdaptiveLayoutProps {
  readonly children: ReactNode;
  readonly className?: string;
  /** Show the desktop sidebar navigation */
  readonly showSidebar?: boolean;
  /** Show the mobile bottom navigation */
  readonly showBottomNav?: boolean;
  /** Show the floating action button on mobile */
  readonly showFAB?: boolean;
  /** FAB action callback */
  readonly onFABClick?: () => void;
  /** FAB icon component */
  readonly fabIcon?: ReactNode;
  /** FAB label for accessibility */
  readonly fabLabel?: string;
  /** Custom header component (replaces default) */
  readonly header?: ReactNode;
  /** Custom footer component (replaces default) */
  readonly footer?: ReactNode;
  /** Whether this is a full-bleed layout (no max-width constraint) */
  readonly fullBleed?: boolean;
  /** Background style variant */
  readonly background?: 'default' | 'subtle' | 'gradient';
}

/**
 * Adaptive Layout Component
 *
 * Main layout wrapper that provides:
 * - Mobile: Bottom navigation + optional FAB
 * - Desktop: Sidebar navigation (optional)
 * - Responsive padding and max-width
 * - Device-aware context for child components
 */
export default function AdaptiveLayout({
  children,
  className,
  showSidebar = false,
  showBottomNav = true,
  showFAB = false,
  onFABClick,
  fabIcon,
  fabLabel = 'Main action',
  header,
  footer,
  fullBleed = false,
  background = 'default',
}: AdaptiveLayoutProps) {
  const backgroundClasses = {
    default: 'bg-background',
    subtle: 'bg-muted/30',
    gradient: 'bg-linear-to-b from-background to-muted/20',
  };

  return (
    <AdaptiveProvider>
      <div className={cn('min-h-screen', backgroundClasses[background])}>
        {/* Optional Custom Header */}
        {header}

        {/* Desktop Sidebar Navigation */}
        {showSidebar && (
          <aside className='hidden lg:block fixed left-0 top-0 bottom-0 w-64 z-40'>
            <DesktopSidebar />
          </aside>
        )}

        {/* Main Content Area */}
        <main
          className={cn(
            'min-h-screen',
            // Bottom padding for mobile nav
            showBottomNav && 'pb-20 md:pb-0',
            // Left padding for desktop sidebar
            showSidebar && 'lg:pl-64',
            className
          )}
        >
          {/* Container with responsive width */}
          <div className={cn('mx-auto w-full', !fullBleed && 'max-w-7xl px-4 sm:px-6 lg:px-8')}>
            {children}
          </div>
        </main>

        {/* Optional Custom Footer */}
        {footer}

        {/* Mobile Bottom Navigation */}
        {showBottomNav && (
          <nav
            className='md:hidden fixed bottom-0 left-0 right-0 z-50'
            role='navigation'
            aria-label='Mobile navigation'
          >
            <MobileBottomNav />
          </nav>
        )}

        {/* Mobile Floating Action Button */}
        {showFAB && onFABClick && (
          <div className='md:hidden fixed bottom-24 right-4 z-50'>
            <FloatingActionButton onClick={onFABClick} icon={fabIcon} label={fabLabel} />
          </div>
        )}
      </div>
    </AdaptiveProvider>
  );
}

/**
 * Simple wrapper that just provides the adaptive context
 * without any layout elements (for pages with custom layouts)
 */
export function AdaptiveWrapper({ children }: { readonly children: ReactNode }) {
  return <AdaptiveProvider>{children}</AdaptiveProvider>;
}
