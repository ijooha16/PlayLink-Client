'use client';

import MainHeader from '@/components/view/main/main-header';
import MainNewButton from '@/components/view/main/main-new-button';
import MatchCards from '@/components/view/main/match-cards';
import { useGetMatchesQuery } from '@/hooks/react-query/match/use-get-matches-query';
// import { useGetNotificationQuery } from '@/hooks/notification/use-get-notification-query';
import { sendNotificationToken } from '@/services/notification/send-notification-token';
import {
  onForegroundMessage,
  requestPermissionAndGetToken,
} from '@/libs/firebase/firebase-messaging';
import { handleGetSessionStorage } from '@/utills/web-api';
import { useSearchStore } from '@/stores/search-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data } = useGetMatchesQuery();
  const { keyword, type } = useSearchStore();
  const router = useRouter();
  const token = handleGetSessionStorage();
  // const {data: notificationData} = useGetNotificationQuery(token);

  //검색 페이지 이동
  useEffect(() => {
    if (keyword || type) router.replace(`/query?keyword=${keyword}&type=${type}`);
  }, [keyword, type, router]);

  //알림 수신
  useEffect(() => {
    onForegroundMessage((payload) => {
      alert(
        `새 알림: ${(payload.notification as Record<string, unknown>)?.title}`
      );
    });
    const handleRequestToken = async () => {
      const fcmToken = await requestPermissionAndGetToken();
      if (fcmToken) {
        sendNotificationToken(fcmToken);
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
