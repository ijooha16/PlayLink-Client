'use client'

import SocialIconButton from '@/components/shared/social-icon-button'
import { PATHS } from '@/constant/paths'
import { SPORT_ICONS } from '@/constants/images'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type Dir = 'left' | 'right'
type SportMap = Omit<typeof SPORT_ICONS, 'POPULAR_SPORTS_IDS'>
type SportId = Extract<keyof SportMap, number>

type IconItem = {
  id: SportId
  src: string
  alt: string
}

type ScrollingIconsProps = {
  items: IconItem[]
  dir: Dir
  itemSpan?: number
  speed?: number
  repeatCount?: number
}

function ScrollingIcons({ items, dir, itemSpan = 88, speed = 60, repeatCount = 2 }: ScrollingIconsProps) {
  const len = items.length
  const distance = len * itemSpan
  const duration = distance / speed

  const total = len * repeatCount
  const renderIdxList = Array.from({ length: total }, (_, i) => {
    const j = i % len
    return dir === 'right' ? len - 1 - j : j
  })

  return (
    <div className='relative flex items-center'>
      <motion.div
        className='flex items-center will-change-transform'
        animate={{ x: dir === 'left' ? [0, -distance] : [-distance, 0] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
        style={{ transform: 'translateZ(0)' }}
      >
        {renderIdxList.map((idx, i) => {
          const icon = items[idx]
          return (
            <div
              key={`${dir}-${i}`}
              className='w-[72px] h-[72px] rounded-12 mr-4 border border-line-netural bg-white flex items-center justify-center flex-shrink-0 shadow-level-1'
              style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
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
          )
        })}
      </motion.div>
    </div>
  )
}

export default function SignIn() {
  const router = useRouter()

  const ids = SPORT_ICONS.POPULAR_SPORTS_IDS as readonly SportId[]
  const sportIcons: IconItem[] = ids.map((id) => {
    const s = (SPORT_ICONS as SportMap)[id]
    return {
      id,
      src: `/images/sport-svg-icons/${s.icon}`,
      alt: s.name,
    }
  })

  const handleKakaoLogin = () => {
    window.location.href = '/api/auth/kakao/login'
  }

  return (
    <div
      className='h-[100vh] flex flex-col justify-between relative'
      style={{ transform: 'translateZ(0)', willChange: 'auto' }}
    >
      <div className='flex-1 flex flex-col justify-center items-center'>
        <div className='w-full flex flex-col items-center animate-fadeInOnce gap-16'>
          <div className='flex flex-col items-center'>
            <span className='pb-s-12 pt-s-24 text-title-03 font-bold'>우리 동네 운동메이트 찾기</span>
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

          <div className='relative flex flex-col justify-center gap-6 w-screen -mx-5 px-5 overflow-hidden'>
            <ScrollingIcons items={sportIcons} dir='left' speed={30} repeatCount={2} />
            <ScrollingIcons items={sportIcons} dir='right' speed={30} repeatCount={2} />
          </div>
        </div>
      </div>
      <div className="flex-1"/>

      <div className='w-full flex px-s-20 items-center flex-col gap-s-12 fixed bottom-3 left-0 right-0 z-50'>
        <SocialIconButton type='kakao' onClick={handleKakaoLogin} />
        <SocialIconButton type='email' onClick={() => router.push(PATHS.AUTH.SIGN_IN)} />
      </div>
    </div>
  )
}
