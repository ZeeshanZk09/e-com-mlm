'use client';

import {
  ChevronDown,
  ChevronRight,
  Grid3x3,
  Heart,
  Home,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  User,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useCallback } from 'react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  children?: NavItem[];
}

interface NavGroupProps {
  readonly title: string;
  readonly items: readonly NavItem[];
  readonly collapsed?: boolean;
  readonly pathname: string;
}

function NavGroup({ title, items, collapsed, pathname }: NavGroupProps) {
  return (
    <div className='space-y-1'>
      {!collapsed && (
        <p className='px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider'>
          {title}
        </p>
      )}
      {items.map((item) => (
        <NavItemComponent key={item.href} item={item} collapsed={collapsed} pathname={pathname} />
      ))}
    </div>
  );
}

function NavItemComponent({
  item,
  collapsed,
  pathname,
  depth = 0,
}: {
  readonly item: NavItem;
  readonly collapsed?: boolean;
  readonly pathname: string;
  readonly depth?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  const handleToggle = useCallback(() => {
    if (hasChildren) {
      setExpanded((prev) => !prev);
    }
  }, [hasChildren]);

  const content = (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
        'cursor-pointer select-none',
        depth > 0 && 'ml-4',
        isActive
          ? 'bg-[#0b6b2e]/10 text-[#0b6b2e] font-medium'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
      onClick={hasChildren ? handleToggle : undefined}
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'stroke-[2.5]')} />
      {!collapsed && (
        <>
          <span className='flex-1 truncate'>{item.label}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <span className='bg-destructive text-destructive-foreground text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center'>
              {item.badge > 99 ? '99+' : item.badge}
            </span>
          )}
          {hasChildren && (
            <ChevronDown className={cn('w-4 h-4 transition-transform', expanded && 'rotate-180')} />
          )}
        </>
      )}
    </div>
  );

  const linkContent = hasChildren ? (
    content
  ) : (
    <Link href={item.href} className='block'>
      {content}
    </Link>
  );

  return (
    <div>
      {collapsed ? (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={item.href} className='block'>
                <div
                  className={cn(
                    'flex items-center justify-center p-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-[#0b6b2e]/10 text-[#0b6b2e]'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className={cn('w-5 h-5', isActive && 'stroke-[2.5]')} />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className='absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center'>
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent side='right' className='font-medium'>
              {item.label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        linkContent
      )}

      {/* Child items */}
      {hasChildren && expanded && !collapsed && (
        <div className='mt-1 space-y-1'>
          {item.children!.map((child) => (
            <NavItemComponent
              key={child.href}
              item={child}
              collapsed={collapsed}
              pathname={pathname}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DesktopSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const mainNavItems: NavItem[] = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop', href: '/shop', icon: Grid3x3 },
    { label: 'Cart', href: '/bag', icon: ShoppingCart, badge: 0 },
    { label: 'Favorites', href: '/favourites', icon: Heart },
  ];

  const accountNavItems: NavItem[] = [
    { label: 'Profile', href: '/profile', icon: User },
    { label: 'Orders', href: '/my-orders', icon: Package },
    { label: 'Addresses', href: '/address', icon: ShoppingBag },
  ];

  const mlmNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/profile/mlm', icon: TrendingUp },
    { label: 'Wallet', href: '/profile/mlm/wallet', icon: Wallet },
    { label: 'Team', href: '/profile/mlm/team', icon: User },
  ];

  return (
    <div
      className={cn(
        'h-full flex flex-col',
        'bg-card border-r border-border',
        'transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className='p-4 border-b border-border'>
        <Link href='/' className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-linear-to-br from-[#0b6b2e] to-[#7be08a] rounded-lg flex items-center justify-center text-white font-bold'>
            G
          </div>
          {!collapsed && (
            <span className='text-xl font-bold bg-linear-to-r from-[#0b6b2e] to-[#7be08a] bg-clip-text text-transparent'>
              GoShop
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className='flex-1 p-3 space-y-6 overflow-y-auto'>
        <NavGroup title='Main' items={mainNavItems} collapsed={collapsed} pathname={pathname} />
        <NavGroup
          title='Account'
          items={accountNavItems}
          collapsed={collapsed}
          pathname={pathname}
        />
        <NavGroup title='Earnings' items={mlmNavItems} collapsed={collapsed} pathname={pathname} />
      </nav>

      {/* Bottom section */}
      <div className='p-3 border-t border-border space-y-2'>
        <NavItemComponent
          item={{ label: 'Settings', href: '/profile/security', icon: Settings }}
          collapsed={collapsed}
          pathname={pathname}
        />

        {/* Collapse toggle */}
        <Button
          variant='ghost'
          size='sm'
          className='w-full justify-start gap-3'
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronRight className={cn('w-4 h-4 transition-transform', collapsed && 'rotate-180')} />
          {!collapsed && <span>Collapse</span>}
        </Button>

        {/* Sign out */}
        <Button
          variant='ghost'
          size='sm'
          className='w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10'
        >
          <LogOut className='w-4 h-4' />
          {!collapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </div>
  );
}
