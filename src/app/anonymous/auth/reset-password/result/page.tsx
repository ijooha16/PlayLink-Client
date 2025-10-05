'use client';

import { Check } from '@/components/shared/icons';
import Button from '@/components/ui/button';
import { PATHS } from '@/constant';
import { motion } from 'framer-motion';
import Link from 'next/link';

const DOT_COUNT = 8;
const RADIUS_PX = 100;

const ResetPasswordResult = () => {
  return (
    <div className='min-h-screen px-6 pt-20'>
      <div className='mx-auto w-full max-w-sm'>
        {/* 아이콘과 퍼짐 애니메이션 컨테이너 */}
        <div className='relative mb-8 flex items-center justify-center'>
          {/* 바깥 원 8개 */}
          {Array.from({ length: DOT_COUNT }).map((_, index) => {
            const angleDeg = index * 45;
            const angleRad = (angleDeg * Math.PI) / 180;
            const dx = Math.cos(angleRad) * RADIUS_PX;
            const dy = Math.sin(angleRad) * RADIUS_PX;

            return (
              <motion.div
                key={index}
                className='pointer-events-none absolute h-[4px] w-[4px] rounded-full bg-primary-300'
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{ x: dx, y: dy, scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
              />
            );
          })}

          {/* 요청하신 체크 아이콘 블록은 그대로 유지 */}
          <div className='mb-8'>
            <div className='flex h-[72px] w-[72px] items-center justify-center rounded-full bg-primary-300'>
              <Check size={32} className='text-white' />
            </div>
          </div>
        </div>

        {/* 텍스트 섹션 */}
        <div className='pt-32 text-center'>
          <h1 className='mb-2 text-title-01 font-semibold text-text-strong'>
            비밀번호가
            <br />
            변경되었어요!
          </h1>
          <p className='text-text-neutral text-body-02'>
            새로운 비밀번호로 로그인 해 주세요.
          </p>
        </div>

        {/* 버튼 섹션 */}
        <Link href={PATHS.AUTH.SIGN_IN} className='block'>
          <Button className='w-full' isFloat>
            로그인
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordResult;
