import TabNavigation from '@/components/features/navigation/tab-navigation';
import { ToastContainer } from '@/components/feedback/toast-alert';
import LayoutClientSide from '@/components/shared/layout-client-side';
import Providers from '@/providers/provider';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../styles/globals.css';

const pretendard = localFont({
  src: '../../public/fonts/pretendard-variable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: '플레이링크',
  description: '당신의 운동 친구! 플레이 링크에서 만나세요.',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang='ko-KR' className='mx-auto h-full w-full max-w-screen-sm'>
      <body
        className={`${pretendard.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <LayoutClientSide />
          <div className='flex h-full flex-col'>
            <div className='flex-1 overflow-hidden'>{children}</div>
            <TabNavigation />
          </div>
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
