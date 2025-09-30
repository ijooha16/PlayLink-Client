'use client';

import MatchCards from '@/components/features/match/match-cards';
import MainHeader from '@/components/features/navigation/main-header';
import MainNewButton from '@/components/features/navigation/main-new-button';
import { PATHS } from '@/constant';
import { useGetMatchesQuery } from '@/hooks/react-query/match/use-get-matches-query';
// import { useGetNotificationQuery } from '@/hooks/notification/use-get-notification-query';
import { sendNotificationToken } from '@/libs/api/notification/send-notification-token';
import {
  onForegroundMessage,
  requestPermissionAndGetToken,
} from '@/libs/firebase/firebase-messaging';
import { useAuthStore } from '@/store/auth-store';
import { useSearchStore } from '@/store/search-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data } = useGetMatchesQuery();
  const { keyword, type } = useSearchStore();
  const router = useRouter();
  // const {data: notificationData} = useGetNotificationQuery(token);
  const token = useAuthStore((state) => state.token);

  //검색 페이지 이동
  useEffect(() => {
    if (keyword || type)
      router.replace(`${PATHS.QUERY}?keyword=${keyword}&type=${type}`);
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
    if (token) {
      handleRequestToken();
    }
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
