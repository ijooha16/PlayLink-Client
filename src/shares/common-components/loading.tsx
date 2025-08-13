'use client';

import { useEffect } from 'react';

type LoadingType = {
  variant: 'dim' | 'white';
};

export default function Loading({ variant = 'dim' }: LoadingType) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const backgroundColor =
    variant === 'dim' ? 'bg-[rgba(0,0,0,0.6)]' : 'bg-white';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${backgroundColor}`}
    >
      <div className='h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-500'></div>
    </div>
  );
}
