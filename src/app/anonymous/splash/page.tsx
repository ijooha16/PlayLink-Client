'use client';

import SocialIconButton from '@/components/shared/social-icon-button';
import { PATHS } from '@/constant';
import { SPORT_ICONS } from '@/constant/images';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Dir = 'left' | 'right';
type SportMap = Omit<typeof SPORT_ICONS, 'POPULAR_SPORTS_IDS'>;
type SportId = Extract<keyof SportMap, number>;

type IconItem = {
  id: SportId;
  src: string;
  alt: string;
};

type ScrollingIconsProps = {
  items: IconItem[];
  dir: Dir;
  itemSpan?: number;
  speed?: number;
  repeatCount?: number;
};

function ScrollingIcons({
  items,
  dir,
  itemSpan = 88,
  speed = 60,
  repeatCount = 2,
}: ScrollingIconsProps) {
  const len = items.length;
  const distance = len * itemSpan;
  const duration = distance / speed;

  const total = len * repeatCount;
  const renderIdxList = Array.from({ length: total }, (_, i) => {
    const j = i % len;
    return dir === 'right' ? len - 1 - j : j;
  });

  return (
    <div className='relative flex items-center'>
      <motion.div
        className='flex items-center will-change-transform'
        animate={{ x: dir === 'left' ? [0, -distance] : [-distance, 0] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
        style={{ transform: 'translateZ(0)' }}
      >
        {renderIdxList.map((idx, i) => {
          const icon = items[idx];
          return (
            <div
              key={`${dir}-${i}`}
              className='border-line-neutral mr-4 flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-12 border bg-white shadow-level-1'
              style={{
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
              }}
            >
              <Image
                src={icon.src}
                alt={icon.alt}
                width={40}
                height={40}
                loading='eager'
                quality={75}
                sizes='40px'
                style={{ transform: 'translateZ(0)', height: 'auto' }}
              />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

export default function SignIn() {
  const router = useRouter();

  const ids = SPORT_ICONS.POPULAR_SPORTS_IDS as readonly SportId[];
  const sportIcons: IconItem[] = ids.map((id) => {
    const s = (SPORT_ICONS as SportMap)[id];
    return {
      id,
      src: `/images/sport-svg-icons/${s.icon}`,
      alt: s.name,
    };
  });

  const handleKakaoLogin = () => {
    window.location.href = '/api/auth/kakao/login';
  };

  const handleAppleLogin = () => {
    alert('애플 로그인 기능은 준비 중입니다.');
  };

  return (
    <div
      className='relative flex h-[calc(100vh-24px)] flex-col justify-between pt-s-24'
      style={{ transform: 'translateZ(0)', willChange: 'auto' }}
    >
      <div className='flex flex-1 flex-col items-center justify-center'>
        <div className='flex w-full animate-fadeInOnce flex-col items-center gap-16'>
          <div className='flex flex-col items-center'>
            <span className='pb-s-12 pt-s-24 text-title-03 font-bold'>
              우리 동네 운동메이트 찾기
            </span>
            <Image
              src='/images/hero/playlink-icon.svg'
              alt='스포츠 아이콘'
              width={224}
              height={75}
              priority
              sizes='224px'
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>

          <div className='relative -mx-5 flex w-screen flex-col justify-center gap-6 overflow-hidden'>
            <ScrollingIcons
              items={sportIcons}
              dir='left'
              speed={30}
              repeatCount={2}
            />
            <ScrollingIcons
              items={sportIcons}
              dir='right'
              speed={30}
              repeatCount={2}
            />
          </div>
        </div>
      </div>
      <div className='flex-1' />

      <div className='fixed bottom-3 left-0 right-0 z-50 flex w-full flex-col items-center gap-s-12'>
        <SocialIconButton type='1' onClick={handleKakaoLogin} />
        <SocialIconButton type='2' onClick={handleAppleLogin} />
        <SocialIconButton
          type='0'
          onClick={() => router.push(PATHS.AUTH.SIGN_IN)}
        />
      </div>
    </div>
  );
}
