'use client';

import { useRouter } from 'next/navigation';
import { useSignUpStepStore } from '@/store/sign-up-store';
import { useSignUpNavigation } from '@/hooks/use-sign-up-navigation';
import { useState } from 'react';
import useSignup from '@/hooks/common/use-signup';
import { getDeviceInfo } from '@/utills/get-device-info';
import Button from '@/components/ui/button';
import AuthLayoutContainer from '@/components/layout/auth-layout';

const SignUpComplete = () => {
  const router = useRouter();
  const { data, clearStep } = useSignUpStepStore();
  const { currentStepTitle } = useSignUpNavigation({
    currentStep: 'complete',
  });
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


  return (
    <AuthLayoutContainer title={currentStepTitle}>
      <div className="flex flex-col items-center justify-center py-s-40">
        <div className="text-center mb-s-40">
          <div className="text-6xl mb-s-24">🎉</div>
          <h2 className="text-title-02 font-bold text-text-primary mb-s-16">
            회원가입이 완료되었습니다!
          </h2>
          <p className="text-body-02 text-text-alternative">
            PlayLink에서 즐거운 스포츠 경험을 시작해보세요
          </p>
        </div>
      </div>

      <Button
        variant="default"
        onClick={handleComplete}
        disabled={isLoading || isSigningUp}
        isFloat
      >
        {isLoading || isSigningUp ? '회원가입 중...' : '회원가입 완료'}
      </Button>
    </AuthLayoutContainer>
  );
};

export default SignUpComplete;
