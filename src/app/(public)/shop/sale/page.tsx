import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/shared/lib/prisma';
import { Badge } from '@/shared/components/ui/badge';
import { Percent } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sale | GO Shop',
  description: 'Shop amazing deals and discounts on your favorite products.',
};

async function getSaleProducts() {
  const products = await prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      salePrice: {
        not: null,
      },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      basePrice: true,
      salePrice: true,
      images: {
        select: { path: true },
        take: 1,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  });

  // Filter to only products where basePrice > salePrice (actual sale items)
  return products.filter((p) => p.salePrice && p.basePrice > p.salePrice);
}

function calculateDiscount(salePrice: number, basePrice: number): number {
  return Math.round(((basePrice - salePrice) / basePrice) * 100);
}

export default async function SalePage() {
  const products = await getSaleProducts();

  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Section */}
      <div className='bg-linear-to-r from-red-500/10 to-pink-500/10 py-8 md:py-16'>
        <div className='max-w-7xl mx-auto px-4'>
          <Badge variant='destructive' className='mb-4'>
            <Percent className='w-3 h-3 mr-1' />
            Limited Time
          </Badge>
          <h1 className='text-3xl md:text-5xl font-bold mb-4'>Sale</h1>
          <p className='text-muted-foreground max-w-2xl'>
            Don't miss out on these amazing deals! Limited stock available at discounted prices.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className='max-w-7xl mx-auto px-4 py-8'>
        {products.length > 0 ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
            {products.map((product) => {
              const discount = calculateDiscount(product.salePrice!, product.basePrice);
              return (
                <Link key={product.id} href={`/shop/${product.slug}`} className='group'>
                  <div className='relative aspect-square overflow-hidden rounded-lg bg-muted'>
                    {product.images[0] && (
                      <img
                        src={product.images[0].path}
                        alt={product.title}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                      />
                    )}
                    <Badge variant='destructive' className='absolute top-2 left-2'>
                      {discount}% OFF
                    </Badge>
                  </div>
                  <div className='mt-3'>
                    <h3 className='font-medium line-clamp-2 group-hover:text-primary transition-colors'>
                      {product.title}
                    </h3>
                    <div className='flex items-center gap-2 mt-1'>
                      <span className='font-bold text-red-600'>
                        Rs. {product.salePrice!.toLocaleString()}
                      </span>
                      <span className='text-sm text-muted-foreground line-through'>
                        Rs. {product.basePrice.toLocaleString()}
                      </span>
                    </div>
                    <p className='text-xs text-green-600 font-medium mt-1'>
                      You save Rs. {(product.basePrice - product.salePrice!).toLocaleString()}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className='text-center py-16'>
            <h2 className='text-xl font-semibold mb-2'>No sale items right now</h2>
            <p className='text-muted-foreground mb-6'>Check back soon for amazing deals!</p>
            <Link href='/shop' className='text-primary hover:underline'>
              Browse all products →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
