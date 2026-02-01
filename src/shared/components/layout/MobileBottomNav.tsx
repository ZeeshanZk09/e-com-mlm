'use client';

import { Grid3x3, Home, Search, ShoppingCart, User, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/shared/lib/utils';
import { useHaptics } from '@/hooks';

interface NavItemProps {
  readonly href: string;
  readonly icon: React.ElementType;
  readonly label: string;
  readonly badge?: number;
  readonly active?: boolean;
  readonly onClick?: () => void;
}

function NavItem({ href, icon: Icon, label, badge, active, onClick }: NavItemProps) {
  const { light } = useHaptics();

  const handleClick = useCallback(() => {
    if (active) return; // Don't provide feedback if already active
    light();
    onClick?.();
  }, [active, light, onClick]);

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        // Base styles with minimum touch target
        'flex flex-col items-center justify-center gap-0.5 relative',
        'min-h-[56px] min-w-[56px] rounded-xl',
        'touch-manipulation active:scale-95 transition-all duration-150',
        // Color states
        active
          ? 'text-[#0b6b2e] bg-[#0b6b2e]/10'
          : 'text-muted-foreground hover:text-foreground active:bg-muted/50'
      )}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
    >
      <div className='relative'>
        <Icon className={cn('w-5 h-5 transition-all', active && 'stroke-[2.5px]')} />
        {badge !== undefined && badge > 0 && (
          <span
            className={cn(
              'absolute -top-1.5 -right-1.5',
              'bg-destructive text-destructive-foreground',
              'text-[10px] font-bold rounded-full',
              'min-w-[18px] h-[18px] px-1',
              'flex items-center justify-center',
              'animate-bounce-in'
            )}
          >
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </div>
      <span
        className={cn('text-[10px] font-medium leading-none mt-0.5', active && 'font-semibold')}
      >
        {label}
      </span>

      {/* Active indicator */}
      {active && (
        <div
          className='absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#0b6b2e] rounded-full'
          aria-hidden='true'
        />
      )}
    </Link>
  );
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Fetch cart count from API or local storage
    const fetchCartCount = async () => {
      try {
        const response = await fetch('/api/cart/count');
        const data = await response.json();
        setCartCount(data.count || 0);
      } catch {
        // Fallback to localStorage
        const cart = localStorage.getItem('cart');
        if (cart) {
          try {
            const items = JSON.parse(cart);
            setCartCount(items.length);
          } catch {
            setCartCount(0);
          }
        }
      }
    };

    fetchCartCount();

    // Listen for cart updates
    const handleCartUpdate = (event: CustomEvent) => {
      setCartCount(event.detail?.count || 0);
    };

    window.addEventListener('cart-updated', handleCartUpdate as EventListener);
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate as EventListener);
    };
  }, []);

  // Define navigation items
  const navItems = [
    {
      href: '/',
      icon: Home,
      label: 'Home',
      active: pathname === '/',
    },
    {
      href: '/shop',
      icon: Grid3x3,
      label: 'Shop',
      active: pathname.startsWith('/shop') || pathname.startsWith('/category'),
    },
    {
      href: '/search',
      icon: Search,
      label: 'Search',
      active: pathname === '/search',
    },
    {
      href: '/bag',
      icon: ShoppingCart,
      label: 'Cart',
      badge: cartCount,
      active: pathname === '/bag',
    },
    {
      href: '/profile',
      icon: User,
      label: 'Account',
      active: pathname.startsWith('/profile'),
    },
  ];

  // Check if user has MLM enabled - show earnings tab instead of search
  const mlmEnabled = true; // This would come from user context/session

  const displayItems = mlmEnabled
    ? [
        navItems[0],
        navItems[1],
        {
          href: '/profile/mlm',
          icon: TrendingUp,
          label: 'Earnings',
          active: pathname.startsWith('/profile/mlm'),
        },
        navItems[3],
        navItems[4],
      ]
    : navItems;

  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed nav */}
      <div className='h-[72px]' aria-hidden='true' />

      {/* Fixed Bottom Navigation */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50',
          'bg-background/95 backdrop-blur-lg',
          'border-t border-border',
          'safe-area-inset-bottom'
        )}
      >
        {/* Add padding for devices with home indicators */}
        <div className='grid grid-cols-5 px-2 pt-1 pb-safe'>
          {displayItems.map((item) => (
            <NavItem
              key={item?.href}
              href={item?.href ?? '/'}
              icon={item?.icon ?? Home}
              label={item?.label ?? ''}
              badge={'badge' in (item ?? {}) ? (item as { badge?: number }).badge : undefined}
              active={item?.active}
            />
          ))}
        </div>
      </div>
    </>
  );
}
