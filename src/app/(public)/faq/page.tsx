import { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import Link from 'next/link';
import { HelpCircle, CreditCard, Truck, RotateCcw, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'FAQ | GO Shop',
  description: 'Frequently asked questions about shopping, orders, payments, and more.',
};

const faqCategories = [
  {
    title: 'Orders & Shipping',
    icon: Truck,
    faqs: [
      {
        question: 'How long does delivery take?',
        answer:
          'Standard delivery takes 3-5 business days within major cities. Remote areas may take 5-7 business days. Express delivery (same-day or next-day) is available in select cities.',
      },
      {
        question: 'How can I track my order?',
        answer:
          'Once your order is shipped, you\'ll receive an SMS and email with tracking information. You can also track your order from the "My Orders" section in your account.',
      },
      {
        question: 'Do you offer free shipping?',
        answer:
          'Yes! We offer free shipping on orders above Rs. 2,000. For orders below this amount, a flat delivery fee of Rs. 150 applies.',
      },
      {
        question: 'Can I change my delivery address?',
        answer:
          'You can change your delivery address before your order is shipped. Contact our support team or update it from your account if the order status is "Processing".',
      },
    ],
  },
  {
    title: 'Payments',
    icon: CreditCard,
    faqs: [
      {
        question: 'What payment methods do you accept?',
        answer:
          'We accept Cash on Delivery (COD), JazzCash, Easypaisa, credit/debit cards (Visa, MasterCard), and bank transfers.',
      },
      {
        question: 'Is Cash on Delivery available?',
        answer:
          'Yes, COD is available nationwide. You can pay in cash when your order is delivered.',
      },
      {
        question: 'Is my payment information secure?',
        answer:
          'Absolutely! We use industry-standard SSL encryption for all transactions. Your payment information is never stored on our servers.',
      },
    ],
  },
  {
    title: 'Returns & Refunds',
    icon: RotateCcw,
    faqs: [
      {
        question: 'What is your return policy?',
        answer:
          'We offer a 7-day return policy for most items. Products must be unused, in original packaging, and with tags attached. Some items like undergarments and personalized products are not eligible for returns.',
      },
      {
        question: 'How do I initiate a return?',
        answer:
          'Go to "My Orders", select the order you want to return, and click "Request Return". Our team will process your request within 24 hours.',
      },
      {
        question: 'How long do refunds take?',
        answer:
          'Refunds are processed within 5-7 business days after we receive and inspect the returned item. The amount will be credited to your original payment method.',
      },
    ],
  },
  {
    title: 'Account & Security',
    icon: Shield,
    faqs: [
      {
        question: 'How do I create an account?',
        answer:
          'Click on "Login" and then "Sign Up". You can register using your email address or phone number.',
      },
      {
        question: 'I forgot my password. What do I do?',
        answer:
          'Click on "Login" and then "Forgot Password". Enter your email address and we\'ll send you a link to reset your password.',
      },
      {
        question: 'How do I delete my account?',
        answer:
          'Go to Profile > Settings > Delete Account. Please note that this action is irreversible and all your data will be permanently deleted.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className='min-h-screen bg-background'>
      {/* Hero */}
      <div className='bg-gradient-to-r from-primary/10 to-primary/5 py-12 md:py-20'>
        <div className='max-w-7xl mx-auto px-4 text-center'>
          <HelpCircle className='w-12 h-12 text-primary mx-auto mb-4' />
          <h1 className='text-3xl md:text-5xl font-bold mb-4'>Frequently Asked Questions</h1>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Find answers to common questions about orders, payments, shipping, and more.
          </p>
        </div>
      </div>

      <div className='max-w-4xl mx-auto px-4 py-12'>
        <div className='space-y-8'>
          {faqCategories.map((category) => (
            <Card key={category.title}>
              <CardHeader>
                <CardTitle className='flex items-center gap-3'>
                  <category.icon className='w-5 h-5 text-primary' />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type='single' collapsible className='w-full'>
                  {category.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className='text-left'>{faq.question}</AccordionTrigger>
                      <AccordionContent className='text-muted-foreground'>
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Still need help */}
        <div className='mt-12 text-center p-8 bg-muted/50 rounded-xl'>
          <h2 className='text-xl font-semibold mb-2'>Still have questions?</h2>
          <p className='text-muted-foreground mb-4'>
            Can't find what you're looking for? Our support team is here to help.
          </p>
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
