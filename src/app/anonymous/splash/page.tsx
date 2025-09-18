'use client';

import SocialIconButton from '@/components/common/social-icon-button';
import { getDeviceInfo } from '@/utills/get-device-info';
import { useAlertStore } from '@/stores/alert-store';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useSignin } from '@/hooks/react-query/auth/use-signin';
import Loading from '@/components/common/loading';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PATHS } from '@/constant/paths';

const SignIn = () => {
  const openAlert = useAlertStore((state) => state.openAlert);
  const router = useRouter();

  // 아이콘 리스트들 추가
  // svg 사용 한다고 말씀드린 후 constants 폴더로 옮길 예정
  const sportIcons = [
    { src: '/images/sport-svg-icons/sport=1_Ic_Soccer.svg', alt: '축구' },
    { src: '/images/sport-svg-icons/sport=Ic_Baseball.svg', alt: '야구' },
    {
      src: '/images/sport-svg-icons/sport=Ic_7_Badminton.svg',
      alt: '배드민턴',
    },
    {
      src: '/images/sport-svg-icons/sport=17_Ic_Crossfit.svg',
      alt: '크로스핏',
    },
    {
      src: '/images/sport-svg-icons/sport=23_Ic_Roller.svg',
      alt: '롤러스케이트',
    },
    { src: '/images/sport-svg-icons/sport=28_Ic_Climing.svg', alt: '클라이밍' },
    { src: '/images/sport-svg-icons/sport=25_Ic_Boxing.svg', alt: '권투' },
  ];

  const { mutate: signIn, isPending } = useSignin({
    onSuccess: () => {
      router.replace(PATHS.HOME);
      openAlert('로그인 성공!', '매너 있는 플레이링크 부탁드립니다 :D');
    },
    onError: (err) => {
      console.error('로그인 실패:', err.message);
      openAlert('로그인 실패', err.message);
    },
  });

  const handleKakaoLogin = () => {
    window.location.href = '/api/auth/kakao/login';
  };

  return (
    <div className='mx-auto flex h-[calc(100vh-144px)] w-full max-w-screen-sm flex-col'>
      {isPending && <Loading variant='white' />}

      {/* 중앙 콘텐츠 */}
      <div className='mx-auto h-full w-full break-keep text-center'>
        <div className='flex h-full animate-fadeInOnce flex-col justify-center py-6 text-center font-bold'>
          <div className='flex flex-col items-center'>
            <span className='pb-3 text-title-03'>우리 동네 운동메이트 찾기</span>
            {/* svg 아이콘은 찾지 못하였음 png 이미지로 대체함. */}
            <Image
              src='/images/hero/playlink-icon.svg'
              alt='스포츠 아이콘'
              width={224}
              height={75}
            />
          </div>

          {/* 스포츠 아이콘들 - 2줄 레이아웃 */}
          <div className='relative flex h-full w-full flex-col justify-center gap-4 overflow-hidden'>
            {/* 첫 번째 줄 - 좌측으로 이동 */}
            <div className='relative flex items-center overflow-hidden'>
              <motion.div
                className='flex items-center'
                animate={{
                  x: [0, -Math.ceil(sportIcons.length / 2) * 87],
                }}
                transition={{
                  duration: Math.ceil(sportIcons.length / 2) * 2,
                  ease: 'linear',
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
              >
                {/* 첫 번째 세트 */}
                {sportIcons.slice(0, Math.ceil(sportIcons.length / 2)).map((icon, index) => (
                  <div
                    key={`first-row-first-${index}`}
                    className="shadow-level-1 w-[72px] h-[72px] rounded-16 mr-[15px] border border-line-neutral bg-white flex items-center justify-center flex-shrink-0"
                  >
                    <Image src={icon.src} alt={icon.alt} width={48} height={48} />
                  </div>
                ))}
                {/* 두 번째 세트 (무한 루프용) */}
                {sportIcons.slice(0, Math.ceil(sportIcons.length / 2)).map((icon, index) => (
                  <div
                    key={`first-row-second-${index}`}
                    className="shadow-level-1 w-[72px] h-[72px] rounded-16 mr-[15px] border border-line-neutral bg-white flex items-center justify-center flex-shrink-0"
                  >
                    <Image src={icon.src} alt={icon.alt} width={48} height={48} />
                  </div>
                ))}
                {/* 세 번째 세트 (부드러운 연결용) */}
                {sportIcons.slice(0, Math.ceil(sportIcons.length / 2)).map((icon, index) => (
                  <div
                    key={`first-row-third-${index}`}
                    className="shadow-level-1 w-[72px] h-[72px] rounded-16 mr-[15px] border border-line-neutral bg-white flex items-center justify-center flex-shrink-0"
                  >
                    <Image src={icon.src} alt={icon.alt} width={48} height={48} />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* 두 번째 줄 - 우측으로 이동 */}
            <div className='relative flex items-center overflow-hidden'>
              <motion.div
                className='flex items-center'
                animate={{
                  x: [-Math.floor(sportIcons.length / 2) * 87, 0],
                }}
                transition={{
                  duration: Math.floor(sportIcons.length / 2) * 2,
                  ease: 'linear',
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
              >
                {/* 첫 번째 세트 */}
                {sportIcons.slice(Math.ceil(sportIcons.length / 2)).map((icon, index) => (
                  <div
                    key={`second-row-first-${index}`}
                    className="shadow-level-1 w-[72px] h-[72px] rounded-16 mr-[15px] border border-line-neutral bg-white flex items-center justify-center flex-shrink-0"
                  >
                    <Image src={icon.src} alt={icon.alt} width={48} height={48} />
                  </div>
                ))}
                {/* 두 번째 세트 (무한 루프용) */}
                {sportIcons.slice(Math.ceil(sportIcons.length / 2)).map((icon, index) => (
                  <div
                    key={`second-row-second-${index}`}
                    className="shadow-level-1 w-[72px] h-[72px] rounded-16 mr-[15px] border border-line-neutral bg-white flex items-center justify-center flex-shrink-0"
                  >
                    <Image src={icon.src} alt={icon.alt} width={48} height={48} />
                  </div>
                ))}
                {/* 세 번째 세트 (부드러운 연결용) */}
                {sportIcons.slice(Math.ceil(sportIcons.length / 2)).map((icon, index) => (
                  <div
                    key={`second-row-third-${index}`}
                    className="shadow-level-1 w-[72px] h-[72px] rounded-16 mr-[15px] border border-line-neutral bg-white flex items-center justify-center flex-shrink-0"
                  >
                    <Image src={icon.src} alt={icon.alt} width={48} height={48} />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 여백 */}
      <div className='flex-1'></div>

      {/* 하단 로그인 버튼들 */}
      <div className='mb-5 flex w-full flex-col gap-3'>
        <SocialIconButton
          type='kakao'
          onClick={handleKakaoLogin}
        />
        <SocialIconButton
          type='email'
          onClick={() => router.push(PATHS.AUTH.SIGN_IN)}
        />
      </div>
      {/* <SocialIconButton
              src='/images/social/google.svg'
              alt='구글 로그인'
            /> */}
    </div>
  );
};

export default SignIn;
