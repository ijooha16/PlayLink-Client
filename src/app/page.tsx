'use client';

import MainHeader from '@/features/play-link/view/main/main-header';
import MainNewButton from '@/features/play-link/view/main/main-new-button';
import MatchCards from '@/features/play-link/view/main/match-cards';
import { useGetMatchesQuery } from '@/hooks/match/use-get-matches-query';
import { useGetNotificationQuery } from '@/hooks/notification/use-get-notification-query';
import { sendNotificationToken } from '@/services/notification/send-notification-token';
import {
  onForegroundMessage,
  requestPermissionAndGetToken,
} from '@/shares/libs/firebase/firebase-messaging';
import { handleGetSeesionStorage } from '@/shares/libs/utills/web-api';
import { useSearchStore } from '@/shares/stores/search-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data } = useGetMatchesQuery();
  const { keyword, type } = useSearchStore();
  const router = useRouter();
  const token = handleGetSeesionStorage();
  const {data: notificationData} = useGetNotificationQuery(token);

  console.log('notificationData', notificationData);

  //검색 페이지 이동
  useEffect(() => {
    if (keyword || type) router.push(`/query?keyword=${keyword}&type=${type}`);
  }, [keyword, type, router]);

  //알림 수신
  useEffect(() => {
    onForegroundMessage((payload) => {
      alert(`새 알림: ${payload.notification?.title}`);
    });
    const handleRequestToken = async () => {
      const fcmToken = await requestPermissionAndGetToken();
      if (fcmToken) {
        sendNotificationToken({ token, fcmToken });
      }
    };
    handleRequestToken();
  }, []);

  return (
    <div>
      <MainHeader />
      <div className='overflow-auto'>
        {data && data.data.map((d) => <MatchCards key={d.matchId} data={d} />)}
      </div>
      <MainNewButton />
    </div>
  );
}
