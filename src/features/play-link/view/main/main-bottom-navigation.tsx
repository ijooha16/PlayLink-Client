import {
  CircleUserIcon,
  HomeIcon,
  MapPinIcon,
  MessageSquareIcon,
} from 'lucide-react';
import Link from 'next/link';

const MainBottomNavigation = () => {
  return (
    <nav className='fixed bottom-0 flex h-16 w-full max-w-[640px] justify-evenly bg-white py-2 shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.2)]'>
      <Link
        href={'/'}
        className='flex flex-col items-center text-center text-sm'
      >
        <HomeIcon size={24} />홈
      </Link>
      <Link
        href={'/my-near'}
        className='flex flex-col items-center text-center text-sm'
      >
        <MapPinIcon size={24} />내 근처
      </Link>
      <Link
        href={'/chat'}
        className='flex flex-col items-center text-center text-sm'
      >
        <MessageSquareIcon size={24} />
        채팅
      </Link>
      <Link
        href={'/sign-in'}
        className='flex flex-col items-center text-center text-sm'
      >
        <CircleUserIcon size={24} />
        마이페이지
      </Link>
    </nav>
  );
};

export default MainBottomNavigation;
