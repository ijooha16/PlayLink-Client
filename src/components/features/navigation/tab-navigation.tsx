'use client';

import {
  CircleUserIcon,
  HomeIcon,
  MapPinIcon,
  MessageSquareIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PATHS } from '@/constant/paths';

const TabNavigation = () => {
  const pathname = usePathname();

  // anonymous 경로에서는 탭 네비게이션 숨김
  const shouldHideNavigation = pathname.startsWith('/anonymous');

  if (shouldHideNavigation) {
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
      <Link
        href={PATHS.MY_NEAR}
        className='flex w-20 flex-col items-center text-center text-xs'
      >
        <MapPinIcon size={24} />내 근처
      </Link>
      <Link
        href={PATHS.CHAT}
        className='flex w-20 flex-col items-center text-center text-xs'
      >
        <MessageSquareIcon size={24} />
        채팅
      </Link>
      <Link
        href={PATHS.MY_PAGE}
        className='flex w-20 flex-col items-center text-center text-xs'
      >
        <CircleUserIcon size={24} />
        마이페이지
      </Link>
    </nav>
  );
};

export default TabNavigation;