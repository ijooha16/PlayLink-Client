'use client';

import Loading from '@/components/ui/loading';
import { PATHS } from '@/constant';
import { useAlertStore } from '@/store/alert-store';
import { toast } from '@/utills/toast';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { TOAST_ALERT_MESSAGES } from '@/constant/toast-alert';

function KakaoCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const openAlert = useAlertStore((state) => state.openAlert);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleKakaoCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      const state = searchParams.get('state');

      console.log('=== 프론트엔드 카카오 콜백 처리 ===');
      console.log('받은 code:', code);
      console.log('받은 error:', error);
      console.log('받은 errorDescription:', errorDescription);
      console.log('받은 state:', state);
      console.log('전체 searchParams:', searchParams.toString());

      if (error && !code) {
        console.error('카카오 인증 실패:', error, errorDescription);
        openAlert(
          '카카오 인증 실패',
          errorDescription || error || '알 수 없는 오류가 발생했습니다.'
        );
        router.replace(PATHS.SPLASH);
        return;
      }

      if (!code) {
        console.error('인가 코드 없음');
        openAlert('인증 실패', '인가 코드를 받지 못했습니다.');
        router.replace(PATHS.SPLASH);
        return;
      }

      try {
        console.log('백엔드 API 호출:', '/api/auth/kakao/callback');
        const response = await axios.post('/api/auth/kakao/callback', {
          code,
          state,
        });

        console.log('백엔드 API 응답:', response.data);

        if (response.data.success) {
          if (response.data.token) {
            localStorage.setItem('accessToken', response.data.token);
          }

          toast.success(TOAST_ALERT_MESSAGES.KAKAO_LOGIN_SUCCESS);
          router.replace(PATHS.HOME);
        } else {
          throw new Error(response.data.error || '로그인 처리 실패');
        }
      } catch (error: any) {
        console.error('카카오 로그인 처리 에러:', error);
        openAlert(
          '로그인 실패',
          error.response?.data?.error ||
            error.message ||
            '로그인 처리 중 오류가 발생했습니다.'
        );
        router.replace(PATHS.SPLASH);
      } finally {
        setIsProcessing(false);
      }
    };

    handleKakaoCallback();
  }, [searchParams, router, openAlert]);

  if (isProcessing) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <Loading variant='white' />
        <div className='mt-4 text-center'>
          <p className='text-lg font-medium'>카카오 로그인 처리 중...</p>
          <p className='text-sm text-gray-500'>잠시만 기다려 주세요.</p>
        </div>
      </div>
    );
  }

  return null;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KakaoCallbackPage />
    </Suspense>
  );
}
