'use client';

import { useRouter } from 'next/navigation';
import { useSignUpStepStore } from '@/store/sign-up-store';
import { useEffect, useState } from 'react';
import useSignup from '@/hooks/common/use-signup';
import { getDeviceInfo } from '@/utills/get-device-info';
import Button from '@/components/ui/button';
import { PATHS } from '@/constant/paths';

const SignUpComplete = () => {
  const router = useRouter();
  const { data, clearStep, validateStep, isStepCompleted } =
    useSignUpStepStore();
  const { signup, isLoading } = useSignup();
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleComplete = async () => {
    if (isSigningUp) return;

    setIsSigningUp(true);

    try {
      // 디바이스 정보 가져오기
      const infos = await getDeviceInfo();

      // 프로필 이미지 파일 처리
      const imgFile = data.profileImage || new File([], 'empty');

      // 회원가입 데이터 구성
      const signupData = {
        name: data.nickname || '',
        nickname: data.nickname || '',
        email: data.email || '',
        password: data.password || '',
        passwordCheck: data.confirmPassword || '',
        phoneNumber: data.phone || '',
        platform: infos.platform,
        device_id: infos.deviceId,
        device_type: infos.deviceType,
        account_type: '0',
        favor: '0',
        img: imgFile,
      };

      console.log('회원가입 데이터:', signupData);

      // 회원가입 API 호출
      await signup(signupData);

      // 성공 시 데이터 초기화
      clearStep();
    } catch (error) {
      console.error('회원가입 실패:', error);
    } finally {
      setIsSigningUp(false);
    }
  };

  useEffect(() => {
    // 모든 단계가 완료되었는지 검증
    if (
      !isStepCompleted('terms') ||
      !isStepCompleted('phone') ||
      !isStepCompleted('email') ||
      !isStepCompleted('nickname') ||
      !isStepCompleted('favoriteSports')
    ) {
      router.push(PATHS.AUTH.SIGN_UP + '/terms');
    }
  }, [isStepCompleted, router]);

  return (
    <div className='flex min-h-[calc(100vh-144px)] flex-col items-center justify-center px-[20px]'>
      <div className='mb-8 text-center'>
        <h1 className='text-title-01 mb-4'>회원가입이 완료되었습니다!</h1>
        <p className='text-body-02 text-grey02'>
          PlayLink에 오신 것을 환영합니다
        </p>
      </div>

      <div className='w-full max-w-md'>
        <Button
          variant='default'
          onClick={handleComplete}
          disabled={isLoading || isSigningUp}
        >
          {isLoading || isSigningUp ? '회원가입 중...' : '회원가입 완료'}
        </Button>
      </div>
    </div>
  );
};

export default SignUpComplete;
