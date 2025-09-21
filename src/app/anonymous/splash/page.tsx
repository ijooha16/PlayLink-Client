'use client';

import SocialIconButton from '@/components/shared/social-icon-button';
import Loading from '@/components/ui/loading';
import { PATHS } from '@/constant/paths';
import { useSignin } from '@/hooks/react-query/auth/use-signin';
import { useAlertStore } from '@/store/alert-store';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const openAlert = useAlertStore((state) => state.openAlert);
  const router = useRouter();

  const sportIcons = [
    { src: '/images/sport-svg-icons/sport=1_Ic_Soccer.svg', alt: '축구' },
    { src: '/images/sport-svg-icons/sport=2_Ic_Futsal.svg', alt: '풋살' },
    { src: '/images/sport-svg-icons/sport=3_Ic_Basketball.svg', alt: '농구' },
    { src: '/images/sport-svg-icons/sport=4_Ic_Volleyball.svg', alt: '배구' },
    { src: '/images/sport-svg-icons/sport=5_Ic_Foot.svg', alt: '족구' },
    { src: '/images/sport-svg-icons/sport=8_Ic_TableT.svg', alt: '탁구' },
    { src: '/images/sport-svg-icons/sport=9_Ic_Bowling.svg', alt: '볼링' },
    { src: '/images/sport-svg-icons/sport=10_Ic_Hockey.svg', alt: '하키' },
    { src: '/images/sport-svg-icons/sport=11_Ic_Tennis.svg', alt: '테니스' },
    { src: '/images/sport-svg-icons/sport=12_Ic_Squash.svg', alt: '스쿼시' },
    { src: '/images/sport-svg-icons/sport=13_Ic_Swim.svg', alt: '수영' },
    { src: '/images/sport-svg-icons/sport=14_Ic_Surf.svg', alt: '서핑' },
    { src: '/images/sport-svg-icons/sport=15_Ic_Fitness.svg', alt: '피트니스' },
    { src: '/images/sport-svg-icons/sport=16_Ic_Yoga.svg', alt: '요가' },
    { src: '/images/sport-svg-icons/sport=17_Ic_Crossfit.svg', alt: '크로스핏' },
    { src: '/images/sport-svg-icons/sport=18_Ic_Aerobics.svg', alt: '에어로빅' },
    { src: '/images/sport-svg-icons/sport=19_Ic_Dance.svg', alt: '댄스' },
    { src: '/images/sport-svg-icons/sport=20_Ic_Running.svg', alt: '러닝' },
    { src: '/images/sport-svg-icons/sport=22_Ic_Bicycle.svg', alt: '자전거' },
    { src: '/images/sport-svg-icons/sport=23_Ic_Roller.svg', alt: '롤러스케이트' },
    { src: '/images/sport-svg-icons/sport=24_Ic_Golf.svg', alt: '골프' },
    { src: '/images/sport-svg-icons/sport=25_Ic_Boxing.svg', alt: '권투' },
    { src: '/images/sport-svg-icons/sport=26_Ic_Muaythai.svg', alt: '무에타이' },
    { src: '/images/sport-svg-icons/sport=27_Ic_Judo.svg', alt: '유도' },
    { src: '/images/sport-svg-icons/sport=28_Ic_Climing.svg', alt: '클라이밍' },
    { src: '/images/sport-svg-icons/sport=29_Ic_Hiking.svg', alt: '등산' },
    { src: '/images/sport-svg-icons/sport=30_Ic_Ski.svg', alt: '스키' },
    { src: '/images/sport-svg-icons/sport=Ic_7_Badminton.svg', alt: '배드민턴' },
    { src: '/images/sport-svg-icons/sport=Ic_Baseball.svg', alt: '야구' },
    { src: '/images/sport-svg-icons/sport=Ic_Board.svg', alt: '보드' },
    { src: '/images/sport-svg-icons/sport=Ic_Handball.svg', alt: '핸드볼' },
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
      {isPending && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
        >
          <Loading variant='white' />
        </motion.div>
      )}

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
              { direction: 'left', x: [0, -sportIcons.length * 68] },
              { direction: 'right', x: [-sportIcons.length * 68, 0] }
            ].map((row, rowIndex) => (
              <div key={rowIndex} className='relative flex items-center overflow-hidden'>
                <motion.div
                  className='flex items-center'
                  animate={{ x: row.x }}
                  transition={{
                    duration: sportIcons.length * 2,
                    ease: 'linear',
                    repeat: Infinity,
                    repeatType: 'loop',
                  }}
                >
                  {/* 2세트만 로드 (원본 + 복제) */}
                  {[...sportIcons, ...sportIcons].map((icon, index) => (
                    <div
                      key={`${rowIndex}-${index}`}
                      className="w-16 h-16 rounded-12 mr-4 border border-line-netural bg-white flex items-center justify-center flex-shrink-0 shadow-level-1"
                    >
                      <Image src={icon.src} alt={icon.alt} width={32} height={32} />
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
