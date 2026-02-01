import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/shared/lib/prisma';
import { Badge } from '@/shared/components/ui/badge';

export const metadata: Metadata = {
  title: 'New Arrivals | GO Shop',
  description: 'Discover our latest products and newest additions to our collection.',
};

async function getNewProducts() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const products = await prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      createdAt: {
        gte: thirtyDaysAgo,
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

  return products;
}

export default async function NewArrivalsPage() {
  const products = await getNewProducts();

  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Section */}
      <div className='bg-linear-to-r from-primary/10 to-primary/5 py-8 md:py-16'>
        <div className='max-w-7xl mx-auto px-4'>
          <Badge variant='secondary' className='mb-4'>
            New Collection
          </Badge>
          <h1 className='text-3xl md:text-5xl font-bold mb-4'>New Arrivals</h1>
          <p className='text-muted-foreground max-w-2xl'>
            Be the first to discover our latest products. Fresh styles and trending items added
            daily.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className='max-w-7xl mx-auto px-4 py-8'>
        {products.length > 0 ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
            {products.map((product) => (
              <Link key={product.id} href={`/shop/${product.slug}`} className='group'>
                <div className='relative aspect-square overflow-hidden rounded-lg bg-muted'>
                  {product.images[0] && (
                    <img
                      src={product.images[0].path}
                      alt={product.title}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                  )}
                  <Badge className='absolute top-2 left-2 bg-green-500'>New</Badge>
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
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className='text-center py-16'>
            <h2 className='text-xl font-semibold mb-2'>No new arrivals yet</h2>
            <p className='text-muted-foreground mb-6'>Check back soon for fresh products!</p>
            <Link href='/shop' className='text-primary hover:underline'>
              Browse all products →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
