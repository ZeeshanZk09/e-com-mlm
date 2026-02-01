'use client';

import { Heart, ShoppingCart, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import { cn } from '@/shared/lib/utils';
import { useSwipeable, useHaptics } from '@/hooks';
import { Badge } from '@/shared/components/ui/badge';

interface ProductCardProps {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly basePrice: number;
  readonly salePrice?: number | null;
  readonly imageUrl?: string;
  readonly category?: string;
  readonly commission?: number;
  readonly isNew?: boolean;
  readonly isBestseller?: boolean;
  readonly inStock?: boolean;
  readonly onAddToCart?: (id: string) => void;
  readonly onAddToWishlist?: (id: string) => void;
  readonly onQuickView?: (id: string) => void;
}

/**
 * Mobile Product Card
 *
 * Features:
 * - Swipe left to add to cart
 * - Swipe right to add to wishlist
 * - Full-width design
 * - Touch-optimized targets
 * - Visual swipe feedback
 */
export function MobileProductCard({
  id,
  name,
  slug,
  basePrice,
  salePrice,
  imageUrl,
  category,
  commission,
  isNew,
  isBestseller,
  inStock = true,
  onAddToCart,
  onAddToWishlist,
}: ProductCardProps) {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const { light, medium } = useHaptics();

  const handleSwipeLeft = useCallback(() => {
    medium();
    onAddToCart?.(id);
    setSwipeDirection(null);
    setSwipeProgress(0);
  }, [id, medium, onAddToCart]);

  const handleSwipeRight = useCallback(() => {
    medium();
    onAddToWishlist?.(id);
    setSwipeDirection(null);
    setSwipeProgress(0);
  }, [id, medium, onAddToWishlist]);

  const swipeHandlers = useSwipeable({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    onSwipe: (event) => {
      // Provide visual feedback during swipe
      if (event.direction === 'left' || event.direction === 'right') {
        setSwipeDirection(event.direction);
        setSwipeProgress(Math.min(event.distance / 100, 1));
        light();
      }
    },
    threshold: 60,
    direction: 'horizontal',
  });

  const discount =
    salePrice && basePrice > salePrice
      ? Math.round(((basePrice - salePrice) / basePrice) * 100)
      : 0;

  const displayPrice = salePrice ?? basePrice;

  return (
    <div
      className='relative overflow-hidden rounded-xl bg-card border border-border touch-pan-y'
      {...swipeHandlers}
    >
      {/* Swipe action indicators */}
      <div
        className={cn(
          'absolute inset-y-0 left-0 w-16 flex items-center justify-center',
          'bg-[#0b6b2e] transition-opacity duration-150',
          swipeDirection === 'right' ? 'opacity-100' : 'opacity-0'
        )}
        style={{ opacity: swipeDirection === 'right' ? swipeProgress : 0 }}
      >
        <Heart className='w-6 h-6 text-white' />
      </div>
      <div
        className={cn(
          'absolute inset-y-0 right-0 w-16 flex items-center justify-center',
          'bg-primary transition-opacity duration-150',
          swipeDirection === 'left' ? 'opacity-100' : 'opacity-0'
        )}
        style={{ opacity: swipeDirection === 'left' ? swipeProgress : 0 }}
      >
        <ShoppingCart className='w-6 h-6 text-primary-foreground' />
      </div>

      {/* Card content */}
      <Link
        href={`/shop/${slug}`}
        className='block bg-card transition-transform duration-150'
        style={{
          transform: swipeDirection
            ? `translateX(${swipeDirection === 'left' ? -swipeProgress * 20 : swipeProgress * 20}px)`
            : 'translateX(0)',
        }}
      >
        {/* Image */}
        <div className='relative aspect-square bg-muted'>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className='object-cover'
              sizes='(max-width: 768px) 50vw, 25vw'
            />
          ) : (
            <div className='absolute inset-0 flex items-center justify-center text-muted-foreground'>
              No Image
            </div>
          )}

          {/* Badges */}
          <div className='absolute top-2 left-2 flex flex-col gap-1'>
            {isNew && (
              <Badge className='bg-[#0b6b2e] text-white text-[10px] px-1.5 py-0.5'>NEW</Badge>
            )}
            {isBestseller && (
              <Badge className='bg-amber-500 text-white text-[10px] px-1.5 py-0.5'>
                BESTSELLER
              </Badge>
            )}
            {discount > 0 && (
              <Badge className='bg-destructive text-white text-[10px] px-1.5 py-0.5'>
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Commission badge */}
          {commission && commission > 0 && (
            <div className='absolute top-2 right-2 bg-[#7be08a] text-[#0b6b2e] text-[10px] font-bold px-1.5 py-0.5 rounded'>
              +₹{commission} earn
            </div>
          )}

          {/* Out of stock overlay */}
          {!inStock && (
            <div className='absolute inset-0 bg-background/80 flex items-center justify-center'>
              <span className='text-sm font-medium text-muted-foreground'>Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className='p-3'>
          {category && (
            <p className='text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5'>
              {category}
            </p>
          )}
          <h3 className='font-medium text-sm line-clamp-2 mb-1.5'>{name}</h3>
          <div className='flex items-baseline gap-2'>
            <span className='font-bold text-base'>₹{displayPrice.toLocaleString()}</span>
            {salePrice && basePrice > salePrice && (
              <span className='text-xs text-muted-foreground line-through'>
                ₹{basePrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Swipe hint - shows on first render */}
      <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-muted'>
        <div className='h-full w-1/3 mx-auto bg-muted-foreground/30 rounded-full' />
      </div>
    </div>
  );
}

/**
 * Desktop Product Card
 *
 * Features:
 * - Hover quick actions
 * - Hover image zoom
 * - Click to navigate
 * - Keyboard accessible
 */
export function DesktopProductCard({
  id,
  name,
  slug,
  basePrice,
  salePrice,
  imageUrl,
  category,
  commission,
  isNew,
  isBestseller,
  inStock = true,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const discount =
    salePrice && basePrice > salePrice
      ? Math.round(((basePrice - salePrice) / basePrice) * 100)
      : 0;

  const displayPrice = salePrice ?? basePrice;

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onAddToCart?.(id);
    },
    [id, onAddToCart]
  );

  const handleAddToWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onAddToWishlist?.(id);
    },
    [id, onAddToWishlist]
  );

  const handleQuickView = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onQuickView?.(id);
    },
    [id, onQuickView]
  );

  return (
    <div
      className='group relative rounded-xl bg-card border border-border overflow-hidden transition-shadow hover:shadow-lg'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/shop/${slug}`} className='block'>
        {/* Image */}
        <div className='relative aspect-square bg-muted overflow-hidden'>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className={cn(
                'object-cover transition-transform duration-300',
                isHovered && 'scale-105'
              )}
              sizes='(max-width: 768px) 50vw, 25vw'
            />
          ) : (
            <div className='absolute inset-0 flex items-center justify-center text-muted-foreground'>
              No Image
            </div>
          )}

          {/* Badges */}
          <div className='absolute top-3 left-3 flex flex-col gap-1.5'>
            {isNew && <Badge className='bg-[#0b6b2e] text-white text-xs px-2 py-1'>NEW</Badge>}
            {isBestseller && (
              <Badge className='bg-amber-500 text-white text-xs px-2 py-1'>BESTSELLER</Badge>
            )}
            {discount > 0 && (
              <Badge className='bg-destructive text-white text-xs px-2 py-1'>-{discount}%</Badge>
            )}
          </div>

          {/* Commission badge */}
          {commission && commission > 0 && (
            <div className='absolute top-3 right-3 bg-[#7be08a] text-[#0b6b2e] text-xs font-bold px-2 py-1 rounded-lg shadow-sm'>
              Earn ₹{commission}
            </div>
          )}

          {/* Hover actions */}
          <div
            className={cn(
              'absolute inset-x-3 bottom-3 flex gap-2 transition-all duration-200',
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            )}
          >
            <button
              type='button'
              onClick={handleAddToCart}
              disabled={!inStock}
              className={cn(
                'flex-1 flex items-center justify-center gap-2',
                'bg-primary text-primary-foreground',
                'py-2.5 rounded-lg font-medium text-sm',
                'transition-colors hover:bg-primary/90',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <ShoppingCart className='w-4 h-4' />
              Add to Cart
            </button>
            <button
              type='button'
              onClick={handleAddToWishlist}
              className='flex items-center justify-center w-10 h-10 bg-card border border-border rounded-lg transition-colors hover:bg-muted'
              aria-label='Add to wishlist'
            >
              <Heart className='w-4 h-4' />
            </button>
            <button
              type='button'
              onClick={handleQuickView}
              className='flex items-center justify-center w-10 h-10 bg-card border border-border rounded-lg transition-colors hover:bg-muted'
              aria-label='Quick view'
            >
              <Eye className='w-4 h-4' />
            </button>
          </div>

          {/* Out of stock overlay */}
          {!inStock && (
            <div className='absolute inset-0 bg-background/80 flex items-center justify-center'>
              <span className='text-sm font-medium text-muted-foreground'>Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className='p-4'>
          {category && (
            <p className='text-xs text-muted-foreground uppercase tracking-wide mb-1'>{category}</p>
          )}
          <h3 className='font-medium text-sm line-clamp-2 mb-2 group-hover:text-[#0b6b2e] transition-colors'>
            {name}
          </h3>
          <div className='flex items-baseline gap-2'>
            <span className='font-bold text-lg'>₹{displayPrice.toLocaleString()}</span>
            {salePrice && basePrice > salePrice && (
              <span className='text-sm text-muted-foreground line-through'>
                ₹{basePrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

/**
 * Adaptive Product Card
 * Automatically renders the appropriate variant based on device
 */
export default function ProductCard(props: ProductCardProps) {
  // Use CSS to show/hide appropriate version
  return (
    <>
      {/* Mobile version - hidden on md+ */}
      <div className='md:hidden'>
        <MobileProductCard {...props} />
      </div>
      {/* Desktop version - hidden on mobile */}
      <div className='hidden md:block'>
        <DesktopProductCard {...props} />
      </div>
    </>
  );
}
