import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { auth } from '@/auth';
import prisma from '@/shared/lib/prisma';

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const maxSize = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!allowedTypes.has(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit.' }, { status: 400 });
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const ext = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const filePath = path.join(uploadDir, fileName);

    // Process and save the image
    const buffer = Buffer.from(await file.arrayBuffer());

    // Resize and optimize the image
    const optimizedBuffer = await sharp(buffer)
      .resize(300, 300, { fit: 'cover' })
      .jpeg({ quality: 85 })
      .toBuffer();

    await fs.writeFile(filePath, optimizedBuffer);

    const imageUrl = `/uploads/avatars/${fileName}`;

    // Delete old profile image if exists
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    });

    if (currentUser?.image?.startsWith('/uploads/avatars/')) {
      const oldFilePath = path.join(process.cwd(), 'public', currentUser.image);
      try {
        await fs.unlink(oldFilePath);
      } catch {
        // Ignore if file doesn't exist
      }
    }

    // Update user's image in database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl },
    });

    return NextResponse.json({ url: imageUrl, success: true });
  } catch (error) {
    console.error('Profile image upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
