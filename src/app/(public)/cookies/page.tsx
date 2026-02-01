import { Metadata } from 'next';
import { Cookie, Settings, Shield, ToggleRight, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy | GO Shop',
  description: 'Learn about how we use cookies and similar technologies.',
};

export default function CookiesPage() {
  return (
    <div className='min-h-screen bg-background'>
      {/* Hero */}
      <div className='bg-linear-to-r from-amber-500/10 to-orange-500/10 py-12 md:py-20'>
        <div className='max-w-7xl mx-auto px-4 text-center'>
          <Cookie className='w-12 h-12 text-primary mx-auto mb-4' />
          <h1 className='text-3xl md:text-5xl font-bold mb-4'>Cookie Policy</h1>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            This policy explains how we use cookies and similar technologies on our website.
          </p>
          <p className='text-sm text-muted-foreground mt-4'>Last updated: January 1, 2026</p>
        </div>
      </div>

      <div className='max-w-4xl mx-auto px-4 py-12'>
        <div className='space-y-10'>
          {/* What are Cookies */}
          <section>
            <div className='flex items-center gap-3 mb-4'>
              <Info className='w-6 h-6 text-primary' />
              <h2 className='text-2xl font-bold'>What Are Cookies?</h2>
            </div>
            <Card>
              <CardContent className='p-6'>
                <p className='text-muted-foreground'>
                  Cookies are small text files that are stored on your device when you visit a
                  website. They help websites remember your preferences, keep you logged in, and
                  provide a better user experience. Cookies cannot harm your device and do not
                  contain personal information that can identify you.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Types of Cookies */}
          <section>
            <div className='flex items-center gap-3 mb-4'>
              <Settings className='w-6 h-6 text-primary' />
              <h2 className='text-2xl font-bold'>Types of Cookies We Use</h2>
            </div>
            <div className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    <span>Essential Cookies</span>
                    <Badge className='bg-green-500'>Required</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground text-sm mb-3'>
                    These cookies are necessary for the website to function properly. They enable
                    core functionality such as security, network management, and accessibility.
                  </p>
                  <ul className='text-sm space-y-1 text-muted-foreground'>
                    <li>• Session cookies for login authentication</li>
                    <li>• Shopping cart functionality</li>
                    <li>• Security and fraud prevention</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    <span>Functional Cookies</span>
                    <Badge variant='secondary'>Optional</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground text-sm mb-3'>
                    These cookies enable personalized features and remember your preferences.
                  </p>
                  <ul className='text-sm space-y-1 text-muted-foreground'>
                    <li>• Remember language and currency preferences</li>
                    <li>• Remember recently viewed products</li>
                    <li>• Remember your search history</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    <span>Analytics Cookies</span>
                    <Badge variant='secondary'>Optional</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground text-sm mb-3'>
                    These cookies help us understand how visitors interact with our website.
                  </p>
                  <ul className='text-sm space-y-1 text-muted-foreground'>
                    <li>• Google Analytics for traffic analysis</li>
                    <li>• Page views and user flow</li>
                    <li>• Performance monitoring</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    <span>Marketing Cookies</span>
                    <Badge variant='secondary'>Optional</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground text-sm mb-3'>
                    These cookies are used to deliver relevant advertisements and track ad
                    campaigns.
                  </p>
                  <ul className='text-sm space-y-1 text-muted-foreground'>
                    <li>• Facebook Pixel for ad targeting</li>
                    <li>• Google Ads remarketing</li>
                    <li>• Affiliate tracking</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Managing Cookies */}
          <section>
            <div className='flex items-center gap-3 mb-4'>
              <ToggleRight className='w-6 h-6 text-primary' />
              <h2 className='text-2xl font-bold'>Managing Cookies</h2>
            </div>
            <Card>
              <CardContent className='p-6'>
                <p className='text-muted-foreground text-sm mb-4'>
                  You can control and manage cookies in several ways:
                </p>
                <div className='space-y-4'>
                  <div>
                    <h3 className='font-semibold mb-2'>Browser Settings</h3>
                    <p className='text-muted-foreground text-sm'>
                      Most browsers allow you to refuse or accept cookies, delete existing cookies,
                      or be notified when a cookie is set. Check your browser's help section for
                      instructions.
                    </p>
                  </div>
                  <div>
                    <h3 className='font-semibold mb-2'>Cookie Preferences</h3>
                    <p className='text-muted-foreground text-sm'>
                      When you first visit our website, you can set your cookie preferences in the
                      cookie consent banner. You can change these preferences at any time.
                    </p>
                  </div>
                  <div>
                    <h3 className='font-semibold mb-2'>Opt-Out Links</h3>
                    <p className='text-muted-foreground text-sm'>
                      For analytics and advertising cookies, you can opt out through these services:
                    </p>
                    <ul className='text-sm mt-2 space-y-1'>
                      <li>
                        <a
                          href='https://tools.google.com/dlpage/gaoptout'
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-primary hover:underline'
                        >
                          Google Analytics Opt-out
                        </a>
                      </li>
                      <li>
                        <a
                          href='https://www.facebook.com/settings/?tab=ads'
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-primary hover:underline'
                        >
                          Facebook Ad Preferences
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Impact of Disabling */}
          <section>
            <div className='flex items-center gap-3 mb-4'>
              <Shield className='w-6 h-6 text-primary' />
              <h2 className='text-2xl font-bold'>Impact of Disabling Cookies</h2>
            </div>
            <Card className='border-amber-200 bg-amber-50 dark:bg-amber-950/20'>
              <CardContent className='p-6'>
                <p className='text-amber-800 dark:text-amber-200 text-sm'>
                  <strong>Please note:</strong> If you disable or delete cookies, some features of
                  our website may not function properly. For example:
                </p>
                <ul className='text-amber-700 dark:text-amber-300 text-sm mt-3 space-y-1'>
                  <li>• You may not be able to stay logged in</li>
                  <li>• Your shopping cart may not save items</li>
                  <li>• Your preferences may not be remembered</li>
                  <li>• Some website features may be unavailable</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Updates */}
          <section>
            <Card>
              <CardContent className='p-6'>
                <h2 className='text-xl font-bold mb-3'>Updates to This Policy</h2>
                <p className='text-sm text-muted-foreground'>
                  We may update this Cookie Policy from time to time to reflect changes in our
                  practices or for other operational, legal, or regulatory reasons. Please check
                  this page periodically for updates.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Contact */}
          <section>
            <Card>
              <CardContent className='p-6'>
                <h2 className='text-xl font-bold mb-3'>Questions?</h2>
                <p className='text-sm text-muted-foreground mb-4'>
                  If you have any questions about our use of cookies, please contact us or read our
                  full{' '}
                  <Link href='/privacy' className='text-primary hover:underline'>
                    Privacy Policy
                  </Link>
                  .
                </p>
                <Link
                  href='/contact'
                  className='inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm'
                >
                  Contact Us
                </Link>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
