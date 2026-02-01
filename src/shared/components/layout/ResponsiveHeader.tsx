'use client';

import { Menu, Search, ShoppingCart, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { SignedIn, SignedOut } from '@/shared/components/auth';
import UserButton from '@/shared/components/profile/user-btn';
import SearchInput from '@/shared/components/SearchInput';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';

interface ResponsiveHeaderProps {
  /** Whether to show the search bar on mobile */
  readonly showMobileSearch?: boolean;
  /** Whether the header should be transparent initially (for hero sections) */
  readonly transparent?: boolean;
  /** Additional class names */
  readonly className?: string;
}

/**
 * Responsive Header Component
 *
 * Adapts between:
 * - Mobile: Compact with hamburger menu + search icon
 * - Desktop: Full navigation with visible search bar
 */
export default function ResponsiveHeader({
  showMobileSearch = true,
  transparent = false,
  className,
}: ResponsiveHeaderProps) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileSearch = useCallback(() => {
    setMobileSearchOpen((prev) => !prev);
  }, []);

  return (
    <>
      <header
        className={cn(
          'top-0 sticky z-30',
          transparent ? 'bg-transparent' : 'bg-card/95 backdrop-blur-lg',
          'border-b border-border',
          className
        )}
      >
        <nav className='px-4 md:px-6 max-w-7xl mx-auto'>
          <div className='flex items-center justify-between h-14 sm:h-16 gap-4'>
            {/* Logo */}
            <Link href='/' className='flex-shrink-0'>
              <h1 className='logo small w-full' aria-label='GO Shop - brand'>
                <span className='mark' aria-hidden='true'>
                  Go
                </span>
                <span className='word'>Shop</span>
              </h1>
            </Link>

            {/* Desktop Search */}
            <div className='hidden sm:block flex-1 max-w-md'>
              <SearchInput />
            </div>

            {/* Desktop Navigation */}
            <div className='hidden sm:flex items-center gap-4'>
              <Link
                href='/shop'
                className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
              >
                Shop
              </Link>
              <Link
                href='/mlm'
                className='text-sm font-medium text-[#0b6b2e] hover:text-[#0b6b2e]/80 transition-colors'
              >
                Earn Money
              </Link>
            </div>

            {/* Right side actions */}
            <div className='flex items-center gap-2 sm:gap-3'>
              {/* Mobile Search Toggle */}
              {showMobileSearch && (
                <button
                  type='button'
                  onClick={toggleMobileSearch}
                  className='sm:hidden p-2 rounded-lg hover:bg-muted transition-colors touch-target'
                  aria-label={mobileSearchOpen ? 'Close search' : 'Open search'}
                >
                  {mobileSearchOpen ? <X className='w-5 h-5' /> : <Search className='w-5 h-5' />}
                </button>
              )}

              {/* Cart - Desktop only (mobile has bottom nav) */}
              <Link
                href='/bag'
                className='hidden sm:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors relative'
                aria-label='Shopping cart'
              >
                <ShoppingCart className='w-5 h-5' />
              </Link>

              {/* User Button / Sign In */}
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <Button size='sm' asChild className='hidden sm:inline-flex'>
                  <Link href='/auth/sign-in'>Login</Link>
                </Button>
                <Link
                  href='/auth/sign-in'
                  className='sm:hidden p-2 rounded-lg hover:bg-muted transition-colors touch-target'
                  aria-label='Sign in'
                >
                  <span className='text-sm font-medium'>Login</span>
                </Link>
              </SignedOut>

              {/* Mobile Menu Toggle */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button
                    type='button'
                    className='sm:hidden p-2 rounded-lg hover:bg-muted transition-colors touch-target'
                    aria-label='Open menu'
                  >
                    <Menu className='w-5 h-5' />
                  </button>
                </SheetTrigger>
                <SheetContent side='right' className='w-[280px] p-0'>
                  <SheetHeader className='p-4 border-b border-border'>
                    <SheetTitle className='text-left'>Menu</SheetTitle>
                  </SheetHeader>
                  <nav className='p-4 space-y-2'>
                    <MobileNavLink href='/' onClick={() => setMobileMenuOpen(false)}>
                      Home
                    </MobileNavLink>
                    <MobileNavLink href='/shop' onClick={() => setMobileMenuOpen(false)}>
                      Shop All
                    </MobileNavLink>
                    <MobileNavLink href='/shop/new' onClick={() => setMobileMenuOpen(false)}>
                      New Arrivals
                    </MobileNavLink>
                    <MobileNavLink href='/shop/sale' onClick={() => setMobileMenuOpen(false)}>
                      Sale
                    </MobileNavLink>
                    <div className='border-t border-border my-3 pt-3'>
                      <MobileNavLink
                        href='/mlm'
                        onClick={() => setMobileMenuOpen(false)}
                        className='text-[#0b6b2e] font-medium'
                      >
                        💰 Earn Money
                      </MobileNavLink>
                    </div>
                    <div className='border-t border-border my-3 pt-3'>
                      <MobileNavLink href='/contact' onClick={() => setMobileMenuOpen(false)}>
                        Contact Us
                      </MobileNavLink>
                      <MobileNavLink href='/faq' onClick={() => setMobileMenuOpen(false)}>
                        FAQ
                      </MobileNavLink>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Mobile Search Expansion */}
          {showMobileSearch && (
            <div
              className={cn(
                'sm:hidden overflow-hidden transition-all duration-200',
                mobileSearchOpen ? 'max-h-16 pb-3' : 'max-h-0'
              )}
            >
              <SearchInput />
            </div>
          )}
        </nav>
      </header>
    </>
  );
}

function MobileNavLink({
  href,
  onClick,
  className,
  children,
}: {
  readonly href: string;
  readonly onClick?: () => void;
  readonly className?: string;
  readonly children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'block py-3 px-4 rounded-lg',
        'text-sm font-medium',
        'hover:bg-muted active:bg-muted/70',
        'transition-colors touch-target',
        className
      )}
    >
      {children}
    </Link>
  );
}
