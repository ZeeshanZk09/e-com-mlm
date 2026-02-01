'use client';

import { MapPin, Play, Quote, Star, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';

/**
 * Success Stories Section
 *
 * Features:
 * - Testimonial cards with earnings
 * - Video testimonial lightbox
 * - Before/After financial comparisons
 */

interface Testimonial {
  id: number;
  name: string;
  location: string;
  avatar: string;
  role: string;
  monthlyEarnings: number;
  quote: string;
  joinedMonthsAgo: number;
  rank: string;
  hasVideo: boolean;
  videoUrl?: string;
  beforeIncome?: number;
  teamSize: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Ahmed Raza Khan',
    location: 'Karachi',
    avatar: '/images/avatars/male-1.jpg',
    role: 'IT Professional',
    monthlyEarnings: 85000,
    quote:
      'I started as a side hustle while working my 9-5 job. Within 6 months, my MLM earnings exceeded my salary. Now I work full-time building my network!',
    joinedMonthsAgo: 8,
    rank: 'Platinum',
    hasVideo: true,
    videoUrl: '#',
    beforeIncome: 60000,
    teamSize: 342,
  },
  {
    id: 2,
    name: 'Fatima Bibi Sheikh',
    location: 'Lahore',
    avatar: '/images/avatars/female-1.jpg',
    role: 'Housewife',
    monthlyEarnings: 45000,
    quote:
      'As a housewife, I never thought I could earn this much. GO Shop gave me financial independence while staying home with my kids.',
    joinedMonthsAgo: 5,
    rank: 'Gold',
    hasVideo: false,
    beforeIncome: 0,
    teamSize: 89,
  },
  {
    id: 3,
    name: 'Muhammad Usman Ali',
    location: 'Islamabad',
    avatar: '/images/avatars/male-2.jpg',
    role: 'University Student',
    monthlyEarnings: 35000,
    quote:
      "I pay my own fees and expenses now. My parents are so proud that I'm financially independent at 21. This opportunity changed my life!",
    joinedMonthsAgo: 4,
    rank: 'Silver',
    hasVideo: true,
    videoUrl: '#',
    beforeIncome: 5000,
    teamSize: 45,
  },
  {
    id: 4,
    name: 'Sana Javed Malik',
    location: 'Faisalabad',
    avatar: '/images/avatars/female-2.jpg',
    role: 'School Teacher',
    monthlyEarnings: 55000,
    quote:
      'My teaching salary was ₹28,000. Now I earn double that from GO Shop alone! The best part? I still teach because I love it, not because I need the money.',
    joinedMonthsAgo: 7,
    rank: 'Gold',
    hasVideo: false,
    beforeIncome: 28000,
    teamSize: 156,
  },
  {
    id: 5,
    name: 'Imran Hussain Shah',
    location: 'Multan',
    avatar: '/images/avatars/male-3.jpg',
    role: 'Ex-Shopkeeper',
    monthlyEarnings: 120000,
    quote:
      'I closed my physical shop during COVID. GO Shop became my new business. No rent, no inventory headaches, just pure earnings from my network.',
    joinedMonthsAgo: 12,
    rank: 'Diamond',
    hasVideo: true,
    videoUrl: '#',
    beforeIncome: 40000,
    teamSize: 890,
  },
  {
    id: 6,
    name: 'Hina Altaf Rana',
    location: 'Peshawar',
    avatar: '/images/avatars/female-3.jpg',
    role: 'Beautician',
    monthlyEarnings: 38000,
    quote:
      "I share products with my salon clients and they love them! My referral network is growing through word of mouth. Easiest money I've ever made.",
    joinedMonthsAgo: 3,
    rank: 'Silver',
    hasVideo: false,
    beforeIncome: 25000,
    teamSize: 32,
  },
];

function getRankColor(rank: string): string {
  switch (rank) {
    case 'Diamond':
      return '#3b82f6';
    case 'Platinum':
      return '#a855f7';
    case 'Gold':
      return '#eab308';
    case 'Silver':
      return '#9ca3af';
    default:
      return '#64748b';
  }
}

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonial: Testimonial | null;
}

function VideoModal({ isOpen, onClose, testimonial }: VideoModalProps) {
  if (!isOpen || !testimonial) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in'
      onClick={onClose}
      role='dialog'
      aria-modal='true'
      aria-label={`Video testimonial from ${testimonial.name}`}
    >
      <div
        className='relative w-full max-w-3xl bg-card rounded-2xl overflow-hidden shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className='absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors'
          aria-label='Close video'
        >
          <X className='w-5 h-5' />
        </button>

        {/* Video Placeholder */}
        <div className='aspect-video bg-muted flex items-center justify-center'>
          <div className='text-center'>
            <Play className='w-16 h-16 mx-auto text-muted-foreground mb-4' />
            <p className='text-muted-foreground'>Video testimonial from {testimonial.name}</p>
            <p className='text-sm text-muted-foreground mt-2'>Video loading...</p>
          </div>
        </div>

        {/* Video Info */}
        <div className='p-6'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 rounded-full bg-muted' />
            <div>
              <h4 className='font-semibold'>{testimonial.name}</h4>
              <p className='text-sm text-muted-foreground'>
                {testimonial.location} • {testimonial.rank} Member
              </p>
            </div>
            <div className='ml-auto text-right'>
              <p className='text-sm text-muted-foreground'>Monthly Earnings</p>
              <p className='text-xl font-bold text-[#7be08a]'>
                ₹{testimonial.monthlyEarnings.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({
  testimonial,
  onPlayVideo,
}: {
  testimonial: Testimonial;
  onPlayVideo: () => void;
}) {
  const incomeGrowth = testimonial.beforeIncome
    ? Math.round(
        ((testimonial.monthlyEarnings - testimonial.beforeIncome) /
          (testimonial.beforeIncome || 1)) *
          100
      )
    : null;

  return (
    <div className='bg-card rounded-2xl border border-border p-6 h-full flex flex-col transition-all duration-300 hover:border-[#7be08a]/50 hover:shadow-lg hover:shadow-[#0b6b2e]/10'>
      {/* Header */}
      <div className='flex items-start gap-4 mb-4'>
        <div className='relative'>
          <div className='w-14 h-14 rounded-full bg-linear-to-br from-[#0b6b2e] to-[#7be08a] p-0.5'>
            <div className='w-full h-full rounded-full bg-muted overflow-hidden flex items-center justify-center text-xl font-bold'>
              {testimonial.name.charAt(0)}
            </div>
          </div>
          {/* Rank badge */}
          <div
            className='absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-card'
            style={{ background: getRankColor(testimonial.rank) }}
          >
            {testimonial.rank.charAt(0)}
          </div>
        </div>
        <div className='flex-1 min-w-0'>
          <h4 className='font-semibold truncate'>{testimonial.name}</h4>
          <p className='text-sm text-muted-foreground flex items-center gap-1'>
            <MapPin className='w-3 h-3' />
            {testimonial.location}
          </p>
          <p className='text-xs text-muted-foreground'>{testimonial.role}</p>
        </div>
        {testimonial.hasVideo && (
          <Button
            size='sm'
            variant='outline'
            className='shrink-0'
            onClick={onPlayVideo}
            aria-label={`Watch video testimonial from ${testimonial.name}`}
          >
            <Play className='w-4 h-4' />
          </Button>
        )}
      </div>

      {/* Quote */}
      <div className='flex-1 mb-4'>
        <Quote className='w-5 h-5 text-[#7be08a]/50 mb-2' />
        <p className='text-sm leading-relaxed text-muted-foreground'>{testimonial.quote}</p>
      </div>

      {/* Stats */}
      <div className='space-y-3 pt-4 border-t border-border'>
        {/* Earnings */}
        <div className='flex items-center justify-between'>
          <span className='text-sm text-muted-foreground'>Monthly Earnings</span>
          <span className='text-lg font-bold text-[#7be08a]'>
            ₹{testimonial.monthlyEarnings.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Before/After */}
        {testimonial.beforeIncome !== undefined && incomeGrowth !== null && (
          <div className='flex items-center justify-between text-sm'>
            <span className='text-muted-foreground'>
              Was earning: ₹{testimonial.beforeIncome.toLocaleString('en-IN')}
            </span>
            <span className='text-[#7be08a] font-medium'>+{incomeGrowth}% growth</span>
          </div>
        )}

        {/* Additional stats */}
        <div className='flex items-center justify-between text-sm'>
          <div className='flex items-center gap-1 text-muted-foreground'>
            <Star className='w-3 h-3' style={{ color: getRankColor(testimonial.rank) }} />
            <span>{testimonial.rank} Member</span>
          </div>
          <span className='text-muted-foreground'>{testimonial.teamSize} team members</span>
        </div>
        <div className='text-xs text-muted-foreground'>
          Member for {testimonial.joinedMonthsAgo} months
        </div>
      </div>
    </div>
  );
}

export function SuccessStories() {
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayedTestimonials = showAll ? TESTIMONIALS : TESTIMONIALS.slice(0, 3);

  // Calculate total stats
  const totalEarnings = TESTIMONIALS.reduce((sum, t) => sum + t.monthlyEarnings, 0);
  const avgEarnings = Math.round(totalEarnings / TESTIMONIALS.length);

  return (
    <section className='py-12 sm:py-16 lg:py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-10 sm:mb-12'>
          <div className='inline-flex items-center gap-2 bg-[#7be08a]/10 text-[#7be08a] rounded-full px-4 py-1.5 mb-4'>
            <Star className='w-4 h-4' />
            <span className='text-sm font-medium'>Success Stories</span>
          </div>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-4'>
            Real People, <span className='text-[#7be08a]'>Real Earnings</span>
          </h2>
          <p className='text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto'>
            Meet our members who transformed their lives through GO Shop MLM network.
          </p>

          {/* Quick Stats */}
          <div className='flex flex-wrap justify-center gap-6 sm:gap-8 mt-6'>
            <div className='text-center'>
              <p className='text-2xl sm:text-3xl font-bold text-[#7be08a]'>
                {TESTIMONIALS.length}+
              </p>
              <p className='text-sm text-muted-foreground'>Success Stories</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl sm:text-3xl font-bold'>
                ₹{avgEarnings.toLocaleString('en-IN')}
              </p>
              <p className='text-sm text-muted-foreground'>Avg. Monthly Earnings</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl sm:text-3xl font-bold text-[#7be08a]'>50+</p>
              <p className='text-sm text-muted-foreground'>Cities Represented</p>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {displayedTestimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              onPlayVideo={() => setSelectedTestimonial(testimonial)}
            />
          ))}
        </div>

        {/* Show More/Less Button */}
        {TESTIMONIALS.length > 3 && (
          <div className='text-center mt-8'>
            <Button variant='outline' onClick={() => setShowAll(!showAll)} className='px-6'>
              {showAll ? 'Show Less' : `Show More Stories (${TESTIMONIALS.length - 3} more)`}
            </Button>
          </div>
        )}

        {/* Video Modal */}
        <VideoModal
          isOpen={!!selectedTestimonial}
          onClose={() => setSelectedTestimonial(null)}
          testimonial={selectedTestimonial}
        />
      </div>
    </section>
  );
}

export default SuccessStories;
