'use client';

import { Share2, ShoppingCart, TrendingUp, UserPlus } from 'lucide-react';
import { useState } from 'react';

/**
 * 3-Step Process Section
 *
 * Shows how MLM works in 3 simple steps:
 * 1. Sign Up Free
 * 2. Shop & Share
 * 3. Earn Commissions
 */

const steps = [
  {
    step: 1,
    icon: UserPlus,
    title: 'Sign Up Free',
    shortDesc: 'Create your free account',
    fullDesc:
      "Join our network in under 2 minutes. No joining fees, no hidden charges. Just your email and you're ready to start your earning journey.",
    benefits: [
      'Zero investment required',
      'Instant account activation',
      'Get your unique referral link',
    ],
    color: '#7be08a',
  },
  {
    step: 2,
    icon: ShoppingCart,
    title: 'Shop & Share',
    shortDesc: 'Shop products & share your link',
    fullDesc:
      'Shop quality products at the best prices for yourself. Share your referral link with friends, family, and on social media.',
    benefits: [
      'Quality products at best prices',
      'Easy social sharing tools',
      'Track your referrals in real-time',
    ],
    color: '#0b6b2e',
    secondaryIcon: Share2,
  },
  {
    step: 3,
    icon: TrendingUp,
    title: 'Earn Commissions',
    shortDesc: 'Get paid on every sale',
    fullDesc:
      'Earn commissions on purchases made by your referrals – up to 5 levels deep! Watch your passive income grow as your network expands.',
    benefits: ['5 levels of earning', 'Instant wallet credit', 'Weekly withdrawals available'],
    color: '#7be08a',
  },
];

export function ProcessSection() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section className='py-12 sm:py-16 lg:py-20 bg-card/50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-10 sm:mb-12'>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-4'>
            How It Works – <span className='text-[#7be08a]'>3 Simple Steps</span>
          </h2>
          <p className='text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto'>
            Start earning in minutes. No experience needed, no investment required.
          </p>
        </div>

        {/* Steps Grid */}
        <div className='grid md:grid-cols-3 gap-6 lg:gap-8'>
          {steps.map((step, index) => {
            const Icon = step.icon;
            const SecondaryIcon = step.secondaryIcon;
            const isActive = activeStep === step.step;

            return (
              <div
                key={step.step}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  isActive ? 'scale-105' : 'hover:scale-102'
                }`}
                onMouseEnter={() => setActiveStep(step.step)}
                onMouseLeave={() => setActiveStep(null)}
                role='button'
                tabIndex={0}
                onFocus={() => setActiveStep(step.step)}
                onBlur={() => setActiveStep(null)}
                aria-label={`Step ${step.step}: ${step.title}`}
              >
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className='hidden md:block absolute top-1/2 -right-4 lg:-right-5 w-8 lg:w-10 h-0.5 bg-border z-0'>
                    <div
                      className='h-full bg-linear-to-r from-[#0b6b2e] to-[#7be08a] transition-all duration-500'
                      style={{ width: isActive || activeStep === step.step + 1 ? '100%' : '0%' }}
                    />
                  </div>
                )}

                {/* Card */}
                <div
                  className={`relative z-10 bg-card rounded-2xl border p-6 lg:p-8 h-full transition-all duration-300 ${
                    isActive
                      ? 'border-[#7be08a] shadow-lg shadow-[#0b6b2e]/20'
                      : 'border-border hover:border-[#0b6b2e]/50'
                  }`}
                >
                  {/* Step number badge */}
                  <div
                    className='absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg'
                    style={{ background: `linear-gradient(135deg, #0b6b2e, ${step.color})` }}
                  >
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className='flex items-center gap-2 mb-4 mt-2'>
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isActive ? 'bg-[#7be08a]/20' : 'bg-muted'
                      }`}
                    >
                      <Icon
                        className='w-6 h-6 transition-colors duration-300'
                        style={{ color: isActive ? step.color : 'currentColor' }}
                      />
                    </div>
                    {SecondaryIcon && (
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isActive ? 'bg-[#7be08a]/20' : 'bg-muted'
                        }`}
                      >
                        <SecondaryIcon
                          className='w-6 h-6 transition-colors duration-300'
                          style={{ color: isActive ? step.color : 'currentColor' }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className='text-xl font-semibold mb-2'>{step.title}</h3>

                  {/* Description */}
                  <p className='text-muted-foreground text-sm mb-4'>
                    {isActive ? step.fullDesc : step.shortDesc}
                  </p>

                  {/* Benefits - shown on hover/active */}
                  <div
                    className={`space-y-2 overflow-hidden transition-all duration-300 ${
                      isActive ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {step.benefits.map((benefit, i) => (
                      <div key={i} className='flex items-center gap-2 text-sm'>
                        <div className='w-1.5 h-1.5 rounded-full bg-[#7be08a]' />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className='text-center mt-10 sm:mt-12'>
          <p className='text-muted-foreground mb-4'>Ready to start your journey?</p>
          <a
            href='/auth/signup?mlm=true'
            className='inline-flex items-center gap-2 bg-linear-to-r from-[#0b6b2e] to-[#0b6b2e]/80 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-lg shadow-[#0b6b2e]/25'
          >
            Get Started Now – It&apos;s Free
            <TrendingUp className='w-5 h-5' />
          </a>
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;
