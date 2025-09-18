'use client';

import {
  CircleUserIcon,
  HomeIcon,
  MapPinIcon,
  MessageSquareIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { handleGetSessionStorage } from '@/utills/web-api';
import { PATHS } from '@/constant/paths';

const MainBottomNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const allowedPaths = [PATHS.HOME, '/chat', PATHS.MY_NEAR, PATHS.MY_PAGE];

  const handleAuthRequiredClick =
    (targetPath: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      const token = handleGetSessionStorage();

      if (!token) {
        // 인증되지 않은 경우 로그인 페이지로 직접 이동
        router.push(PATHS.SPLASH);
      } else {
        // 인증된 경우 해당 페이지로 이동
        router.push(targetPath);
      }
    };

  if (!allowedPaths.includes(pathname)) {
    return null;
  }

  return (
    <nav className='fixed bottom-0 flex h-16 w-full max-w-[640px] justify-evenly bg-white py-2 shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.2)]'>
      <Link
        href={PATHS.HOME}
        className='flex w-20 flex-col items-center text-center text-xs'
      >
        <HomeIcon size={24} />홈
      </Link>
      <button
        onClick={handleAuthRequiredClick(PATHS.MY_NEAR)}
        className='flex w-20 flex-col items-center text-center text-xs'
      >
        <MapPinIcon size={24} />내 근처
      </button>
      <button
        onClick={handleAuthRequiredClick('/chat')}
        className='flex w-20 flex-col items-center text-center text-xs'
      >
        <MessageSquareIcon size={24} />
        채팅
      </button>
      <button
        onClick={handleAuthRequiredClick(PATHS.MY_PAGE)}
        className='flex w-20 flex-col items-center text-center text-xs'
      >
        <CircleUserIcon size={24} />
        마이페이지
      </button>
    </nav>
  );
};

export default MainBottomNavigation;
