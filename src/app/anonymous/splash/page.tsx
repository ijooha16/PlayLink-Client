'use client';

import SocialIconButton from '@/components/shared/social-icon-button';
import { PATHS } from '@/constant/paths';
import { SPORT_ICONS } from '@/constants/images';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const router = useRouter();

  const sportIcons = SPORT_ICONS.POPULAR_SPORTS_IDS.map((id, index) => ({
    id,
    index,
    src: `/images/sport-svg-icons/${SPORT_ICONS[id].icon}`,
    alt: SPORT_ICONS[id].name
  }));



  const handleKakaoLogin = () => {
    window.location.href = '/api/auth/kakao/login';
  };

  return (
    <div
      className='mx-auto flex h-[calc(100vh-144px)] w-full max-w-screen-sm flex-col'
      style={{
        transform: 'translateZ(0)',
        willChange: 'auto',
      }}
    >
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

          {/* 스포츠 아이콘들 - 2줄 무한 스크롤 */}
          <div className='relative flex h-full w-full flex-col justify-center gap-6 overflow-hidden'>
            {[
              { direction: 'left', x: [0, -sportIcons.length * 76] },
              { direction: 'right', x: [-sportIcons.length * 76, 0] }
            ].map((row, rowIndex) => (
              <div key={rowIndex} className='relative flex items-center overflow-hidden'>
                <motion.div
                  className='flex items-center will-change-transform'
                  animate={{ x: row.x }}
                  transition={{
                    duration: sportIcons.length * 3,
                    ease: 'linear',
                    repeat: Infinity,
                    repeatType: 'loop',
                  }}
                  style={{
                    transform: 'translateZ(0)', // GPU 가속 활성화
                  }}
                >
                  {/* 3세트 로드 (더 부드러운 무한 스크롤) */}
                  {[...sportIcons, ...sportIcons, ...sportIcons].map((icon, index) => (
                    <div
                      key={`${rowIndex}-${index}`}
                      className="w-[72px] h-[72px] rounded-12 mr-4 border border-line-netural bg-white flex items-center justify-center flex-shrink-0 shadow-level-1"
                      style={{
                        transform: 'translateZ(0)', // GPU 레이어 분리
                        backfaceVisibility: 'hidden', // 백페이스 숨김
                      }}
                    >
                      <Image
                        src={icon.src}
                        alt={icon.alt}
                        width={40}
                        height={40}
                        loading="eager"
                        priority={index < 20}
                        quality={75}
                        sizes="40px"
                        unoptimized
                        style={{
                          transform: 'translateZ(0)',
                        }}
                      />
                    </div>
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 여백 */}
      <div className='flex-1'></div>

      {/* 하단 로그인 버튼들 */}
      <div className='fixed bottom-s-20 left-1/2 -translate-x-1/2 w-full max-w-[640px] px-s-20 flex flex-col gap-s-12'>
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
