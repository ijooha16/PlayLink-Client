'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const SIGN_UP_FLOW = [
  {
    key: 'terms',
    path: '/anonymous/auth/sign-up/terms',
    title: '서비스 이용을 위해 \n 약관 동의가 필요해요!',
  },
  {
    key: 'phone-check',
    path: '/anonymous/auth/sign-up/phone-check',
    title: '휴대폰 번호를 \n 입력해 주세요!',
  },
  {
    key: 'email-check',
    path: '/anonymous/auth/sign-up/email-check',
    title: '이메일과 비밀번호를 \n 입력해 주세요!',
  },
  {
    key: 'welcome',
    path: '/anonymous/auth/sign-up/welcome',
    title: '플레이링크에 오신 것을 환영해요!',
    content: '운동메이트를 찾기 위해 프로필을 완성해 주세요.',
  },
  {
    key: 'profile',
    path: '/anonymous/auth/sign-up/profile',
    title: '프로필 사진과 닉네임을 \n설정해주세요!',
  },
  {
    key: 'address',
    path: '/anonymous/auth/sign-up/address',
    title: '활동하는 동네를 \n 알려주세요!',
  },
  {
    key: 'interest',
    path: '/anonymous/auth/sign-up/interest',
    title: '어떤 걸 더\n 선호하시나요?',
  },
  {
    key: 'sports',
    path: '/anonymous/auth/sign-up/sports',
    title: '좋아하는 운동을 \n모두 선택해 주세요!',
  },
  {
    key: 'complete',
    path: '/anonymous/auth/sign-up/complete',
    title: '회원가입이 완료되었습니다!',
  },
];

interface AuthLayoutContainerProps {
  children: ReactNode;
  flowType?: 'signup';
  title?: string;
  content?: string;
}

const AuthLayoutContainer = ({
  children,
  flowType,
  title: propTitle,
  content: propContent,
}: AuthLayoutContainerProps) => {
  const pathname = usePathname();

  let title = propTitle || '';
  let content = propContent || '';

  if (flowType === 'signup' && !propTitle && !propContent) {
    const currentStep = SIGN_UP_FLOW.find(step => step.path === pathname);
    title = currentStep?.title || '';
    content = currentStep?.content || '';
  }

  return (
    <div className='flex flex-col'>
      <h1 className='text-title-01 whitespace-pre-line font-semibold'>
        {title}
      </h1>
      {content && <p className='text-body-02 pt-s-4 text-text-netural whitespace-pre-line font-regular'>{content}</p>}
      <div className="mt-s-24">
        {children}
      </div>
    </div>
  );
};

export default AuthLayoutContainer;
