import { ChevronLeft } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import NotificationCard from './notification-card';

const NotificationView = ({
  setNotificationViewOpen,
}: {
  setNotificationViewOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [tab, setTab] = useState<'activity' | 'matching'>('activity');
  const tabs = ['activity', 'matching'] as const;

  return (
    <div className='fixed top-0 z-50 h-screen w-full bg-white px-4'>
      <div className='h-17 flex max-w-[640px] items-center justify-start gap-6 py-6'>
        <ChevronLeft onClick={() => setNotificationViewOpen(false)} />
        알림
      </div>
      <hr className='h-[1px] bg-gray-400' />
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
      <div>
        <NotificationCard />
        <NotificationCard />
        <NotificationCard />
        <NotificationCard />
      </div>
    </div>
  );
};

export default NotificationView;
