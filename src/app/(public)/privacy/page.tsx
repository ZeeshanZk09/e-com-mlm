import { Metadata } from 'next';
import { Shield, Eye, Database, Lock, UserCheck, Bell, Globe, Mail } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';

export const metadata: Metadata = {
  title: 'Privacy Policy | GO Shop',
  description: 'Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className='min-h-screen bg-background'>
      {/* Hero */}
      <div className='bg-gradient-to-r from-primary/10 to-primary/5 py-12 md:py-20'>
        <div className='max-w-7xl mx-auto px-4 text-center'>
          <Shield className='w-12 h-12 text-primary mx-auto mb-4' />
          <h1 className='text-3xl md:text-5xl font-bold mb-4'>Privacy Policy</h1>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Your privacy is important to us. This policy explains how we collect, use, and protect
            your data.
          </p>
          <p className='text-sm text-muted-foreground mt-4'>Last updated: January 1, 2026</p>
        </div>
      </div>

      <div className='max-w-4xl mx-auto px-4 py-12'>
        <div className='prose prose-gray dark:prose-invert max-w-none'>
          {/* Introduction */}
          <section className='mb-12'>
            <Card>
              <CardContent className='p-6'>
                <p className='text-muted-foreground'>
                  GO Shop ("we", "our", or "us") is committed to protecting your privacy. This
                  Privacy Policy explains how we collect, use, disclose, and safeguard your
                  information when you visit our website or make a purchase. Please read this
                  privacy policy carefully.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Information We Collect */}
          <section className='mb-10'>
            <div className='flex items-center gap-3 mb-4'>
              <Database className='w-6 h-6 text-primary' />
              <h2 className='text-2xl font-bold m-0'>Information We Collect</h2>
            </div>
            <Card>
              <CardContent className='p-6 space-y-4'>
                <div>
                  <h3 className='font-semibold mb-2'>Personal Information</h3>
                  <p className='text-muted-foreground text-sm'>
                    When you register, place an order, or contact us, we collect:
                  </p>
                  <ul className='list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1'>
                    <li>Name, email address, phone number</li>
                    <li>Shipping and billing address</li>
                    <li>Payment information (processed securely by payment providers)</li>
                    <li>Order history and preferences</li>
                  </ul>
                </div>
                <div>
                  <h3 className='font-semibold mb-2'>Automatically Collected Information</h3>
                  <p className='text-muted-foreground text-sm'>
                    When you visit our website, we automatically collect:
                  </p>
                  <ul className='list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1'>
                    <li>IP address and browser type</li>
                    <li>Device information and operating system</li>
                    <li>Pages visited and time spent on site</li>
                    <li>Referral source and search terms</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* How We Use Information */}
          <section className='mb-10'>
            <div className='flex items-center gap-3 mb-4'>
              <Eye className='w-6 h-6 text-primary' />
              <h2 className='text-2xl font-bold m-0'>How We Use Your Information</h2>
            </div>
            <Card>
              <CardContent className='p-6'>
                <ul className='space-y-3'>
                  {[
                    'Process and fulfill your orders',
                    'Send order confirmations and shipping updates',
                    'Respond to your inquiries and provide customer support',
                    'Send promotional emails (with your consent)',
                    'Improve our website and services',
                    'Prevent fraud and maintain security',
                    'Comply with legal obligations',
                  ].map((item, i) => (
                    <li key={i} className='flex items-start gap-2 text-sm text-muted-foreground'>
                      <span className='text-primary'>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Data Sharing */}
          <section className='mb-10'>
            <div className='flex items-center gap-3 mb-4'>
              <Globe className='w-6 h-6 text-primary' />
              <h2 className='text-2xl font-bold m-0'>Information Sharing</h2>
            </div>
            <Card>
              <CardContent className='p-6'>
                <p className='text-muted-foreground text-sm mb-4'>
                  We do not sell, trade, or rent your personal information. We may share your data
                  with:
                </p>
                <ul className='space-y-3'>
                  {[
                    {
                      title: 'Service Providers',
                      desc: 'Payment processors, shipping partners, and IT service providers who help us operate our business.',
                    },
                    {
                      title: 'Legal Requirements',
                      desc: 'When required by law or to protect our rights and safety.',
                    },
                    {
                      title: 'Business Transfers',
                      desc: 'In the event of a merger, acquisition, or sale of assets.',
                    },
                  ].map((item, i) => (
                    <li key={i} className='text-sm'>
                      <span className='font-semibold'>{item.title}:</span>{' '}
                      <span className='text-muted-foreground'>{item.desc}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Data Security */}
          <section className='mb-10'>
            <div className='flex items-center gap-3 mb-4'>
              <Lock className='w-6 h-6 text-primary' />
              <h2 className='text-2xl font-bold m-0'>Data Security</h2>
            </div>
            <Card>
              <CardContent className='p-6'>
                <p className='text-muted-foreground text-sm'>
                  We implement appropriate security measures to protect your personal information:
                </p>
                <ul className='list-disc list-inside text-sm text-muted-foreground mt-3 space-y-1'>
                  <li>SSL encryption for all data transmissions</li>
                  <li>Secure payment processing through certified providers</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Access controls and employee training</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Your Rights */}
          <section className='mb-10'>
            <div className='flex items-center gap-3 mb-4'>
              <UserCheck className='w-6 h-6 text-primary' />
              <h2 className='text-2xl font-bold m-0'>Your Rights</h2>
            </div>
            <Card>
              <CardContent className='p-6'>
                <p className='text-muted-foreground text-sm mb-4'>You have the right to:</p>
                <ul className='space-y-2'>
                  {[
                    'Access the personal data we hold about you',
                    'Request correction of inaccurate data',
                    'Request deletion of your data',
                    'Opt-out of marketing communications',
                    'Withdraw consent at any time',
                  ].map((item, i) => (
                    <li key={i} className='flex items-start gap-2 text-sm text-muted-foreground'>
                      <span className='text-green-500'>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Marketing Communications */}
          <section className='mb-10'>
            <div className='flex items-center gap-3 mb-4'>
              <Bell className='w-6 h-6 text-primary' />
              <h2 className='text-2xl font-bold m-0'>Marketing Communications</h2>
            </div>
            <Card>
              <CardContent className='p-6'>
                <p className='text-muted-foreground text-sm'>
                  With your consent, we may send you promotional emails about new products, special
                  offers, and events. You can unsubscribe at any time by clicking the "unsubscribe"
                  link in our emails or updating your preferences in your account settings.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Contact */}
          <section>
            <div className='flex items-center gap-3 mb-4'>
              <Mail className='w-6 h-6 text-primary' />
              <h2 className='text-2xl font-bold m-0'>Contact Us</h2>
            </div>
            <Card>
              <CardContent className='p-6'>
                <p className='text-muted-foreground text-sm mb-4'>
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className='space-y-2 text-sm'>
                  <p>Email: privacy@goshop.pk</p>
                  <p>Phone: +92 300 1234567</p>
                  <p>Address: 123 Main Street, Gulberg III, Lahore, Pakistan</p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
