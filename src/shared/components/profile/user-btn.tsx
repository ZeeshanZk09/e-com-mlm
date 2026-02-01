'use client';
import {
  Heart,
  List,
  LogOut,
  type LucideProps,
  Settings,
  Shield,
  ShoppingBag,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { type ForwardRefExoticComponent, type RefAttributes, useEffect, useState } from 'react';
import { useAuth } from '../auth-provider';
import ThemeSwitch from '../theme-switch';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import ManageAccount from './manage-account';

export default function UserButton() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [openManageAccount, setOpenManageAccount] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      setIsAdmin(true);
    }
  }, [user]);

  const navLinks: {
    id: number;
    label: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
    func: () => void;
    className?: string;
  }[] = [
    {
      id: 1,
      label: 'My Orders',
      icon: List,
      func: () => router.push('/my-orders'),
      className: '',
    },
    {
      id: 2,
      label: 'My Bag',
      icon: ShoppingBag,
      func: () => router.push('/bag'),
      className: '',
    },
    {
      id: 3,
      label: 'Favourites',
      icon: Heart,
      func: () => router.push('/favourites'),
      className: '',
    },
  ];

  console.log('isAdmin in userBUtton: ', user);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={'icon'} variant={'ghost'} className='rounded-full size-9'>
            <Avatar className='size-9'>
              <AvatarImage src={user?.image ?? undefined} />
              <AvatarFallback className='uppercase'>
                {(user?.name as string)?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='overflow-hidden max-w-xs sm:min-w-xs'>
          {/* User Profile Link */}
          <button
            type='button'
            onClick={() => router.push('/profile')}
            className='flex gap-4 px-3 py-3 w-full text-left cursor-pointer hover:bg-muted transition-colors'
          >
            <Avatar className='h-10 w-10'>
              <AvatarImage src={user?.image ?? ''} />
              <AvatarFallback className='uppercase'>
                {(user?.name as string)?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <h4 className='text-sm font-medium'>{user?.name}</h4>
              <p className='text-xs mt-0.5 text-muted-foreground line-clamp-1 max-w-full overflow-hidden'>
                {user?.email}
              </p>
            </div>
          </button>
          <DropdownMenuSeparator />
          {/* Profile Link */}
          <DropdownMenuItem
            onClick={() => router.push('/profile')}
            className='px-3.5 py-2 cursor-pointer'
          >
            <User /> My Profile
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem
              onClick={() => router.push('/admin')}
              className='px-3.5 py-2 cursor-pointer'
            >
              <Shield /> Admin Panel
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          {navLinks.map((item) => (
            // Hide some menu items on larger screens if needed; adjust as appropriate
            <DropdownMenuItem
              key={item.id}
              onClick={item.func}
              className={`px-3.5 py-2 cursor-pointer ${item.className || ''}`}
            >
              <item.icon /> {item.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem
            onClick={() => setOpenManageAccount(true)}
            className='px-3.5 py-2 cursor-pointer'
          >
            <Settings /> Manage Account
          </DropdownMenuItem> */}
          <DropdownMenuItem
            onClick={async () => await signOut()}
            className='px-3.5 py-2 hover:text-destructive cursor-pointer'
          >
            <LogOut /> Sign out
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className='flex justify-between py-1 px-3 cursor-pointer'>
            <h4 className='text-sm'>Theme</h4>
            <ThemeSwitch className='gap-2' />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      {openManageAccount && (
        <ManageAccount open={openManageAccount} setOpen={setOpenManageAccount} />
      )}
    </>
  );
}
