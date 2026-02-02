'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { addVisit } from '@/actions/pageVisit/pageVisitServices';

const AddVisit = () => {
  const pathName = usePathname();
  useEffect(() => {
    const addingVisit = async () => {
      await addVisit(pathName);
    };
    addingVisit();
  }, [pathName]);
  return <></>;
};

export default AddVisit;
