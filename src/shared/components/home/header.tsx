import { Store } from 'lucide-react';
import Link from 'next/link';
import { SignedIn, SignedOut } from '../auth';
import UserButton from '../profile/user-btn';
import SearchInput from '../SearchInput';
import { Button } from '../ui/button';

const Header = () => {
  return (
    <header className='top-0 sticky z-20 bg-card'>
      <nav className='p-4 md:p-5 max-w-7xl mx-auto flex justify-between items-center gap-4'>
        <Link href={'/'} className='flex-shrink-0'>
          <h1 className='logo small w-full' aria-label='GO Shop - brand'>
            <span className='mark' aria-hidden>
              Go
            </span>
            <span className='word'>Shop</span>
          </h1>
        </Link>
        <div className='flex-1 flex items-center gap-3 md:gap-5 justify-end'>
          {/* Search - Hidden on mobile, shown on tablet+ */}
          <div className='hidden sm:block flex-1 max-w-md'>
            <SearchInput />
          </div>
          <div className='hidden sm:flex gap-2'>
            <Link href={'/shop'} className='min-w-20 flex items-center gap-2 text-sm'>
              <Store size={14} />
              <span>Shop</span>
            </Link>
          </div>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Button size={'sm'} asChild>
              <Link href={'/auth/sign-in'}>Login</Link>
            </Button>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
};

export default Header;
