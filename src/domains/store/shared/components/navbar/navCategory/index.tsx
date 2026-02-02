'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { getAllCategoriesFlat } from '@/actions/category/category';
import { ListIcon } from '@/shared/components/icons/svgIcons';
import Button from '@/shared/components/ui-v2/button';
import { useToggleMenu } from '@/shared/hooks/useToggleMenu';
import { cn } from '@/shared/utils/styling';

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
};

type TProps = {
  isNavbarVisible: boolean;
};

const NavBarCategory = ({ isNavbarVisible: isNavbarHide }: TProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useToggleMenu(false, dropdownRef);
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  const toggleMenu = (event?: React.MouseEvent<HTMLButtonElement>) => {
    event?.stopPropagation();
    setIsActive(!isActive);
  };

  useEffect(() => {
    const getCategoriesDB = async () => {
      const result = await getAllCategoriesFlat();
      if (result.res) {
        setCategories(result.res.map((c) => ({ id: c.id, name: c.name, slug: c.slug })));
      }
    };
    getCategoriesDB();
  }, []);

  if (!isNavbarHide && isActive) setIsActive(false);

  return (
    <div className='relative flex items-center select-none'>
      <Button
        onClick={toggleMenu}
        className={cn(
          'w-auto px-4 py-2 border rounded-md transition-all duration-300',
          isActive
            ? 'border-gray-200 bg-gray-100'
            : 'border-white bg-white hover:border-gray-200 hover:bg-gray-100 active:border-gray-300 active:bg-gray-200'
        )}
      >
        <ListIcon width={12} className='fill-gray-600' />
        <span className='text-sm'>All Categories</span>
      </Button>
      <div
        ref={dropdownRef}
        className={cn(
          'absolute left-0 top-10 w-64 rounded-lg border border-gray-300 bg-white/90 backdrop-blur-md shadow-lg overflow-hidden transition-all duration-300 transform',
          isActive ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
        )}
      >
        {categories.map((item) => (
          <Link
            key={item.id}
            href={`/list/${item.slug}`}
            className='block px-4 py-3 text-gray-600 text-sm transition-all duration-300 hover:pl-5 hover:bg-gray-100'
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavBarCategory;
