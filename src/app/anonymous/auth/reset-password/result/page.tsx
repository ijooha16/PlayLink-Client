'use client';

import { Check } from '@/components/shared/icons';
import Button from '@/components/ui/button';
import { PATHS } from '@/constant/paths';
import { motion } from 'framer-motion';
import Link from 'next/link';

const DOT_COUNT = 8;
const RADIUS_PX = 100;

const ResetPasswordResult = () => {
  return (
    <div className="min-h-screen pt-20 px-6">
      <div className="mx-auto w-full max-w-sm">
        {/* 아이콘과 퍼짐 애니메이션 컨테이너 */}
        <div className="relative flex items-center justify-center mb-8">
          {/* 바깥 원 8개 */}
          {Array.from({ length: DOT_COUNT }).map((_, index) => {
            const angleDeg = index * 45;
            const angleRad = angleDeg * Math.PI / 180;
            const dx = Math.cos(angleRad) * RADIUS_PX;
            const dy = Math.sin(angleRad) * RADIUS_PX;

            return (
              <motion.div
                key={index}
                className="pointer-events-none absolute w-[4px] h-[4px] bg-primary-300 rounded-full"
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{ x: dx, y: dy, scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
              />
            );
          })}

          {/* 요청하신 체크 아이콘 블록은 그대로 유지 */}
          <div className="mb-8">
            <div className="flex bg-primary-300 justify-center items-center w-[72px] h-[72px] rounded-full">
              <Check size={32} className="text-white" />
            </div>
          </div>
        </div>

        {/* 텍스트 섹션 */}
        <div className="text-center pt-32">
          <h1 className="text-title-01 font-semibold mb-2 text-text-strong">
            비밀번호가
            <br />
            변경되었어요!
          </h1>
          <p className="text-body-02 text-text-netural">
            새로운 비밀번호로 로그인 해 주세요.
          </p>
        </div>

        {/* 버튼 섹션 */}
        <Link href={PATHS.AUTH.SIGN_IN} className="block">
          <Button className="w-full" isFloat>
            로그인
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordResult;
