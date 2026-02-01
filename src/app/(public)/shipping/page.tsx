import { Metadata } from 'next';
import { Truck, Clock, MapPin, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';

export const metadata: Metadata = {
  title: 'Shipping Information | GO Shop',
  description: 'Learn about our shipping policies, delivery times, and shipping costs.',
};

export default function ShippingPage() {
  return (
    <div className='min-h-screen bg-background'>
      {/* Hero */}
      <div className='bg-linear-to-r from-blue-500/10 to-cyan-500/10 py-12 md:py-20'>
        <div className='max-w-7xl mx-auto px-4 text-center'>
          <Truck className='w-12 h-12 text-primary mx-auto mb-4' />
          <h1 className='text-3xl md:text-5xl font-bold mb-4'>Shipping Information</h1>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Fast, reliable delivery across Pakistan. Free shipping on orders over Rs. 2,000.
          </p>
        </div>
      </div>

      <div className='max-w-4xl mx-auto px-4 py-12'>
        {/* Delivery Times */}
        <section className='mb-12'>
          <h2 className='text-2xl font-bold mb-6'>Delivery Times</h2>
          <div className='grid sm:grid-cols-2 gap-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Clock className='w-5 h-5 text-primary' />
                  Standard Delivery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-2xl font-bold text-primary mb-2'>3-5 Business Days</p>
                <p className='text-muted-foreground text-sm'>
                  Available nationwide. Delivery times may vary for remote areas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Truck className='w-5 h-5 text-green-500' />
                  Express Delivery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-2xl font-bold text-green-500 mb-2'>Same / Next Day</p>
                <p className='text-muted-foreground text-sm'>
                  Available in Lahore, Karachi, and Islamabad for orders placed before 2 PM.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Shipping Costs */}
        <section className='mb-12'>
          <h2 className='text-2xl font-bold mb-6'>Shipping Costs</h2>
          <Card>
            <CardContent className='p-6'>
              <div className='space-y-4'>
                <div className='flex justify-between items-center py-3 border-b'>
                  <div>
                    <p className='font-medium'>Orders under Rs. 2,000</p>
                    <p className='text-sm text-muted-foreground'>Standard delivery</p>
                  </div>
                  <Badge variant='secondary' className='text-lg'>
                    Rs. 150
                  </Badge>
                </div>
                <div className='flex justify-between items-center py-3 border-b'>
                  <div>
                    <p className='font-medium'>Orders over Rs. 2,000</p>
                    <p className='text-sm text-muted-foreground'>Standard delivery</p>
                  </div>
                  <Badge className='text-lg bg-green-500'>FREE</Badge>
                </div>
                <div className='flex justify-between items-center py-3'>
                  <div>
                    <p className='font-medium'>Express Delivery</p>
                    <p className='text-sm text-muted-foreground'>Same/Next day (select cities)</p>
                  </div>
                  <Badge variant='secondary' className='text-lg'>
                    Rs. 300
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Coverage Areas */}
        <section className='mb-12'>
          <h2 className='text-2xl font-bold mb-6'>Coverage Areas</h2>
          <div className='grid sm:grid-cols-3 gap-4'>
            <Card>
              <CardContent className='p-6 text-center'>
                <MapPin className='w-8 h-8 text-primary mx-auto mb-3' />
                <h3 className='font-semibold mb-2'>Major Cities</h3>
                <p className='text-sm text-muted-foreground'>
                  Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan
                </p>
                <Badge className='mt-3 bg-green-500'>2-3 Days</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6 text-center'>
                <MapPin className='w-8 h-8 text-primary mx-auto mb-3' />
                <h3 className='font-semibold mb-2'>Other Cities</h3>
                <p className='text-sm text-muted-foreground'>
                  All other cities and towns across Pakistan
                </p>
                <Badge variant='secondary' className='mt-3'>
                  3-5 Days
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6 text-center'>
                <MapPin className='w-8 h-8 text-primary mx-auto mb-3' />
                <h3 className='font-semibold mb-2'>Remote Areas</h3>
                <p className='text-sm text-muted-foreground'>Villages and remote locations</p>
                <Badge variant='outline' className='mt-3'>
                  5-7 Days
                </Badge>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Order Tracking */}
        <section className='mb-12'>
          <h2 className='text-2xl font-bold mb-6'>Order Tracking</h2>
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-start gap-4'>
                <Package className='w-8 h-8 text-primary flex-shrink-0' />
                <div>
                  <h3 className='font-semibold mb-2'>Track Your Order</h3>
                  <p className='text-muted-foreground mb-4'>
                    Once your order is shipped, you'll receive an SMS and email with your tracking
                    number. You can track your order anytime from:
                  </p>
                  <ul className='space-y-2'>
                    <li className='flex items-center gap-2'>
                      <CheckCircle className='w-4 h-4 text-green-500' />
                      <span>My Orders section in your account</span>
                    </li>
                    <li className='flex items-center gap-2'>
                      <CheckCircle className='w-4 h-4 text-green-500' />
                      <span>Courier partner's website using tracking number</span>
                    </li>
                    <li className='flex items-center gap-2'>
                      <CheckCircle className='w-4 h-4 text-green-500' />
                      <span>WhatsApp - send your order ID to our support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Important Notes */}
        <section>
          <h2 className='text-2xl font-bold mb-6'>Important Notes</h2>
          <Card className='border-amber-200 bg-amber-50 dark:bg-amber-950/20'>
            <CardContent className='p-6'>
              <div className='flex items-start gap-4'>
                <AlertCircle className='w-6 h-6 text-amber-600 flex-shrink-0' />
                <div className='space-y-3 text-sm'>
                  <p>
                    • Delivery times are estimates and may vary due to unforeseen circumstances.
                  </p>
                  <p>
                    • Orders placed on weekends or holidays will be processed on the next business
                    day.
                  </p>
                  <p>
                    • Please ensure someone is available to receive the package at the delivery
                    address.
                  </p>
                  <p>• For COD orders, please keep the exact amount ready for faster delivery.</p>
                  <p>• Contact our support team for any delivery-related queries.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
