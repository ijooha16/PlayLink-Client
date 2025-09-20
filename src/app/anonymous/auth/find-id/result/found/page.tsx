'use client';

import AuthLayoutContainer from '@/components/layout/auth-layout';
import { EmailRound } from '@/components/shared/icons';
import Button from '@/components/ui/button';
import { PATHS } from '@/constant';
import { useSignUpStepStore } from '@/store/sign-up-store';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Apple } from 'lucide-react';
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
  const source = searchParams.get('source');

  const handleGoToLogin = () => {
    clearStep(); // zustand store 초기화
    router.push(PATHS.AUTH.FOUND);
  };
  return (
    <AuthLayoutContainer title={"해당 정보 \n 이미 가입된 계정이 있어요!"} content="해당 계정으로 로그인 해주세요">
      <div className='flex items-center rounded-[8px] border border-brand-primary p-s-16 mt-s-24'>
        {/* 좌측 아이콘 */}
        <div className='mr-[16px] flex h-[48px] w-[48px] items-center justify-center rounded-full bg-grey04'>
          {accountType === '0' && 
          <div className="w-[40px] h-[40px] flex items-center justify-center bg-bg-alternative rounded-full">
          <EmailRound />
          </div>
          }
          {accountType === '1' && (
            <div className="w-[40px] h-[40px] flex items-center justify-center bg-[#FEE500] rounded-full">

            <Image
              src='/images/social/kakao-talk.png'
              alt='Kakao'
              width={24}
              height={24}
              />
              </div>
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
          <p className='mb-s-2 text-body-1 font-semibold text-text-strong'>{email}</p>
          <div className='flex items-center gap-[4px]'>
            <p className='text-text-netural font-medium text-caption-01'>가입일</p>
            <p className='text-text-strong text-caption-01 font-medium'>
              {format(new Date(searchParams.get('createdAt') || '2024-08-12'), 'yyyy. MM. dd', { locale: ko })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-s-12">
        <Button variant='default' size='base' isFloat={true} onClick={handleGoToLogin}>
          로그인 하기
        </Button>

      </div>
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
