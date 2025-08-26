import { ChevronLeft } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import NotificationCard from './notification-card';
import { useGetNotificationQuery } from '@/hooks/notification/use-get-notification-query';
import { handleGetSeesionStorage } from '@/shares/libs/utills/web-api';
import {
  requestPermissionAndGetToken,
  onForegroundMessage,
} from '@/shares/libs/firebase/firebase-messaging';

const NotificationView = ({
  setNotificationViewOpen,
}: {
  setNotificationViewOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [tab, setTab] = useState<'activity' | 'matching'>('activity');
  const tabs = ['activity', 'matching'] as const;
  // const token = handleGetSeesionStorage();
  // const { data } = useGetNotificationQuery(token);

  useEffect(() => {
    // 포그라운드 알림 수신
    onForegroundMessage((payload) => {
      alert(`새 알림: ${payload.notification?.title}`);
    });
    const handleRequestToken = async () => {
      const token = await requestPermissionAndGetToken();
      if (token) {
        console.log('사용자 토큰:', token);
      }
    };

    handleRequestToken();
  }, []);

  return (
    <div className='fixed left-0 top-0 z-50 h-screen w-full bg-white'>
      <div
        className={`fixed left-0 top-0 z-50 flex h-16 w-full max-w-[640px] items-center gap-6 border-b border-gray-200 bg-white px-4`}
      >
        <ChevronLeft onClick={() => setNotificationViewOpen(false)} />
        <div className='text-lg font-semibold'>알림</div>
      </div>

      <div className='mt-16 flex flex-col gap-4'>
        <div className='flex'>
          {tabs.map((t) => (
            <div
              key={t}
              className={`flex-1 border-b-[2px] py-3 text-center font-semibold ${tab === t ? 'border-primary text-primary' : 'text-gray-400'}`}
              onClick={() => setTab(t)}
            >
              {t === 'activity' ? '활동' : '매칭'}
            </div>
          ))}
        </div>
        <div className='px-4'>
          <NotificationCard setNotificationViewOpen={setNotificationViewOpen} />
        </div>
      </div>
    </div>
  );
};

export default NotificationView;
