import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

const MainNewButton = () => {
  return (
    <div className='fixed bottom-16 flex w-full max-w-[640px] px-4 pb-4 pt-2'>
      <div className='relative ml-auto mr-7 flex w-full justify-end'>
        <Link
          href={'/create-match'}
          className='flex h-12 w-fit place-items-center justify-center gap-2 rounded-full bg-blue-500 px-3'
        >
          <PlusIcon color='white' size={28} />
          <span className='font-medium text-white'>글쓰기</span>
        </Link>
      </div>
    </div>
  );
};

export default MainNewButton;
