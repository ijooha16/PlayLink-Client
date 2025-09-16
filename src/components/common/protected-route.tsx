'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { handleGetSessionStorage } from '@/utills/web-api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  // 홈화면과 인증 관련 페이지는 보호하지 않음
  const publicPaths = ['/', '/sign-in', '/sign-up'];
  
  useEffect(() => {
    const checkAuth = () => {
      // 공개 페이지는 인증 체크하지 않음
      if (publicPaths.includes(pathname) || pathname.startsWith('/sign-up')) {
        setIsLoading(false);
        return;
      }

      const token = handleGetSessionStorage();
      
      if (!token) {
        console.log('토큰이 없습니다. 로그인 페이지로 이동합니다.');
        router.push('/sign-in');
        return;
      }

      // 토큰 유효성 검사 (간단한 형식 검사)
      // 추가해야함

      setIsLoading(false);
    };

    checkAuth();
  }, [router, pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
