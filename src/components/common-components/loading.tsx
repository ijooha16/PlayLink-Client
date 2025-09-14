'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

type LoadingType = {
  variant: 'dim' | 'white';
};

export default function Loading({ variant = 'dim' }: LoadingType) {
  useEffect(() => {
    // document.body.style.overflow = 'hidden';
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
      <motion.div
        className='h-12 w-12 rounded-full border-4 border-gray-200'
        style={{
          borderTopColor: 'var(--color-primary)',
          borderRightColor: 'var(--color-primary)',
          borderBottomColor: 'transparent',
          borderLeftColor: 'transparent',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
}
