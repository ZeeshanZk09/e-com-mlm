'use client';

import { Loader, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/shared/components/auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import ProfileSidebar from '../_components/profile-sidebar';

export default function PhotoPage() {
  const { user, update } = useAuth();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type & size
    const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
    if (!allowedTypes.has(selectedFile.type)) {
      toast.error('Invalid file type. Only JPG, PNG and WebP are allowed.');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select an image first');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/profile/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        update({ image: data.url });
        toast.success('Profile picture updated successfully!');
        router.push('/profile');
      } else {
        toast.error(data.error ?? 'Failed to upload image');
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!user?.image) {
      toast.error('No image to remove');
      return;
    }

    setUploading(true);
    try {
      const res = await fetch('/api/profile/remove-image', {
        method: 'DELETE',
      });

      if (res.ok) {
        update({ image: null });
        setPreview(null);
        setFile(null);
        toast.success('Profile picture removed');
      } else {
        const data = await res.json();
        toast.error(data.error ?? 'Failed to remove image');
      }
    } catch (err) {
      console.error('Remove error:', err);
      toast.error('Failed to remove image');
    } finally {
      setUploading(false);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className='container max-w-6xl mx-auto py-8 px-4'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>Account Settings</h1>
        <p className='text-muted-foreground mt-1'>Manage your account settings and preferences</p>
      </div>

      <div className='grid gap-8 lg:grid-cols-[280px_1fr]'>
        {/* Sidebar */}
        <ProfileSidebar />

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
            <CardDescription>Upload or change your profile picture</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Current/Preview Image */}
            <div className='flex flex-col items-center gap-4'>
              <div className='relative'>
                <Avatar className='h-32 w-32'>
                  <AvatarImage src={preview ?? user?.image ?? undefined} />
                  <AvatarFallback className='uppercase text-4xl'>
                    {(user?.name as string)?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                {preview && (
                  <button
                    type='button'
                    onClick={clearPreview}
                    className='absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90'
                  >
                    <X className='h-4 w-4' />
                  </button>
                )}
              </div>
              <p className='text-sm text-muted-foreground'>
                {preview ? 'Preview of new image' : 'Current profile picture'}
              </p>
            </div>

            {/* File Input */}
            <div className='space-y-4'>
              <input
                ref={inputRef}
                type='file'
                accept='image/jpeg,image/png,image/webp'
                onChange={handleFileChange}
                className='hidden'
              />
              <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className='h-4 w-4 mr-2' />
                  Select Image
                </Button>
                {preview && (
                  <Button onClick={handleUpload} disabled={uploading}>
                    {uploading ? (
                      <>
                        <Loader className='h-4 w-4 mr-2 animate-spin' />
                        Uploading...
                      </>
                    ) : (
                      'Save Photo'
                    )}
                  </Button>
                )}
                {user?.image && !preview && (
                  <Button variant='destructive' onClick={handleRemove} disabled={uploading}>
                    {uploading ? (
                      <>
                        <Loader className='h-4 w-4 mr-2 animate-spin' />
                        Removing...
                      </>
                    ) : (
                      'Remove Photo'
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Guidelines */}
            <div className='bg-muted/50 rounded-lg p-4'>
              <h4 className='font-medium text-sm mb-2'>Photo Guidelines</h4>
              <ul className='text-sm text-muted-foreground space-y-1'>
                <li>• Accepted formats: JPG, PNG, WebP</li>
                <li>• Maximum file size: 5MB</li>
                <li>• Recommended size: 300x300 pixels</li>
                <li>• Square images work best</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
