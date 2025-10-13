'use client';

import { Check } from '@/components/shared/icons';
import Button from '@/components/ui/button';
import { PATHS } from '@/constant';
import { motion } from 'framer-motion';
import Link from 'next/link';

const DOT_COUNT = 8;
const RADIUS_PX = 120;

const ResetPasswordResult = () => {
  return (
    <div className='flex min-h-[calc(100vh-3.5rem-24px)] flex-col'>
      <div className='mx-auto flex w-full max-w-sm flex-1 flex-col px-6 py-8'>
        <div className='flex flex-col items-center justify-start pt-16'>
          <div className='relative flex h-[88px] w-[88px] items-center justify-center'>
            {Array.from({ length: DOT_COUNT }).map((_, index) => {
              const angleDeg = index * 45;
              const angleRad = (angleDeg * Math.PI) / 180;
              const dx = Math.cos(angleRad) * RADIUS_PX;
              const dy = Math.sin(angleRad) * RADIUS_PX;

              return (
                <motion.div
                  key={index}
                  className='pointer-events-none absolute h-1 w-1 rounded-full bg-primary-300'
                  initial={{ x: 0, y: 0, scale: 0.6, opacity: 0.7 }}
                  animate={{ x: dx, y: dy, scale: 1.05, opacity: 0 }}
                  transition={{
                    duration: 1.1,
                    ease: 'easeOut',
                  }}
                />
              );
            })}

            <div className='shadow-primary-200/40 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-primary-300 shadow-lg'>
              <Check size={32} className='text-white' />
            </div>
          </div>

          <div className='mt-32 space-y-2 text-center'>
            <h1 className='text-title-01 font-semibold text-text-strong'>
              비밀번호가
              <br />
              변경되었어요!
            </h1>
            <p className='text-body-02 text-text-neutral'>
              새로운 비밀번호로 로그인 해 주세요.
            </p>
          </div>
        </div>

        <Link href={PATHS.AUTH.SIGN_IN} className='mt-12 block'>
          <Button className='w-full' isFloat>
            로그인
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordResult;
