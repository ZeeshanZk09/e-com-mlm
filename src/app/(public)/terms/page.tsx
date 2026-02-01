import { Metadata } from 'next';
import {
  FileText,
  ShoppingBag,
  CreditCard,
  Truck,
  RotateCcw,
  Ban,
  Scale,
  Mail,
} from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';

export const metadata: Metadata = {
  title: 'Terms of Service | GO Shop',
  description: 'Read our terms and conditions for using GO Shop.',
};

export default function TermsPage() {
  return (
    <div className='min-h-screen bg-background'>
      {/* Hero */}
      <div className='bg-gradient-to-r from-primary/10 to-primary/5 py-12 md:py-20'>
        <div className='max-w-7xl mx-auto px-4 text-center'>
          <FileText className='w-12 h-12 text-primary mx-auto mb-4' />
          <h1 className='text-3xl md:text-5xl font-bold mb-4'>Terms of Service</h1>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Please read these terms carefully before using our services.
          </p>
          <p className='text-sm text-muted-foreground mt-4'>Last updated: January 1, 2026</p>
        </div>
      </div>

      <div className='max-w-4xl mx-auto px-4 py-12'>
        <div className='space-y-10'>
          {/* Introduction */}
          <section>
            <Card>
              <CardContent className='p-6'>
                <p className='text-muted-foreground'>
                  Welcome to GO Shop. By accessing or using our website, you agree to be bound by
                  these Terms of Service. If you do not agree to these terms, please do not use our
                  services.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Account Terms */}
          <section>
            <div className='flex items-center gap-3 mb-4'>
              <ShoppingBag className='w-6 h-6 text-primary' />
              <h2 className='text-2xl font-bold'>Account Terms</h2>
            </div>
            <Card>
              <CardContent className='p-6 space-y-3 text-sm text-muted-foreground'>
                <p>• You must be 18 years or older to create an account and make purchases.</p>
                <p>
                  • You are responsible for maintaining the confidentiality of your account
                  credentials.
                </p>
                <p>
                  • You agree to provide accurate and complete information when creating an account.
                </p>
                <p>• You are responsible for all activities that occur under your account.</p>
                <p>
                  • We reserve the right to suspend or terminate accounts that violate these terms.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Orders & Payments */}
          <section>
            <div className='flex items-center gap-3 mb-4'>
              <CreditCard className='w-6 h-6 text-primary' />
              <h2 className='text-2xl font-bold'>Orders & Payments</h2>
            </div>
            <Card>
              <CardContent className='p-6 space-y-3 text-sm text-muted-foreground'>
                <p>
                  • All prices are displayed in Pakistani Rupees (PKR) and include applicable taxes.
                </p>
                <p>• Prices are subject to change without notice.</p>
                <p>• We reserve the right to refuse or cancel any order for any reason.</p>
                <p>• Payment must be received before order processing for prepaid orders.</p>
                <p>• For Cash on Delivery (COD), payment is due upon delivery.</p>
                <p>
                  • We are not responsible for pricing errors. If we discover an error, we will
                  contact you.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Shipping */}
          <section>
            <div className='flex items-center gap-3 mb-4'>
              <Truck className='w-6 h-6 text-primary' />
              <h2 className='text-2xl font-bold'>Shipping & Delivery</h2>
            </div>
            <Card>
              <CardContent className='p-6 space-y-3 text-sm text-muted-foreground'>
                <p>• Delivery times are estimates and not guaranteed.</p>
                <p>• Risk of loss transfers to you upon delivery to the carrier.</p>
                <p>
                  • We are not responsible for delays caused by customs, weather, or other external
                  factors.
                </p>
                <p>
                  • Please ensure the delivery address is accurate and someone is available to
                  receive the package.
                </p>
                <p>
                  • Unclaimed packages may be returned to us and additional shipping charges may
                  apply for redelivery.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Returns */}
          <section>
            <div className='flex items-center gap-3 mb-4'>
              <RotateCcw className='w-6 h-6 text-primary' />
              <h2 className='text-2xl font-bold'>Returns & Refunds</h2>
            </div>
            <Card>
              <CardContent className='p-6 space-y-3 text-sm text-muted-foreground'>
                <p>• Returns are accepted within 7 days of delivery for eligible items.</p>
                <p>• Items must be unused, in original packaging, and with all tags attached.</p>
                <p>
                  • Certain items are not eligible for return (see our Returns Policy for details).
                </p>
                <p>• Refunds are processed within 5-7 business days after inspection.</p>
                <p>
                  • Original shipping charges are non-refundable unless the return is due to our
                  error.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Prohibited Activities */}
          <section>
            <div className='flex items-center gap-3 mb-4'>
              <Ban className='w-6 h-6 text-red-500' />
              <h2 className='text-2xl font-bold'>Prohibited Activities</h2>
            </div>
            <Card>
              <CardContent className='p-6 space-y-3 text-sm text-muted-foreground'>
                <p>You agree NOT to:</p>
                <ul className='list-disc list-inside space-y-2 mt-2'>
                  <li>Use our service for any illegal purpose</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt our services</li>
                  <li>Scrape or collect data without permission</li>
                  <li>Post false, inaccurate, or misleading content</li>
                  <li>Violate any intellectual property rights</li>
                  <li>Engage in fraudulent activities</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Limitation of Liability */}
          <section>
            <div className='flex items-center gap-3 mb-4'>
              <Scale className='w-6 h-6 text-primary' />
              <h2 className='text-2xl font-bold'>Limitation of Liability</h2>
            </div>
            <Card>
              <CardContent className='p-6 space-y-3 text-sm text-muted-foreground'>
                <p>
                  To the maximum extent permitted by law, GO Shop shall not be liable for any
                  indirect, incidental, special, consequential, or punitive damages arising from
                  your use of our services.
                </p>
                <p>
                  Our total liability for any claim arising from these terms or our services shall
                  not exceed the amount you paid for the specific product or service giving rise to
                  the claim.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Changes to Terms */}
          <section>
            <Card>
              <CardContent className='p-6'>
                <h2 className='text-xl font-bold mb-3'>Changes to Terms</h2>
                <p className='text-sm text-muted-foreground'>
                  We reserve the right to modify these terms at any time. Changes will be effective
                  immediately upon posting. Your continued use of our services after any changes
                  indicates your acceptance of the new terms.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Contact */}
          <section>
            <div className='flex items-center gap-3 mb-4'>
              <Mail className='w-6 h-6 text-primary' />
              <h2 className='text-2xl font-bold'>Contact</h2>
            </div>
            <Card>
              <CardContent className='p-6'>
                <p className='text-muted-foreground text-sm mb-4'>
                  For questions about these Terms of Service, please contact us:
                </p>
                <div className='space-y-2 text-sm'>
                  <p>Email: legal@goshop.pk</p>
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
