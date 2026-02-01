'use client';

import { Award, Building2, CreditCard, Lock, ShieldCheck, Star } from 'lucide-react';

/**
 * Trust Section
 *
 * Shows trust signals including:
 * - Leadership/company info
 * - Certifications
 * - Security badges
 * - Press mentions
 */

const TRUST_BADGES = [
  {
    icon: ShieldCheck,
    title: '100% Secure',
    description: 'SSL encrypted transactions',
  },
  {
    icon: Lock,
    title: 'Data Protection',
    description: 'Your information is safe',
  },
  {
    icon: CreditCard,
    title: 'Verified Payments',
    description: 'Multiple payment options',
  },
  {
    icon: Award,
    title: 'Quality Assured',
    description: 'All products verified',
  },
];

const LEADERSHIP_TEAM = [
  {
    name: 'Muhammad Arif',
    role: 'Founder & CEO',
    bio: 'Former e-commerce executive with 15+ years experience in retail technology.',
    image: '/images/team/ceo.jpg',
  },
  {
    name: 'Fatima Zahra',
    role: 'Head of Operations',
    bio: 'Operations expert who scaled multiple startups across Pakistan.',
    image: '/images/team/coo.jpg',
  },
  {
    name: 'Hassan Ahmed',
    role: 'MLM Program Director',
    bio: 'Network marketing specialist with successful track record in ethical MLM.',
    image: '/images/team/mlm-director.jpg',
  },
];

const CERTIFICATIONS = [
  { name: 'FBR Registered', id: 'fbr' },
  { name: 'SECP Certified', id: 'secp' },
  { name: 'PCI DSS Compliant', id: 'pci' },
  { name: 'ISO 27001', id: 'iso' },
];

export function TrustSection() {
  return (
    <section className='py-12 sm:py-16 lg:py-20 bg-card/50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-10 sm:mb-12'>
          <div className='inline-flex items-center gap-2 bg-[#7be08a]/10 text-[#7be08a] rounded-full px-4 py-1.5 mb-4'>
            <ShieldCheck className='w-4 h-4' />
            <span className='text-sm font-medium'>Trust & Transparency</span>
          </div>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-4'>
            Built on <span className='text-[#7be08a]'>Trust & Integrity</span>
          </h2>
          <p className='text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto'>
            Your security and success are our top priorities. Here&apos;s why you can trust GO Shop.
          </p>
        </div>

        {/* Trust Badges Grid */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-12'>
          {TRUST_BADGES.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.title}
                className='flex flex-col items-center text-center p-4 sm:p-6 bg-card rounded-xl border border-border'
              >
                <div className='w-12 h-12 rounded-full bg-[#7be08a]/10 flex items-center justify-center mb-3'>
                  <Icon className='w-6 h-6 text-[#7be08a]' />
                </div>
                <h3 className='font-semibold text-sm sm:text-base mb-1'>{badge.title}</h3>
                <p className='text-xs text-muted-foreground'>{badge.description}</p>
              </div>
            );
          })}
        </div>

        {/* Leadership Team */}
        <div className='mb-12'>
          <h3 className='text-xl font-semibold text-center mb-8'>Meet Our Leadership</h3>
          <div className='grid md:grid-cols-3 gap-6'>
            {LEADERSHIP_TEAM.map((member) => (
              <div
                key={member.name}
                className='bg-card rounded-xl border border-border p-6 text-center'
              >
                {/* Avatar placeholder */}
                <div className='w-20 h-20 mx-auto rounded-full bg-linear-to-br from-[#0b6b2e] to-[#7be08a] flex items-center justify-center text-white text-2xl font-bold mb-4'>
                  {member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <h4 className='font-semibold mb-1'>{member.name}</h4>
                <p className='text-sm text-[#7be08a] mb-3'>{member.role}</p>
                <p className='text-sm text-muted-foreground'>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className='bg-card rounded-2xl border border-border p-6 sm:p-8'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
            <div>
              <h3 className='font-semibold mb-2 flex items-center gap-2'>
                <Building2 className='w-5 h-5 text-[#7be08a]' />
                Registered & Compliant Business
              </h3>
              <p className='text-sm text-muted-foreground'>
                GO Shop is a fully registered and compliant e-commerce business operating legally in
                Pakistan.
              </p>
            </div>

            <div className='flex flex-wrap justify-center gap-4'>
              {CERTIFICATIONS.map((cert) => (
                <div
                  key={cert.id}
                  className='flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full text-sm'
                >
                  <Star className='w-4 h-4 text-[#7be08a]' />
                  <span>{cert.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Company Stats */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-8'>
          <div className='text-center p-4'>
            <p className='text-3xl sm:text-4xl font-bold text-[#7be08a]'>2020</p>
            <p className='text-sm text-muted-foreground'>Founded</p>
          </div>
          <div className='text-center p-4'>
            <p className='text-3xl sm:text-4xl font-bold'>50+</p>
            <p className='text-sm text-muted-foreground'>Team Members</p>
          </div>
          <div className='text-center p-4'>
            <p className='text-3xl sm:text-4xl font-bold text-[#7be08a]'>5000+</p>
            <p className='text-sm text-muted-foreground'>Products</p>
          </div>
          <div className='text-center p-4'>
            <p className='text-3xl sm:text-4xl font-bold'>50k+</p>
            <p className='text-sm text-muted-foreground'>Happy Members</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustSection;
