'use client';

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { ChevronLeft } from '@/components/common/icons';

const Header = ({
  children,
  title,
  backbtn = false,
  transparent = false,
}: {
  children?: ReactNode;
  title?: string;
  backbtn?: boolean | 'home';
  transparent?: boolean;
}) => {
  const router = useRouter();

  return (
    <div
      className={`fixed left-1/2 top-0 z-50 flex h-14 w-full max-w-[640px] -translate-x-1/2 items-center justify-between bg-white px-4 ${transparent ? 'bg-transparent  text-white' : ''}`}
    >
      {backbtn && (
        <button
        className='text-icon-strong'
          onClick={() => {
            if (backbtn === 'home') {
              router.replace(PATHS.HOME);
            } else {
              router.back();
            }
          }}
        >
          <ChevronLeft />
        </button>
      )}
      <div className='text-title-03  font-semibold'>{title}</div>
      <div className='w-6'>{children}</div>
    </div>
  );
};

export default Header;
