'use client';

import { ShoppingCart, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';

/**
 * Featured Products Section with MLM Commission Badges
 *
 * Shows top products with commission information
 */

interface FeaturedProduct {
  id: string;
  title: string;
  slug: string;
  image: string;
  basePrice: number;
  salePrice?: number;
  commissionPercent: number;
  badge?: 'high-commission' | 'bestseller' | 'new';
  soldCount: number;
}

// Mock featured products with MLM data
const FEATURED_PRODUCTS: FeaturedProduct[] = [
  {
    id: '1',
    title: 'Premium Vitamin C Serum - 30ml',
    slug: 'vitamin-c-serum-30ml',
    image: '/images/products/serum.jpg',
    basePrice: 2499,
    salePrice: 1899,
    commissionPercent: 15,
    badge: 'high-commission',
    soldCount: 1234,
  },
  {
    id: '2',
    title: 'Organic Hair Growth Oil - 200ml',
    slug: 'organic-hair-oil-200ml',
    image: '/images/products/hair-oil.jpg',
    basePrice: 1299,
    salePrice: 999,
    commissionPercent: 12,
    badge: 'bestseller',
    soldCount: 2567,
  },
  {
    id: '3',
    title: 'Premium Multivitamin Pack (60 Tablets)',
    slug: 'multivitamin-60-tablets',
    image: '/images/products/vitamins.jpg',
    basePrice: 1899,
    commissionPercent: 18,
    badge: 'high-commission',
    soldCount: 890,
  },
  {
    id: '4',
    title: 'Anti-Aging Night Cream - 50g',
    slug: 'anti-aging-cream-50g',
    image: '/images/products/cream.jpg',
    basePrice: 2999,
    salePrice: 2499,
    commissionPercent: 14,
    badge: 'new',
    soldCount: 456,
  },
  {
    id: '5',
    title: 'Fitness Resistance Bands Set',
    slug: 'resistance-bands-set',
    image: '/images/products/fitness.jpg',
    basePrice: 1499,
    salePrice: 1199,
    commissionPercent: 11,
    soldCount: 789,
  },
  {
    id: '6',
    title: 'Organic Green Tea (100 Bags)',
    slug: 'organic-green-tea-100',
    image: '/images/products/tea.jpg',
    basePrice: 899,
    commissionPercent: 10,
    badge: 'bestseller',
    soldCount: 3421,
  },
];

function getBadgeInfo(badge: FeaturedProduct['badge']) {
  switch (badge) {
    case 'high-commission':
      return { text: 'High Commission', color: 'bg-[#7be08a] text-[#0b6b2e]' };
    case 'bestseller':
      return { text: 'Best Seller', color: 'bg-amber-500 text-white' };
    case 'new':
      return { text: 'New Arrival', color: 'bg-blue-500 text-white' };
    default:
      return null;
  }
}

function ProductCard({ product }: { product: FeaturedProduct }) {
  const badgeInfo = product.badge ? getBadgeInfo(product.badge) : null;
  const discount = product.salePrice
    ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
    : 0;
  const displayPrice = product.salePrice || product.basePrice;
  const potentialCommission = Math.floor(displayPrice * (product.commissionPercent / 100) * 0.21); // Total 5-level commission

  return (
    <div className='group bg-card rounded-xl border border-border overflow-hidden transition-all hover:border-[#7be08a]/50 hover:shadow-lg hover:shadow-[#0b6b2e]/10'>
      {/* Image Container */}
      <div className='relative aspect-square bg-muted overflow-hidden'>
        {/* Placeholder image */}
        <div className='w-full h-full bg-linear-to-br from-muted to-muted/50 flex items-center justify-center'>
          <ShoppingCart className='w-12 h-12 text-muted-foreground/30' />
        </div>

        {/* Badge */}
        {badgeInfo && (
          <div
            className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold ${badgeInfo.color}`}
          >
            {badgeInfo.text}
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <div className='absolute top-3 right-3 bg-destructive text-white px-2 py-1 rounded-full text-xs font-semibold'>
            -{discount}%
          </div>
        )}

        {/* Commission Badge */}
        <div className='absolute bottom-3 left-3 right-3 bg-card/90 backdrop-blur-sm rounded-lg p-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all'>
          <div className='flex items-center justify-between text-xs'>
            <span className='text-muted-foreground'>Your Earnings</span>
            <span className='font-semibold text-[#7be08a]'>Up to ₹{potentialCommission}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='p-4'>
        <h3 className='font-medium text-sm line-clamp-2 mb-2 min-h-[40px]'>{product.title}</h3>

        {/* Price */}
        <div className='flex items-center gap-2 mb-3'>
          <span className='text-lg font-bold'>₹{displayPrice.toLocaleString('en-IN')}</span>
          {product.salePrice && (
            <span className='text-sm text-muted-foreground line-through'>
              ₹{product.basePrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Commission Info */}
        <div className='flex items-center justify-between text-sm mb-3'>
          <div className='flex items-center gap-1 text-[#7be08a]'>
            <TrendingUp className='w-4 h-4' />
            <span className='font-medium'>{product.commissionPercent}% Commission</span>
          </div>
          <span className='text-muted-foreground'>{product.soldCount.toLocaleString()} sold</span>
        </div>

        {/* CTA */}
        <Button asChild className='w-full bg-linear-to-r from-[#0b6b2e] to-[#0b6b2e]/80 text-white'>
          <Link href={`/shop/${product.slug}`}>
            <ShoppingCart className='w-4 h-4 mr-2' />
            Shop & Earn
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function FeaturedProducts() {
  return (
    <section className='py-12 sm:py-16 lg:py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8'>
          <div>
            <div className='inline-flex items-center gap-2 bg-[#0b6b2e]/10 text-[#0b6b2e] dark:text-[#7be08a] rounded-full px-4 py-1.5 mb-4'>
              <TrendingUp className='w-4 h-4' />
              <span className='text-sm font-medium'>Top Products</span>
            </div>
            <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold'>
              Products Our <span className='text-[#7be08a]'>Members Love</span>
            </h2>
            <p className='text-muted-foreground mt-2'>
              Shop these bestsellers and earn commissions on every sale in your network
            </p>
          </div>
          <Button asChild variant='outline' className='shrink-0'>
            <Link href='/shop'>View All Products</Link>
          </Button>
        </div>

        {/* Products Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className='mt-10 text-center bg-linear-to-r from-[#0b6b2e]/10 to-[#7be08a]/10 rounded-2xl p-6 sm:p-8 border border-[#0b6b2e]/20'>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <div className='text-left'>
              <h3 className='text-lg font-semibold mb-1'>Share Products, Earn Commissions</h3>
              <p className='text-sm text-muted-foreground'>
                Get up to 21% commission across 5 levels when your network shops
              </p>
            </div>
            <Button
              asChild
              size='lg'
              className='bg-linear-to-r from-[#0b6b2e] to-[#0b6b2e]/80 text-white shrink-0'
            >
              <Link href='/auth/signup?mlm=true'>Start Earning Today</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
