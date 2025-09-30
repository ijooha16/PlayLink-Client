'use client';

import AuthLayoutContainer from '@/components/layout/auth-layout';
import { EmailRound } from '@/components/shared/icons';
import Button from '@/components/ui/button';
import { PATHS } from '@/constant';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Apple } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const AccountExistsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nickname = searchParams.get('nickname') || '익명의 플링커';
  const email = searchParams.get('email') || '';
  const accountType = searchParams.get('accountType') || '0';
  const source = searchParams.get('source');

  const handleGoToLogin = () => {
    router.push(PATHS.AUTH.SIGN_IN);
  };
  return (
    <AuthLayoutContainer
      title={`해당 정보로 \n 이미 가입된 계정이 있어요!`}
      content={`해당 계정으로 로그인해 주세요.`}
    >
      <div className='mt-s-24 flex items-center rounded-[8px] border border-brand-primary p-s-16'>
        {/* 좌측 아이콘 */}
        <div className='bg-grey04 mr-[16px] flex h-[48px] w-[48px] items-center justify-center rounded-full'>
          {accountType === '0' && (
            <div className='flex h-[40px] w-[40px] items-center justify-center rounded-full bg-bg-alternative'>
              <EmailRound />
            </div>
          )}
          {accountType === '1' && (
            <div className='flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#FEE500]'>
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
        <div className='text-sub flex-1'>
          <p className='text-body-1 mb-s-2 font-semibold text-text-strong'>
            {email}
          </p>
          <div className='flex items-center gap-[4px]'>
            <p className='text-caption-01 font-medium text-text-netural'>
              가입일
            </p>
            <p className='text-caption-01 font-medium text-text-strong'>
              {format(
                new Date(searchParams.get('createdAt') || '2024-08-12'),
                'yyyy. MM. dd',
                { locale: ko }
              )}
            </p>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-s-12'>
        <Button
          variant='default'
          size='base'
          isFloat={true}
          onClick={handleGoToLogin}
        >
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
