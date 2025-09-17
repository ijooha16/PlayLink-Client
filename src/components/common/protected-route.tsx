'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { handleGetSessionStorage } from '@/utills/web-api';
import Loading from './loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  const publicPaths = ['/', '/sign-in', '/sign-up', '/splash'];
  
  useEffect(() => {
    // 공개 페이지는 인증 체크하지 않음
    if (publicPaths.includes(pathname) || pathname.startsWith('/sign-up')) {
      setIsLoading(false);
      return;
    }

    const token = handleGetSessionStorage();
    
    if (!token) {
      router.push('/splash');
    }
    
    setIsLoading(false);
  }, [pathname]);

  if (isLoading) {
    return <Loading variant='white' />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
