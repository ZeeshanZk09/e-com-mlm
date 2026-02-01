import { Metadata } from 'next';
import { RotateCcw, CheckCircle, XCircle, Clock, Package, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Returns & Exchanges | GO Shop',
  description: 'Learn about our hassle-free return and exchange policy.',
};

export default function ReturnsPage() {
  return (
    <div className='min-h-screen bg-background'>
      {/* Hero */}
      <div className='bg-linear-to-r from-purple-500/10 to-pink-500/10 py-12 md:py-20'>
        <div className='max-w-7xl mx-auto px-4 text-center'>
          <RotateCcw className='w-12 h-12 text-primary mx-auto mb-4' />
          <h1 className='text-3xl md:text-5xl font-bold mb-4'>Returns & Exchanges</h1>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Shop with confidence. Easy returns within 7 days of delivery.
          </p>
        </div>
      </div>

      <div className='max-w-4xl mx-auto px-4 py-12'>
        {/* Return Policy Overview */}
        <section className='mb-12'>
          <div className='grid sm:grid-cols-3 gap-4 mb-8'>
            <Card className='text-center'>
              <CardContent className='pt-6'>
                <Clock className='w-10 h-10 text-primary mx-auto mb-3' />
                <h3 className='font-semibold'>7-Day Returns</h3>
                <p className='text-sm text-muted-foreground mt-1'>
                  Return within 7 days of delivery
                </p>
              </CardContent>
            </Card>

            <Card className='text-center'>
              <CardContent className='pt-6'>
                <Package className='w-10 h-10 text-primary mx-auto mb-3' />
                <h3 className='font-semibold'>Free Pickup</h3>
                <p className='text-sm text-muted-foreground mt-1'>
                  We'll pick up from your doorstep
                </p>
              </CardContent>
            </Card>

            <Card className='text-center'>
              <CardContent className='pt-6'>
                <RotateCcw className='w-10 h-10 text-primary mx-auto mb-3' />
                <h3 className='font-semibold'>Quick Refund</h3>
                <p className='text-sm text-muted-foreground mt-1'>
                  Refund within 5-7 business days
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Eligible Items */}
        <section className='mb-12'>
          <h2 className='text-2xl font-bold mb-6'>What Can Be Returned?</h2>
          <div className='grid md:grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-green-600'>
                  <CheckCircle className='w-5 h-5' />
                  Eligible for Return
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='space-y-3'>
                  {[
                    'Clothing and accessories (unused, with tags)',
                    'Electronics (unopened, sealed packaging)',
                    'Home & kitchen items (unused, original packaging)',
                    'Shoes and bags (unused, with box)',
                    'Wrong item received',
                    'Damaged during delivery',
                    'Defective or faulty products',
                  ].map((item, i) => (
                    <li key={i} className='flex items-start gap-2 text-sm'>
                      <CheckCircle className='w-4 h-4 text-green-500 flex-shrink-0 mt-0.5' />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-red-600'>
                  <XCircle className='w-5 h-5' />
                  Not Eligible
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='space-y-3'>
                  {[
                    'Undergarments and innerwear',
                    'Swimwear and lingerie',
                    'Personalized/customized items',
                    'Perishable goods',
                    'Items marked as "Final Sale"',
                    'Products without tags or packaging',
                    'Used or washed items',
                  ].map((item, i) => (
                    <li key={i} className='flex items-start gap-2 text-sm'>
                      <XCircle className='w-4 h-4 text-red-500 flex-shrink-0 mt-0.5' />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How to Return */}
        <section className='mb-12'>
          <h2 className='text-2xl font-bold mb-6'>How to Return</h2>
          <Card>
            <CardContent className='p-6'>
              <div className='space-y-6'>
                {[
                  {
                    step: 1,
                    title: 'Initiate Return Request',
                    description:
                      'Go to My Orders, select the item, and click "Request Return". Choose your reason for return.',
                  },
                  {
                    step: 2,
                    title: 'Pack the Item',
                    description:
                      'Pack the item securely in its original packaging with all tags and accessories.',
                  },
                  {
                    step: 3,
                    title: 'Pickup Scheduled',
                    description:
                      'Our courier partner will contact you to schedule a pickup within 24-48 hours.',
                  },
                  {
                    step: 4,
                    title: 'Quality Check',
                    description: "Once received, we'll inspect the item within 2-3 business days.",
                  },
                  {
                    step: 5,
                    title: 'Refund Processed',
                    description:
                      'Refund will be credited to your original payment method within 5-7 business days.',
                  },
                ].map((item) => (
                  <div key={item.step} className='flex gap-4'>
                    <div className='flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold'>
                      {item.step}
                    </div>
                    <div>
                      <h3 className='font-semibold'>{item.title}</h3>
                      <p className='text-muted-foreground text-sm mt-1'>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Exchange Policy */}
        <section className='mb-12'>
          <h2 className='text-2xl font-bold mb-6'>Exchange Policy</h2>
          <Card>
            <CardContent className='p-6'>
              <p className='text-muted-foreground mb-4'>
                Need a different size or color? We've got you covered!
              </p>
              <ul className='space-y-3'>
                <li className='flex items-start gap-2'>
                  <CheckCircle className='w-4 h-4 text-green-500 flex-shrink-0 mt-0.5' />
                  <span>Exchange for different size/color of the same product</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle className='w-4 h-4 text-green-500 flex-shrink-0 mt-0.5' />
                  <span>Exchange for a different product of equal or lesser value</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle className='w-4 h-4 text-green-500 flex-shrink-0 mt-0.5' />
                  <span>Pay the difference for items of higher value</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Important Notice */}
        <section>
          <Card className='border-amber-200 bg-amber-50 dark:bg-amber-950/20'>
            <CardContent className='p-6'>
              <div className='flex items-start gap-4'>
                <AlertTriangle className='w-6 h-6 text-amber-600 flex-shrink-0' />
                <div>
                  <h3 className='font-semibold text-amber-800 dark:text-amber-200 mb-2'>
                    Important Notes
                  </h3>
                  <ul className='space-y-2 text-sm text-amber-700 dark:text-amber-300'>
                    <li>• Return requests must be initiated within 7 days of delivery.</li>
                    <li>• Items must be in their original condition with all tags attached.</li>
                    <li>• Refunds for COD orders will be processed via bank transfer.</li>
                    <li>
                      • Shipping charges are non-refundable unless the return is due to our error.
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Need Help */}
        <div className='mt-12 text-center'>
          <p className='text-muted-foreground mb-4'>Need help with a return?</p>
          <Link
            href='/contact'
            className='inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
