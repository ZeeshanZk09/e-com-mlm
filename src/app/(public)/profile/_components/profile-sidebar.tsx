'use client';

import {
  Camera,
  CreditCard,
  DollarSign,
  Lock,
  Menu,
  Shield,
  Trash2,
  User,
  Users,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/shared/components/auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';

const profileTabs = [
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    href: '/profile',
    description: 'Manage your personal information',
  },
  {
    id: 'security',
    label: 'Security',
    icon: Lock,
    href: '/profile/security',
    description: 'Password and authentication',
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: CreditCard,
    href: '/profile/billing',
    description: 'Billing history and subscriptions',
  },
];

const mlmTabs = [
  {
    id: 'mlm-dashboard',
    label: 'MLM Dashboard',
    icon: Users,
    href: '/profile/mlm',
    description: 'View your MLM network overview',
  },
  {
    id: 'mlm-network',
    label: 'My Network',
    icon: Users,
    href: '/profile/mlm/team',
    description: 'Manage your downline team',
  },
  {
    id: 'mlm-commissions',
    label: 'Commissions',
    icon: DollarSign,
    href: '/profile/mlm/commissions',
    description: 'View your earnings history',
  },
  {
    id: 'mlm-wallet',
    label: 'Wallet',
    icon: Wallet,
    href: '/profile/mlm/wallet',
    description: 'Manage withdrawals',
  },
];

export default function ProfileSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Get current page title for mobile header
  const currentTab = [...profileTabs, ...mlmTabs].find((tab) => tab.href === pathname);

  const SidebarContent = () => (
    <>
      {/* User Card */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col items-center text-center'>
            <div className='relative mb-4'>
              <Avatar className='h-24 w-24'>
                <AvatarImage src={user?.image ?? undefined} />
                <AvatarFallback className='uppercase text-2xl'>
                  {(user?.name as string)?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <Link
                href='/profile/photo'
                onClick={() => setOpen(false)}
                className='absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors'
              >
                <Camera className='h-4 w-4' />
              </Link>
            </div>
            <h3 className='font-semibold text-lg'>{user?.name}</h3>
            <p className='text-sm text-muted-foreground'>{user?.email}</p>
            {user?.role === 'ADMIN' && (
              <div className='flex items-center gap-1 mt-2 text-xs text-purple-600 bg-purple-50 dark:bg-purple-950/50 px-2 py-1 rounded-full'>
                <Shield className='h-3 w-3' />
                Administrator
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <nav className='space-y-1'>
        {profileTabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className='h-5 w-5' />
              <div>
                <p className='font-medium text-sm'>{tab.label}</p>
              </div>
            </Link>
          );
        })}

        {/* MLM Section - Only show if user has MLM enabled */}
        {user?.isMLMEnabled && (
          <>
            <Separator className='my-4' />
            <p className='px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
              MLM Network
            </p>
            {mlmTabs.map((tab) => {
              const isActive = pathname === tab.href;
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className='h-5 w-5' />
                  <div>
                    <p className='font-medium text-sm'>{tab.label}</p>
                  </div>
                </Link>
              );
            })}
          </>
        )}

        <Separator className='my-4' />
        <Link
          href='/profile/delete'
          onClick={() => setOpen(false)}
          className='flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-destructive hover:bg-destructive/10'
        >
          <Trash2 className='h-5 w-5' />
          <p className='font-medium text-sm'>Delete Account</p>
        </Link>
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile: Show menu button and sheet */}
      <div className='lg:hidden'>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant='outline' className='w-full flex items-center justify-between gap-3'>
              <div className='flex items-center gap-3'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={user?.image ?? undefined} />
                  <AvatarFallback className='uppercase text-xs'>
                    {(user?.name as string)?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className='text-left'>
                  <p className='font-medium text-sm'>{currentTab?.label || 'Profile'}</p>
                  <p className='text-xs text-muted-foreground'>{user?.email}</p>
                </div>
              </div>
              <Menu className='h-5 w-5' />
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='w-[300px] sm:w-[350px] overflow-y-auto'>
            <SheetHeader>
              <SheetTitle>Account Menu</SheetTitle>
            </SheetHeader>
            <div className='mt-6 space-y-6'>
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Show regular sidebar */}
      <aside className='hidden lg:block space-y-6'>
        <SidebarContent />
      </aside>
    </>
  );
}
