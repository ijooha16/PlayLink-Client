import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../styles/globals.css';
import LayoutClientSide from '@/features/play-link/view/main/layout-client-side';
import Providers from './provider';
import MainBottomNavigation from '@/features/play-link/view/main/main-bottom-navigation';

const pretendard = localFont({
  src: '../../public/fonts/pretendard-variable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: '플레이링크',
  description: '당신의 운동 친구! 플레이 링크에서 만나세요.',
  // icons: {
  //   icon: "images/퍼블릭폴더 내부 파일 이름",
  // },
  // metadataBase: new URL("사이트 링크"),
  // openGraph: {
  //   title: "제목",
  //   description: "설명",
  //   url: "링크",
  //   siteName: "플레이링크",
  //   images: [
  //     {
  //       url: "/images/퍼블릭폴더 내부 파일 이름",
  //       width: 1200,
  //       height: 630,
  //       alt: "플레이링크",
  //     },
  //   ],
  //   type: "website",
  // },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang='ko-KR' className='mx-auto h-full w-full max-w-screen-sm'>
      <body className={`${pretendard.variable} antialiased`}>
        <LayoutClientSide />
        <div className='flex h-full flex-col'>
          <div className='flex-1 px-4 pb-16 pt-20'>
            <Providers>{children}</Providers>
          </div>
          <MainBottomNavigation />
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
