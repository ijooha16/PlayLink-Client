'use client';

import DropDown from '@/components/ui/drop-down';
import { BellIcon, SearchIcon } from 'lucide-react';
import { useState } from 'react';
import SearchView from '../../shared/search-view';
import NotificationView from '../notification/notification-view';
import Header from '@/components/layout/header';

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
      <Header
        left={<DropDown options={options} onSelect={click} />}
        right={
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
        }
      />
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
