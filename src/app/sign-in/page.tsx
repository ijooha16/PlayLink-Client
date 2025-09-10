'use client';

import SocialIconButton from '@/shares/common-components/social-icon-button';
import { useAlertStore } from '@/shares/stores/alert-store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSignin } from '@/hooks/react-query/auth/useSignin';
import { useLogin } from '@/hooks/common/auth/useLogin';
import Image from 'next/image';
import { motion } from 'framer-motion';

const SignIn = () => {

  const openAlert = useAlertStore((state) => state.openAlert);
  const router = useRouter();

  // 아이콘 리스트들 추가
  // svg 사용 한다고 말씀드린 후 constants 폴더로 옮길 예정
  const sportIcons = [
    { src: "/images/sport-svg-icons/sport=1_Ic_Soccer.svg", alt: "축구" },
    { src: "/images/sport-svg-icons/sport=Ic_Baseball.svg", alt: "야구" },
    { src: "/images/sport-svg-icons/sport=Ic_7_Badminton.svg", alt: "배드민턴" },
    { src: "/images/sport-svg-icons/sport=17_Ic_Crossfit.svg", alt: "크로스핏" },
    { src: "/images/sport-svg-icons/sport=23_Ic_Roller.svg", alt: "롤러스케이트" },
    { src: "/images/sport-svg-icons/sport=28_Ic_Climing.svg", alt: "클라이밍" },
    { src: "/images/sport-svg-icons/sport=25_Ic_Boxing.svg", alt: "권투" },
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

  // 로그인 훅 사용
  const handleKakaoLogin = useLogin('kakao');
  const handleEmailLogin = useLogin('email');


  return ( 
    <div className='mx-auto flex h-[calc(100vh-144px)] w-full max-w-screen-sm flex-col'>
      
      
      {/* 중앙 콘텐츠 */}
      <div className='mx-auto w-full break-keep h-full text-center'>
        <div className='animate-fadeInOnce py-6 text-center font-bold h-full flex flex-col justify-center'>
          <div className='flex flex-col items-center'>
            <span className='text-title-2 pb-3'>우리 동네 운동메이트 찾기</span>
            {/* svg 아이콘은 찾지 못하였음 png 이미지로 대체함. */}
            <Image
              src="/images/hero/playlink-icon.png"
              alt="스포츠 아이콘"
              width={224}
              height={75}
            />
          </div>

          {/* 스포츠 아이콘들 */}
          {/* framer motion으로 무한 x좌표로 이동함. */}
          <div className='relative w-full h-full overflow-hidden flex items-center'>
            <motion.div 
              className="flex items-center"
              animate={{ 
                x: [0, -sportIcons.length * 153]
              }}
              transition={{
                duration: sportIcons.length * 3,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              {/* 첫 번째 세트 */}
              {sportIcons.map((icon) => (
                <div 
                  key={`first-${icon.alt}`}
                  className="bg-grey04 rounded-2xl w-[144px] h-[144px] flex items-center justify-center mr-3 flex-shrink-0" 
                >
                  <Image
                    src={icon.src}
                    alt={icon.alt}
                    width={96}
                    height={96}
                  />
                </div>
              ))}
              {/* 두 번째 세트 (무한 루프를 위해) */}
              {sportIcons.map((icon) => (
                <div 
                  key={`second-${icon.alt}`}
                  className="bg-grey04 rounded-2xl w-[144px] h-[144px] flex items-center justify-center mr-3 flex-shrink-0" 
                >
                  <Image
                    src={icon.src}
                    alt={icon.alt}
                    width={96}
                    height={96}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* 하단 여백 */}
      <div className='flex-1'></div>


      
      {/* 하단 로그인 버튼들 */}
      <div className='w-full flex flex-col gap-3 mb-5'>
        <SocialIconButton
          src='/images/social/kakao-talk.png'
          alt='카카오 로그인'
          type='kakao'
          onClick={handleKakaoLogin}
        />
        <SocialIconButton
          src='/images/social/kakao-talk.png'
          alt='이메일 로그인'
          type='email'
          onClick={handleEmailLogin}
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
