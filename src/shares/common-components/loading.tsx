'use client';

import { useEffect } from 'react';

export default function Loading() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.2)]'>
      <div className='h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-500'></div>
    </div>
  );
}
