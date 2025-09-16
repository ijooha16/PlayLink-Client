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
      router.replace('/');
      openAlert('로그인 성공!', '매너 있는 플레이링크 부탁드립니다 :D');
    },
    onError: (err) => {
      console.error('로그인 실패:', err.message);
      openAlert('로그인 실패', err.message);
    },
  });

  const handleKakaoLogin = () => {
    const CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_OAUTH_REST_API_KEY!;
    const REDIRECT_URI =
      process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ??
      'http://localhost:3000/oauth/kakaoCallback';

    // (선택) CSRF 방지용 state 생성/저장
    const state = Math.random().toString(36).slice(2);
    sessionStorage.setItem('kakao_oauth_state', state);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
    });

    // ✅ 외부(Kakao)로 리다이렉트
    window.location.href = `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
  };

  return (
    <div className='mx-auto flex h-[calc(100vh-144px)] w-full max-w-screen-sm flex-col'>
      {isPending && <Loading variant='white' />}

      {/* 중앙 콘텐츠 */}
      <div className='mx-auto h-full w-full break-keep text-center'>
        <div className='flex h-full animate-fadeInOnce flex-col justify-center py-6 text-center font-bold'>
          <div className='flex flex-col items-center'>
            <span className='pb-3 text-title-2'>우리 동네 운동메이트 찾기</span>
            {/* svg 아이콘은 찾지 못하였음 png 이미지로 대체함. */}
            <Image
              src='/images/hero/playlink-icon.png'
              alt='스포츠 아이콘'
              width={224}
              height={75}
            />
          </div>

          {/* 스포츠 아이콘들 */}
          {/* framer motion으로 무한 x좌표로 이동함. */}
          <div className='relative flex h-full w-full items-center overflow-hidden'>
            <motion.div
              className='flex items-center'
              animate={{
                x: [0, -sportIcons.length * 153],
              }}
              transition={{
                duration: sportIcons.length * 3,
                ease: 'linear',
                repeat: Infinity,
                repeatType: 'loop',
              }}
            >
              {/* 첫 번째 세트 */}
              {sportIcons.map((icon, index) => (
                <div
                  key={`first-${index}`}
                  className='mr-3 flex h-[144px] w-[144px] flex-shrink-0 items-center justify-center rounded-2xl bg-grey04'
                >
                  <Image src={icon.src} alt={icon.alt} width={96} height={96} />
                </div>
              ))}
              {/* 두 번째 세트 (무한 루프를 위해) */}
              {sportIcons.map((icon, index) => (
                <div
                  key={`second-${index}`}
                  className='mr-3 flex h-[144px] w-[144px] flex-shrink-0 items-center justify-center rounded-2xl bg-grey04'
                >
                  <Image src={icon.src} alt={icon.alt} width={96} height={96} />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* 하단 여백 */}
      <div className='flex-1'></div>

      {/* 하단 로그인 버튼들 */}
      <div className='mb-5 flex w-full flex-col gap-3'>
        <SocialIconButton
          src='/images/social/kakao-talk.png'
          alt='카카오 로그인'
          type='kakao'
          onClick={handleKakaoLogin}
        />
        <SocialIconButton
          src='/images/social/kakao-talk.png'
          alt='카카오 로그인'
          type='email'
          onClick={() => router.push('/sign-in')}
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
