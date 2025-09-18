'use client';

import AuthLayoutContainer from '@/components/layout/auth-layout';
import Button from '@/components/ui/button';
import { PATHS } from '@/constant';
import { useSignUpStepStore } from '@/store/sign-up-store';
import { Apple, Mail } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const AccountExistsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearStep } = useSignUpStepStore();

  const nickname = searchParams.get('nickname') || '익명의 플링커';
  const email = searchParams.get('email') || '';
  const accountType = searchParams.get('accountType') || '0';

  const handleGoToLogin = () => {
    clearStep(); // zustand store 초기화
    router.push(PATHS.SPLASH);
  };

  return (
    <AuthLayoutContainer title={'이미 가입된 계정이 \n 있어요!'}>
      <div className='flex items-center rounded-[12px] border border-primary p-[20px]'>
        {/* 좌측 아이콘 */}
        <div className='mr-[16px] flex h-[48px] w-[48px] items-center justify-center rounded-full bg-grey04'>
          {accountType === '0' && <Mail size={24} />}
          {accountType === '1' && (
            <Image
              src='/images/social/kakao-talk.png'
              alt='Kakao'
              width={24}
              height={24}
            />
          )}
          {accountType === '2' && <Apple size={24} />}
          {accountType === '3' && (
            <Image
              src='/images/social/google.svg'
              alt='Google'
              width={24}
              height={24}
            />
          )}
        </div>

        {/* 우측 정보 */}
        <div className='flex-1 text-sub'>
          <p className='mb-[4px] text-body-3'>{email}</p>
          <div className='flex items-center gap-[4px]'>
            <p className='text-grey02'>가입일</p>
            <p className='text-grey01'>
              {new Date(searchParams.get('createdAt') || '2024-08-12')
                .toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })
                .replace(/\. /g, '. ')
                .slice(0, -1)}
            </p>
          </div>
        </div>
      </div>

      <Button variant='default' size='base' onClick={handleGoToLogin} isFloat>
        로그인하기
      </Button>
    </AuthLayoutContainer>
  );
};

const AccountExists = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountExistsContent />
    </Suspense>
  );
};

export default AccountExists;
