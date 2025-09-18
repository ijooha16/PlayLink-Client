import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../styles/globals.css';
import LayoutClientSide from '@/components/view/main/layout-client-side';
import Providers from './provider';
import MainBottomNavigation from '@/components/view/main/main-bottom-navigation';
import ProtectedRoute from '@/components/common/protected-route';
import { ToastContainer } from '@/components/common/toast-alert';

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
      <body className={`${pretendard.variable} antialiased`}>
        <LayoutClientSide />
        <div className='flex h-full flex-col'>
          <div className='flex-1 px-5 pb-16 pt-s-24'>
            <Providers>
              <ProtectedRoute>{children}</ProtectedRoute>
            </Providers>
          </div>
          <MainBottomNavigation />
        </div>
        <ToastContainer />
      </body>
    </html>
  );
};

export default RootLayout;
