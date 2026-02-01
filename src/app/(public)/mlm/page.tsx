import { Suspense } from 'react';
import { Metadata } from 'next';
import {
  MLMHeroSection,
  MLMProcessSection,
  MLMLiveActivitySection,
  MLMEarningsCalculator,
  MLMSuccessStories,
  MLMFeaturedProducts,
  MLMComparisonTable,
  MLMTrustSection,
  MLMFAQSection,
  MLMFinalCTA,
} from '@/domains/store/homePage/components';
import { ProductGridSkeleton } from '@/shared/components/skeletons';

/**
 * MLM Marketing Homepage
 *
 * High-converting landing page for MLM e-commerce platform
 * Designed to maximize user sign-ups and participation
 */

export const metadata: Metadata = {
  title: 'Join GO Shop MLM | Earn While You Shop',
  description:
    "Turn your shopping into unlimited earnings. Join Pakistan's fastest-growing MLM shopping network. Zero investment, 5 levels of commission, instant wallet credit. Start earning today!",
  keywords: [
    'MLM Pakistan',
    'network marketing Pakistan',
    'earn money online Pakistan',
    'referral program',
    'passive income Pakistan',
    'GO Shop MLM',
    'shopping rewards',
    'affiliate marketing',
  ],
  openGraph: {
    title: 'Join GO Shop MLM | Earn While You Shop',
    description:
      'Turn your shopping into unlimited earnings. Join 50,000+ members earning commissions across 5 levels.',
    type: 'website',
    images: [
      {
        url: '/images/mlm-og.png',
        width: 1200,
        height: 630,
        alt: 'GO Shop MLM - Earn While You Shop',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join GO Shop MLM | Earn While You Shop',
    description:
      'Turn your shopping into unlimited earnings. Zero investment, instant commissions.',
  },
};

// Skeleton loader for heavy sections
function SectionSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className='max-w-7xl mx-auto px-4 py-16'>
        <div className='h-8 bg-muted rounded w-1/3 mx-auto mb-4' />
        <div className='h-4 bg-muted rounded w-1/2 mx-auto mb-8' />
        <div className='grid md:grid-cols-3 gap-6'>
          {[1, 2, 3].map((n) => (
            <div key={n} className='h-48 bg-muted rounded-xl' />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MLMMarketingPage() {
  return (
    <main className='min-h-screen'>
      {/* Section 1: Hero - Above the fold, loads immediately */}
      <MLMHeroSection />

      {/* Section 2: How It Works - 3 Step Process */}
      <MLMProcessSection />

      {/* Section 3: Live Activity Dashboard - with lazy loading */}
      <Suspense fallback={<SectionSkeleton />}>
        <MLMLiveActivitySection />
      </Suspense>

      {/* Section 4: Earnings Calculator */}
      <Suspense fallback={<SectionSkeleton className='bg-card/50' />}>
        <MLMEarningsCalculator />
      </Suspense>

      {/* Section 5: Success Stories */}
      <Suspense fallback={<SectionSkeleton />}>
        <MLMSuccessStories />
      </Suspense>

      {/* Section 6: Featured Products with MLM Angle */}
      <Suspense fallback={<ProductGridSkeleton count={6} />}>
        <MLMFeaturedProducts />
      </Suspense>

      {/* Section 7: Comparison Table */}
      <Suspense fallback={<SectionSkeleton className='bg-card/50' />}>
        <MLMComparisonTable />
      </Suspense>

      {/* Section 8: Trust & Leadership */}
      <Suspense fallback={<SectionSkeleton className='bg-card/50' />}>
        <MLMTrustSection />
      </Suspense>

      {/* Section 9: FAQ Section */}
      <Suspense fallback={<SectionSkeleton />}>
        <MLMFAQSection />
      </Suspense>

      {/* Section 10: Final CTA */}
      <MLMFinalCTA />
    </main>
  );
}
