// /firebase/firebaseMessaging.ts
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { firebaseApp } from './firebase-config';

let messaging: ReturnType<typeof getMessaging> | null = null;

// 브라우저 환경에서만 초기화 (Next.js SSR 방지)
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  messaging = getMessaging(firebaseApp);
}

/**
 * FCM 토큰 요청 (Notification 권한 포함)
 */
export async function requestPermissionAndGetToken(): Promise<string | null> {
  if (!messaging) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('알림 권한이 거부됨');
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FB_VAPID_KEY, // FCM 콘솔에서 발급
    });

    console.log('FCM Token:', token);
    return token;
  } catch (err) {
    console.error('토큰 요청 실패:', err);
    return null;
  }
}

/**
 * 포그라운드 메시지 수신 리스너
 */
export function onForegroundMessage(callback: (payload: any) => void) {
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log('📩 Foreground message received:', payload);
    callback(payload);
  });
}
