'use client';

import { Search, X, SlidersHorizontal, Grid3x3, LayoutList } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';
import { Skeleton } from '@/shared/components/ui/skeleton';

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: { path: string }[];
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/products/search?q=${encodeURIComponent(searchQuery)}&sort=${sortBy}`
      );
      const data = await res.json();
      setResults(data.products ?? []);

      // Save to recent searches
      const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      performSearch(query);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    router.push('/search');
  };

  const removeRecentSearch = (search: string) => {
    const updated = recentSearches.filter((s) => s !== search);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Search Header - Fixed on Mobile */}
      <div className='sticky top-0 z-10 bg-background border-b p-4'>
        <form onSubmit={handleSearch} className='flex gap-2'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search products...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className='pl-10 pr-10 h-12 text-base'
              autoFocus
            />
            {query && (
              <button
                type='button'
                onClick={clearSearch}
                className='absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full'
              >
                <X className='h-4 w-4' />
              </button>
            )}
          </div>
          <Button type='submit' size='lg' className='h-12 px-6'>
            Search
          </Button>
        </form>
      </div>

      <div className='max-w-7xl mx-auto p-4'>
        {/* Results Header */}
        {results.length > 0 && (
          <div className='flex flex-wrap items-center justify-between gap-4 mb-6'>
            <p className='text-sm text-muted-foreground'>
              Found <span className='font-semibold text-foreground'>{results.length}</span> results
              for "{initialQuery}"
            </p>

            <div className='flex items-center gap-2'>
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className='w-[140px] h-9'>
                  <SelectValue placeholder='Sort by' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='relevance'>Relevance</SelectItem>
                  <SelectItem value='price-asc'>Price: Low to High</SelectItem>
                  <SelectItem value='price-desc'>Price: High to Low</SelectItem>
                  <SelectItem value='newest'>Newest</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className='flex border rounded-lg overflow-hidden'>
                <button
                  type='button'
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
                >
                  <Grid3x3 className='h-4 w-4' />
                </button>
                <button
                  type='button'
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
                >
                  <LayoutList className='h-4 w-4' />
                </button>
              </div>

              {/* Filters - Mobile Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant='outline' size='sm' className='md:hidden'>
                    <SlidersHorizontal className='h-4 w-4' />
                  </Button>
                </SheetTrigger>
                <SheetContent side='bottom' className='h-[80vh]'>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className='py-4'>
                    {/* Add filter options here */}
                    <p className='text-muted-foreground text-sm'>Filters coming soon...</p>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div
            className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className='space-y-2'>
                <Skeleton className='aspect-square rounded-lg' />
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
              </div>
            ))}
          </div>
        )}

        {/* Results Grid */}
        {!loading && results.length > 0 && (
          <div
            className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}
          >
            {results.map((product) => (
              <a
                key={product.id}
                href={`/shop/${product.slug}`}
                className={`group ${viewMode === 'list' ? 'flex gap-4 p-4 border rounded-lg' : ''}`}
              >
                <div
                  className={`relative overflow-hidden rounded-lg bg-muted ${viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'aspect-square'}`}
                >
                  {product.images[0] && (
                    <img
                      src={product.images[0].path}
                      alt={product.title}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                  )}
                  {product.compareAtPrice && (
                    <span className='absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded'>
                      Sale
                    </span>
                  )}
                </div>
                <div className={`${viewMode === 'list' ? 'flex-1' : 'mt-2'}`}>
                  <h3 className='font-medium line-clamp-2 group-hover:text-primary transition-colors'>
                    {product.title}
                  </h3>
                  <div className='flex items-center gap-2 mt-1'>
                    <span className='font-bold'>Rs. {product.price.toLocaleString()}</span>
                    {product.compareAtPrice && (
                      <span className='text-sm text-muted-foreground line-through'>
                        Rs. {product.compareAtPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Empty State / Recent Searches */}
        {!loading && results.length === 0 && (
          <div className='py-12'>
            {initialQuery ? (
              <div className='text-center'>
                <Search className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
                <h2 className='text-lg font-semibold mb-2'>No results found</h2>
                <p className='text-muted-foreground mb-6'>
                  We couldn't find anything for "{initialQuery}". Try different keywords.
                </p>
              </div>
            ) : (
              <div>
                {recentSearches.length > 0 && (
                  <div className='mb-8'>
                    <h2 className='text-lg font-semibold mb-4'>Recent Searches</h2>
                    <div className='flex flex-wrap gap-2'>
                      {recentSearches.map((search) => (
                        <div
                          key={search}
                          className='flex items-center gap-1 bg-muted rounded-full px-3 py-1.5'
                        >
                          <button
                            type='button'
                            onClick={() => {
                              setQuery(search);
                              router.push(`/search?q=${encodeURIComponent(search)}`);
                            }}
                            className='text-sm hover:text-primary'
                          >
                            {search}
                          </button>
                          <button
                            type='button'
                            onClick={() => removeRecentSearch(search)}
                            className='p-0.5 hover:bg-background rounded-full'
                          >
                            <X className='h-3 w-3' />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h2 className='text-lg font-semibold mb-4'>Popular Categories</h2>
                  <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                    {['Electronics', 'Fashion', 'Home & Garden', 'Sports'].map((cat) => (
                      <a
                        key={cat}
                        href={`/category/${cat.toLowerCase().replace(/ & /g, '-')}`}
                        className='p-4 border rounded-lg text-center hover:border-primary transition-colors'
                      >
                        {cat}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary' />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
