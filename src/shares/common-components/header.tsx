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
      className={`fixed left-1/2 top-0 z-50 flex h-16 w-full max-w-[640px] -translate-x-1/2 items-center justify-between bg-white px-4 ${transparent ? 'bg-transparent text-white' : 'shadow-[0px_2px_8px_0px_rgba(0,_0,_0,_0.2)]'}`}
    >
      <div className='flex items-center gap-3'>
        {backbtn && (
          <button
            onClick={() => {
              if (backbtn === 'home') {
                router.push('/');
              } else {
                router.back();
              }
            }}
          >
            <ChevronLeft />
          </button>
        )}
        <div className='text-lg font-semibold'>{title}</div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Header;
