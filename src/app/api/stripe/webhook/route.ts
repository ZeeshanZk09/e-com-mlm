import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { handleStripeWebhook } from '@/actions/billing/stripe';

// Initialize Stripe lazily to avoid build-time errors
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-01-28.clover',
  });
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const error = err as Error;
      console.error('Webhook signature verification failed:', error.message);
      return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
    }

    // Handle the webhook
    await handleStripeWebhook(event);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
