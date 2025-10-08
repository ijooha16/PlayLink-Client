'use client';

import Loading from '@/components/ui/loading';
import { LOGIN_DEVICE_IDS, PATHS } from '@/constant';
import { TOAST_ALERT_MESSAGES } from '@/constant/toast-alert';
import { Auth } from '@/libs/api/frontend/auth/auth';
import { findAccountByPhoneEmail } from '@/libs/api/frontend/auth/find-account';
import { apiClient } from '@/libs/http';
import { generatePasswordFromDeviceId } from '@/libs/valid/auth';
import { useAlertStore } from '@/store/alert-store';
import useSignUpStore from '@/store/use-sign-up-store';
import { getDeviceInfo } from '@/utills/get-device-info';
import { toast } from '@/utills/toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function KakaoCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const openAlert = useAlertStore((state) => state.openAlert);
  const updateProfile = useSignUpStore((state) => state.updateProfile);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleKakaoCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      const state = searchParams.get('state');

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
        // 1. 백엔드에서 카카오 사용자 정보 가져오기
        const kakaoResponse = await apiClient.post('/api/auth/kakao/callback', {
          code,
          state,
        });

        if (!kakaoResponse.data.success) {
          throw new Error(
            kakaoResponse.data.error || '카카오 정보 가져오기 실패'
          );
        }

        const { email, name, profileImage } = kakaoResponse.data.data;
        const phoneNumber = '01039481599'; // 하드코딩된 전화번호

        // 2. 디바이스 정보 가져오기
        const deviceInfo = await getDeviceInfo();
        const kakaoPassword = generatePasswordFromDeviceId(deviceInfo.deviceId);

        // 3. 전화번호와 이메일로 계정 존재 여부 확인
        const findAccountResponse = await findAccountByPhoneEmail({
          phoneNumber,
          email,
          account_type: '1',
        });

        const errCode = findAccountResponse.errCode;

        // 4-1. 계정이 존재하는 경우 (errCode: 0) - 로그인만 시도
        if (errCode === 0) {
          const loginResult = await Auth.SignIn({
            email,
            password: kakaoPassword,
            device_id: LOGIN_DEVICE_IDS.SOCIAL,
          });

          toast.success(TOAST_ALERT_MESSAGES.KAKAO_LOGIN_SUCCESS);
          router.replace(PATHS.HOME);
          return;
        }

        // 4-2. 계정이 없는 경우 (errCode: 4006 또는 6001) - 회원가입 후 로그인
        if (errCode === 4006 || errCode === 6001) {
          // 회원가입
          const signupResult = await Auth.SignUp({
            name,
            email,
            password: kakaoPassword,
            passwordCheck: kakaoPassword,
            phoneNumber,
            platform: deviceInfo.platform,
            device_id: deviceInfo.deviceId,
            device_type: deviceInfo.deviceType,
            account_type: '1', // 1: 카카오
          });

          // 카카오 프로필 이미지가 있으면 store에 저장
          if (profileImage) {
            updateProfile('img', profileImage);
          }

          // 자동 로그인
          const loginResult = await Auth.SignIn({
            email,
            password: kakaoPassword,
            device_id: LOGIN_DEVICE_IDS.SOCIAL,
          });

          toast.success(TOAST_ALERT_MESSAGES.KAKAO_LOGIN_SUCCESS);
          router.replace(PATHS.AUTH.WELCOME);
          return;
        }

        // 4-3. 기타 에러 코드 처리
        console.error('=== findAccount 에러 ===');
        console.error('에러 코드:', errCode);
        throw new Error('계정 확인 중 오류가 발생했습니다.');
      } catch (err: unknown) {
        console.error('카카오 로그인 처리 에러:', err);
        const error = err as {
          response?: { data?: { error?: string } };
          message?: string;
        };
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
  }, [searchParams, router, openAlert, updateProfile]);

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
