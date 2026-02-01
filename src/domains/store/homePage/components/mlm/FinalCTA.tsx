'use client';

import { ArrowRight, Calendar, Headphones, Shield, TrendingUp, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/shared/components/ui/button';

/**
 * Final CTA Section
 *
 * Full-width section with:
 * - Compelling headline
 * - Multiple CTAs
 * - Trust signals
 * - Limited-time offer countdown
 */

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - Date.now();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className='flex gap-3 sm:gap-4 justify-center'>
      {[
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hours' },
        { value: timeLeft.minutes, label: 'Mins' },
        { value: timeLeft.seconds, label: 'Secs' },
      ].map((item, index) => (
        <div key={index} className='flex flex-col items-center'>
          <div className='w-14 sm:w-16 h-14 sm:h-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20'>
            <span className='text-2xl sm:text-3xl font-bold tabular-nums'>
              {item.value.toString().padStart(2, '0')}
            </span>
          </div>
          <span className='text-xs mt-1 text-white/70'>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function FinalCTA() {
  // Limited offer expires end of month
  const offerEndDate = new Date();
  offerEndDate.setMonth(offerEndDate.getMonth() + 1);
  offerEndDate.setDate(0); // Last day of current month
  offerEndDate.setHours(23, 59, 59, 999);

  return (
    <section className='relative py-16 sm:py-20 lg:py-24 overflow-hidden'>
      {/* Background */}
      <div className='absolute inset-0 bg-linear-to-br from-[#0b6b2e] via-[#0b6b2e]/90 to-[#0b6b2e]' />

      {/* Decorative elements */}
      <div className='absolute inset-0 opacity-20'>
        <div className='absolute top-0 right-0 w-96 h-96 bg-[#7be08a] rounded-full blur-3xl translate-x-1/2 -translate-y-1/2' />
        <div className='absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl -translate-x-1/2 translate-y-1/2' />
      </div>

      {/* Grid pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div
          className='w-full h-full'
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className='relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white'>
        {/* Limited Time Badge */}
        <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6'>
          <Zap className='w-4 h-4 text-[#7be08a]' />
          <span className='text-sm font-medium'>
            Limited Time: Extra ₹500 Bonus on First Referral
          </span>
        </div>

        {/* Countdown */}
        <div className='mb-8'>
          <p className='text-sm text-white/70 mb-3'>Offer Ends In:</p>
          <CountdownTimer targetDate={offerEndDate} />
        </div>

        {/* Main Headline */}
        <h2 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight'>
          Your Financial Freedom <br className='hidden sm:block' />
          Journey <span className='text-[#7be08a]'>Starts Here</span>
        </h2>

        {/* Subheadline */}
        <p className='text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-8'>
          Join 50,000+ entrepreneurs who turned their shopping into a profitable business. Zero
          investment. Unlimited potential.
        </p>

        {/* Trust Stats */}
        <div className='flex flex-wrap justify-center gap-6 sm:gap-10 mb-10'>
          <div className='flex items-center gap-2'>
            <Users className='w-5 h-5 text-[#7be08a]' />
            <span className='text-sm'>50,000+ Active Members</span>
          </div>
          <div className='flex items-center gap-2'>
            <TrendingUp className='w-5 h-5 text-[#7be08a]' />
            <span className='text-sm'>₹2.5 Crore+ Commissions Paid</span>
          </div>
          <div className='flex items-center gap-2'>
            <Shield className='w-5 h-5 text-[#7be08a]' />
            <span className='text-sm'>100% Secure & Transparent</span>
          </div>
        </div>

        {/* CTAs */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center mb-10'>
          <Button
            asChild
            size='lg'
            className='bg-white text-[#0b6b2e] hover:bg-white/90 font-semibold px-8 py-6 text-lg rounded-xl shadow-lg transition-all hover:scale-105'
          >
            <Link href='/auth/signup?mlm=true'>
              Start Earning Now – Join Free
              <ArrowRight className='w-5 h-5 ml-2' />
            </Link>
          </Button>
          <Button
            asChild
            size='lg'
            variant='outline'
            className='border-2 border-white/50 text-white bg-transparent hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-xl transition-all hover:scale-105'
          >
            <Link href='/contact'>
              <Calendar className='w-5 h-5 mr-2' />
              Schedule 1-on-1 Call
            </Link>
          </Button>
        </div>

        {/* Contact Info */}
        <div className='flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/70'>
          <div className='flex items-center gap-2'>
            <Headphones className='w-4 h-4' />
            <span>24/7 Support: +92 300 1234567</span>
          </div>
          <span className='hidden sm:block'>•</span>
          <a
            href='https://wa.me/923001234567'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-2 hover:text-white transition-colors'
          >
            <svg className='w-4 h-4' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' />
            </svg>
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Guarantee Badge */}
        <div className='mt-10 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3'>
          <Shield className='w-8 h-8 text-[#7be08a]' />
          <div className='text-left'>
            <p className='text-sm font-semibold'>100% Risk-Free Guarantee</p>
            <p className='text-xs text-white/70'>
              No investment required. Cancel anytime. No hidden fees.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;
