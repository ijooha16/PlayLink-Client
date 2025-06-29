'use client';

import DropDown from '@/shares/common-components/drop-down';
import { BellIcon, Search } from 'lucide-react';

const options = ['강남구', '추가 설정'];

const click = (option: string) => {
  console.log(option);
};

const MainHeader = () => {
  return (
    <div className='fixed top-0 z-50 flex w-full max-w-[640px] justify-between bg-white px-4 pt-4 shadow-[0px_2px_8px_0px_rgba(0,_0,_0,_0.2)]'>
      <DropDown options={options} onSelect={click} />
      <div className='flex place-items-center gap-4'>
        <button
          onClick={() => {
            console.log('검색');
          }}
        >
          <Search size={24} />
        </button>
        <button
          onClick={() => {
            console.log('알림');
          }}
        >
          <BellIcon size={24} />
        </button>
      </div>
    </div>
  );
};

export default MainHeader;
