'use client';

import ProfileForm from '@/shared/components/profile/profile-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import ProfileSidebar from './_components/profile-sidebar';

export default function ProfilePage() {
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
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details and public profile</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
