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
    <html lang='ko-KR' className='h-full w-full'>
      <body className={`${pretendard.variable} antialiased`}>{children}</body>
    </html>
  );
};

export default RootLayout;
