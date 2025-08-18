'use client';

import Header from '@/shares/common-components/header';
import { ChevronRight, Edit3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import {
  handleRemoveSessionStorage,
  handleGetSeesionStorage,
} from '@/shares/libs/utills/web-api';

export default function MyPage() {
  const router = useRouter();
  const handleLogout = () => {
    const data = handleRemoveSessionStorage('PLAYLINK_AUTH');

    if (data.status === 'success') {
      router.push('/sign-in');
    }
  };

  useEffect(() => {
    const token = handleGetSeesionStorage();
    if (!token) {
      router.push('/sign-in');
    }
  }, []);
  return (
    <>
      <Header title='마이페이지' />
      <div className='mt-10 flex flex-col items-center space-y-3'>
        <div className='h-24 w-24 rounded-full bg-gray-200' />
        <div className='flex items-center gap-2 text-lg font-bold'>
          nickname <Edit3 size={18} />
        </div>
      </div>
      <hr className='mb-4 mt-14' />
      <div
        className='flex cursor-pointer justify-between py-4 font-bold'
        onClick={handleLogout}
      >
        로그아웃 <ChevronRight />
      </div>
      {/* <div className='text-sm mt-20 text-center underline text-gray-500 underline-offset-4'>로그아웃</div> */}
    </>
  );
}
