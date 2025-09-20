'use client';

import PhoneVerification from '@/components/forms/verification/phone';
import AuthLayoutContainer from '@/components/layout/auth-layout';

const FindId = () => {
  return (
    <AuthLayoutContainer title={'가입하신 계정의 \n 휴대폰 번호를 입력해 주세요!'}>
      <PhoneVerification context="find-id" />
    </AuthLayoutContainer>
  );
};

export default FindId;