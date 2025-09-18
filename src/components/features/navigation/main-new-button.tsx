'use client';

import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PATHS } from '@/constant/paths';

const MainNewButton = () => {
  const router = useRouter();

  const handleCreateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // 미들웨어가 인증을 처리하므로 바로 이동
    router.push(PATHS.MATCH.CREATE_MATCH);
  };

  return (
    <div className='fixed bottom-16 flex w-full max-w-[640px] px-4 pb-4 pt-2'>
      <div className='relative ml-auto mr-7 flex w-full justify-end'>
        <button
          onClick={handleCreateClick}
          className='flex h-12 w-fit place-items-center justify-center gap-2 rounded-full bg-blue-500 px-3'
        >
          <PlusIcon color='white' size={28} />
          <span className='font-medium text-white'>글쓰기</span>
        </button>
      </div>
    </div>
  );
};

export default MainNewButton;
