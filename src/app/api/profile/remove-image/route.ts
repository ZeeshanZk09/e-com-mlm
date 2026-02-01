import fs from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/shared/lib/prisma';

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user's image
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    });

    if (!user?.image) {
      return NextResponse.json({ error: 'No profile image to remove' }, { status: 400 });
    }

    // Delete the file if it's a local upload
    if (user.image.startsWith('/uploads/avatars/')) {
      const filePath = path.join(process.cwd(), 'public', user.image);
      try {
        await fs.unlink(filePath);
      } catch {
        // Ignore if file doesn't exist
      }
    }

    // Update user's image to null
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Profile image remove error:', error);
    return NextResponse.json({ error: 'Failed to remove image' }, { status: 500 });
  }
}
