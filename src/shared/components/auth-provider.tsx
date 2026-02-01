'use client';
import type { User } from '@auth/core/types';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getUser } from '@/actions/profile/user-accounts';
import type { Role } from '@/shared/lib/generated/prisma/enums';

// Extended user type that includes additional fields from database
export type ExtendedUser = Partial<User> & {
  role?: Role;
  image?: string | null;
  phoneNumber?: string | null;
  isActive?: boolean;
  isBlocked?: boolean;
  isPlusMember?: boolean;
  isMLMEnabled?: boolean;
  plusUntil?: Date | null;
  createdAt?: Date;
  updatedAt?: Date | null;
};

type Props = {
  children: React.ReactNode;
  session?: Session | null;
};

export type AuthContextValue = {
  update: (data: Partial<ExtendedUser>) => void;
  user: ExtendedUser | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children, session }: Props) => {
  const [user, setUser] = useState<ExtendedUser | null>(session?.user ?? null);
  const update = useCallback((data: Partial<ExtendedUser>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  }, []);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = (await getUser()) as ExtendedUser | null;
        setUser(userData ?? null);
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  const contextValue = useMemo(() => ({ user, update }), [user, update]);

  console.log('user-in-provider: ', user);
  return (
    <SessionProvider session={session}>
      <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    </SessionProvider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
