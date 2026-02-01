import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/shared/lib/prisma';
import { Badge } from '@/shared/components/ui/badge';
import { Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Best Sellers | GO Shop',
  description: 'Shop our most popular and top-rated products loved by our customers.',
};

async function getBestSellerProducts() {
  // Get products with most orders
  const products = await prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
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
      _count: {
        select: { orderItems: true },
      },
    },
    orderBy: {
      orderItems: {
        _count: 'desc',
      },
    },
    take: 50,
  });

  return products;
}

export default async function BestSellersPage() {
  const products = await getBestSellerProducts();

  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Section */}
      <div className='bg-linear-to-r from-yellow-500/10 to-orange-500/10 py-8 md:py-16'>
        <div className='max-w-7xl mx-auto px-4'>
          <Badge variant='secondary' className='mb-4 bg-yellow-100 text-yellow-800'>
            <Star className='w-3 h-3 mr-1 fill-yellow-500' />
            Top Rated
          </Badge>
          <h1 className='text-3xl md:text-5xl font-bold mb-4'>Best Sellers</h1>
          <p className='text-muted-foreground max-w-2xl'>
            Our most popular products that customers love. Quality guaranteed and customer approved.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className='max-w-7xl mx-auto px-4 py-8'>
        {products.length > 0 ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
            {products.map((product, index) => (
              <Link key={product.id} href={`/shop/${product.slug}`} className='group'>
                <div className='relative aspect-square overflow-hidden rounded-lg bg-muted'>
                  {product.images[0] && (
                    <img
                      src={product.images[0].path}
                      alt={product.title}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                  )}
                  {index < 3 && (
                    <Badge className='absolute top-2 left-2 bg-yellow-500'>
                      #{index + 1} Best Seller
                    </Badge>
                  )}
                </div>
                <div className='mt-3'>
                  <h3 className='font-medium line-clamp-2 group-hover:text-primary transition-colors'>
                    {product.title}
                  </h3>
                  <div className='flex items-center gap-2 mt-1'>
                    <span className='font-bold'>
                      Rs. {(product.salePrice ?? product.basePrice).toLocaleString()}
                    </span>
                    {product.salePrice && product.salePrice < product.basePrice && (
                      <span className='text-sm text-muted-foreground line-through'>
                        Rs. {product.basePrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {product._count.orderItems} sold
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className='text-center py-16'>
            <h2 className='text-xl font-semibold mb-2'>No best sellers yet</h2>
            <p className='text-muted-foreground mb-6'>
              Products will appear here as they get sold!
            </p>
            <Link href='/shop' className='text-primary hover:underline'>
              Browse all products →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
