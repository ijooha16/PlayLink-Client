'use client';

import DropDown from '@/shares/common-components/drop-down';
import { BellIcon, SearchIcon } from 'lucide-react';
import { useState } from 'react';
import SearchView from './search-view';
import NotificationView from './notification-view';

const options = ['강남구', '추가 설정'];

const click = (option: string) => {
  console.log(option);
};

const MainHeader = () => {
  const [searchViewOpen, setSearchViewOpen] = useState(false);
  const [notificationViewOpen, setNotificationViewOpen] = useState(false);

  return (
    <>
      <div className='fixed top-0 left-0 z-50 flex w-full max-w-[640px] justify-between bg-white px-4 pt-4 shadow-[0px_2px_8px_0px_rgba(0,_0,_0,_0.2)]'>
        <DropDown options={options} onSelect={click} />
        <div className='flex place-items-center gap-4'>
          <button onClick={() => setSearchViewOpen(true)}>
            <SearchIcon size={24} />
          </button>
          <button onClick={() => setNotificationViewOpen(true)}>
            <BellIcon size={24} />
          </button>
        </div>
      </div>
      {searchViewOpen && <SearchView setSearchViewOpen={setSearchViewOpen} />}
      {notificationViewOpen && (
        <NotificationView setNotificationViewOpen={setNotificationViewOpen} />
      )}
    </>
  );
};

export default MainHeader;
