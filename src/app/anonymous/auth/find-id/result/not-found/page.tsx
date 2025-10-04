'use client';

import AuthLayoutContainer from '@/components/layout/auth-layout';
import { AddUserIcon } from '@/components/shared/icons';
import SocialIconButton from '@/components/shared/social-icon-button';
import { PATHS } from '@/constant';
import { useRouter } from 'next/navigation';

const AccountLogin = () => {
  const router = useRouter();
  return (
    <AuthLayoutContainer
      title={`해당 정보로 \n 가입된 계정이 없어요!`}
      content='회원가입을 진행해주세요.'
    >
      <AddUserIcon className='mx-auto mt-24' />
      <div className='fixed bottom-s-20 left-1/2 flex w-full max-w-[640px] -translate-x-1/2 flex-col gap-s-12 px-s-20'>
        <SocialIconButton
          type='kakao'
          onClick={() => {
            window.location.href = '/api/auth/kakao/login';
          }}
        />
        <SocialIconButton
          type='email'
          onClick={() => {
            router.push(PATHS.AUTH.SIGN_UP);
          }}
        />
      </div>
    </AuthLayoutContainer>
  );
};

export default AccountLogin;
