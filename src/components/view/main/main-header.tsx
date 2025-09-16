'use client';

import DropDown from '@/components/common/drop-down';
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
  // const { data: notificationData } = useGetNotificationQuery(token);
  // const unread = notificationData?.data.data.notificationList.some(
  //   (message: MessageType) => !message.is_read
  // );
  //읽지 않은 메시지 확인용

  return (
    <>
      <div className='fixed left-1/2 top-0 z-50 flex w-full max-w-[640px] -translate-x-1/2 justify-between bg-white px-4 pt-4 shadow-[0px_2px_8px_0px_rgba(0,_0,_0,_0.2)]'>
        <DropDown options={options} onSelect={click} />
        <div className='flex place-items-center gap-4'>
          <button onClick={() => setSearchViewOpen(true)}>
            <SearchIcon size={24} />
          </button>
          <button
            onClick={() => setNotificationViewOpen(true)}
            className='relative'
          >
            <BellIcon size={24} />
            {/* {unread && (
              <div className='absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-red-500' />
            )} */}
            {/* 읽지 않은 메시지 있을 경우 */}
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

type MessageType = {
  is_read: boolean;
  body: string;
  created_at: string;
  match_id: number;
  target_id: number;
  title: string;
  type: string;
  user_id: number;
  user_notifications_id: number;
};
