'use client';

import {
  HomeIcon,
  LayoutListIcon,
  Menu,
  ReceiptIcon,
  Store,
  TicketPercentIcon,
  User,
  Network,
  Wallet,
  Settings,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from '../ui/button';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const sidebarLinks = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Users', href: '/admin/users', icon: User },
    { name: 'Coupons', href: '/admin/coupons', icon: TicketPercentIcon },
    { name: 'Inventory', href: '/admin/add-product', icon: Store },
    { name: 'Orders', href: '/admin/orders', icon: LayoutListIcon },
    { name: 'Invoices', href: '/admin/invoices', icon: ReceiptIcon },
  ];

  const mlmLinks = [
    { name: 'MLM Overview', href: '/admin/mlm', icon: Network },
    { name: 'MLM Members', href: '/admin/mlm/members', icon: Users },
    { name: 'Commissions', href: '/admin/mlm/commissions', icon: TrendingUp },
    { name: 'Withdrawals', href: '/admin/mlm/withdrawals', icon: Wallet },
    { name: 'MLM Settings', href: '/admin/mlm/settings', icon: Settings },
  ];

  return (
    <aside
      aria-label='Admin sidebar'
      className={` fixed top-14 left-0 h-[calc(100vh-3.5rem)] flex flex-col bg-card shadow-sm transition-all duration-300 z-40 ${
        open ? 'w-64' : 'w-12'
      }`}
    >
      {/* Top header: uses flex to position title and menu button */}
      <div className={`flex items-center ${open ? 'justify-end' : 'justify-center'} p-2 border-b`}>
        {/* Menu / Toggle button aligned with flex (no absolute positioning) */}
        <Button
          onClick={() => setOpen((p) => !p)}
          aria-expanded={open}
          aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
          size='icon'
          variant='outline'
          className='p-2'
        >
          <Menu className='w-5 h-5' />
        </Button>
      </div>

      {/* Links container */}
      <nav className='flex-1 overflow-y-auto'>
        <ul className='flex flex-col gap-2 p-2'>
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`group flex items-center gap-3 p-1 rounded-md transition-colors font-medium 
                    ${
                      isActive
                        ? 'bg-green-50 text-green-700 shadow ring-2 ring-green-100'
                        : 'text-foreground hover:bg-accent hover:text-foreground'
                    }`}
                >
                  <span
                    className={`flex items-center justify-center w-6 h-6 transition-colors duration-150 ${
                      isActive ? 'text-green-600' : 'text-foreground/60 group-hover:text-green-600'
                    }`}
                  >
                    <Icon size={18} />
                  </span>

                  {/* Label hides when collapsed */}
                  <span className={`${open ? 'block truncate' : 'hidden'}`}>{link.name}</span>

                  {/* Active indicator */}
                  {isActive && open && (
                    <span className='ml-auto h-5 w-1.5 bg-green-500 rounded-l' />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* MLM Section Divider */}
        <div className={`px-3 py-2 ${open ? 'block' : 'hidden'}`}>
          <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
            MLM System
          </span>
        </div>

        <ul className='flex flex-col gap-2 p-2 pt-0'>
          {mlmLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`group flex items-center gap-3 p-1 rounded-md transition-colors font-medium 
                    ${
                      isActive
                        ? 'bg-purple-50 text-purple-700 shadow ring-2 ring-purple-100'
                        : 'text-foreground hover:bg-accent hover:text-foreground'
                    }`}
                >
                  <span
                    className={`flex items-center justify-center w-6 h-6 transition-colors duration-150 ${
                      isActive
                        ? 'text-purple-600'
                        : 'text-foreground/60 group-hover:text-purple-600'
                    }`}
                  >
                    <Icon size={18} />
                  </span>

                  {/* Label hides when collapsed */}
                  <span className={`${open ? 'block truncate' : 'hidden'}`}>{link.name}</span>

                  {/* Active indicator */}
                  {isActive && open && (
                    <span className='ml-auto h-5 w-1.5 bg-purple-500 rounded-l' />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Optional footer area (collapse hint) */}
      <div className='px-3 py-3 border-t'>
        <small className={`text-xs ${open ? 'block' : 'hidden'}`}>v1.0.0</small>
      </div>
    </aside>
  );
}
