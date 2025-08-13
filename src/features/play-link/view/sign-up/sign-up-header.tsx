'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SignUpHeader = () => {
  const router = useRouter();
  return (
    <div className='relative flex h-12 w-full items-center justify-center shadow-[0px_2px_8px_0px_rgba(0,_0,_0,_0.2)]'>
      <button
        onClick={() => {
          router.back();
        }}
        className='absolute left-4 h-12'
      >
        <ChevronLeft size={24} />
      </button>
      <h1 className='text-xl font-semibold'>회원가입</h1>
    </div>
  );
};

export default SignUpHeader;
