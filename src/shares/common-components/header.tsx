import { ChevronLeft } from 'lucide-react';
import React, { ReactNode } from 'react';

const Header = ({
  children,
  title,
  backbtn = false,
}: {
  children?: ReactNode;
  title?: string;
  backbtn?: boolean;
}) => {
  return (
    <div className='fixed left-0 top-0 z-50 flex h-16 w-full max-w-[640px] items-center justify-between bg-white px-4 shadow-[0px_2px_8px_0px_rgba(0,_0,_0,_0.2)]'>
      <div className='flex items-center gap-3'>
        {backbtn && <ChevronLeft />}
        <div className='text-lg font-semibold'>{title}</div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Header;
