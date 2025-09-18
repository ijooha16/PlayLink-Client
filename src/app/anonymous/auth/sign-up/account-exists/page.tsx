'use client';

import Button from '@/components/common/button';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Apple } from 'lucide-react';
import Image from 'next/image';
import { useSignUpStepStore } from '@/stores/sign-up-store';
import { PATHS } from '@/constant/paths';

const AccountExists = () => {
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
    <div className='flex min-h-[calc(100vh-144px)] flex-col'>
      <div className='px-[20px] pt-[24px]'>
        <h1 className='pb-1 text-title-1'>해당 정보로</h1>
        <h1 className='pb-1 text-title-1'>이미 가입된 계정이 있습니다.</h1>
        <p className='pb-[24px] text-body-4 text-grey02'>
          해당 계정으로 로그인 해주세요
        </p>
      </div>
      <div className='px-[20px]'>
        <div className='mb-[32px] flex items-center rounded-[12px] border border-primary p-[20px]'>
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
      </div>

      <div className='mt-auto space-y-[12px] px-[20px] pb-[20px]'>
        <Button variant='default' size='base' onClick={handleGoToLogin}>
          로그인하기
        </Button>
      </div>
    </div>
  );
};

export default AccountExists;
