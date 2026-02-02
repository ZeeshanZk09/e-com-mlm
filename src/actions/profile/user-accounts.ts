'use server';

import { auth } from '@/auth';
import prisma from '@/shared/lib/prisma';

export const getUser = async () => {
  try {
    const session = await auth();
    console.log('user session: ', session);
    const user = session?.user;

    if (!user) {
      return null;
    }

    const userData = await prisma.user.findUnique({
      where: { email: user?.email },
      select: {
        name: true,
        id: true,
        email: true,
        emailVerified: true,
        phoneNumber: true,
        role: true,
        image: true,
        isActive: true,
        isBlocked: true,
        isPlusMember: true,
        isMLMEnabled: true,
        plusUntil: true,
        createdAt: true,
        updatedAt: true,
        password: true,
      },
    });
    console.log('accounts: ', userData);

    // Return user data with hasPassword flag (never expose actual password)
    return userData
      ? {
          ...userData,
          hasPassword: !!userData.password,
          password: undefined,
        }
      : null;
  } catch (error) {
    console.log('error: ', error);
    return { error: 'Failed to get user accounts' };
  }
};
