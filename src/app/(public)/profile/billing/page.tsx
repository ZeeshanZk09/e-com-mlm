'use client';

import BillingHistory from '@/shared/components/profile/billing-history';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import ProfileSidebar from '../_components/profile-sidebar';

export default function BillingPage() {
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
            <CardTitle>Billing & Subscriptions</CardTitle>
            <CardDescription>View your billing history and manage subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <BillingHistory />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
