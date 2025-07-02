'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

type CommonHeaderProps = {
  title: string;
};

/**
 * @title 헤더에 표시 될 제목
 * @returns 뒤로가기 기능이 포함된 기본적인 헤더 컴포넌트
 */
const CommonHeader = ({ title }: CommonHeaderProps) => {
  const router = useRouter();
  return (
    <>
      <div className='fixed top-0 z-50 flex h-16 w-full max-w-[640px] items-center justify-start gap-4 bg-white px-4 shadow-[0px_2px_8px_0px_rgba(0,_0,_0,_0.2)]'>
        <button
          onClick={() => {
            router.back();
          }}
          className='h-12'
        >
          <ChevronLeft size={28} />
        </button>
        <h1 className='text-xl font-semibold'>{title}</h1>
      </div>
      <div className='h-16' />
    </>
  );
};

export default CommonHeader;
