'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

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
      className={`fixed left-1/2 top-0 z-50 flex h-12 w-full max-w-[640px] -translate-x-1/2 items-center justify-between bg-white px-4 ${transparent ? 'bg-transparent text-white' : ''}`}
    >
      {backbtn && (
        <button
          onClick={() => {
            if (backbtn === 'home') {
              router.replace('/');
            } else {
              router.back();
            }
          }}
        >
          <ChevronLeft size={24} />
        </button>
      )}
      <div className='text-title-4'>{title}</div>
      <div className='w-6'>{children || ''}</div>
    </div>
  );
};

export default Header;
