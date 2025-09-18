'use client';

import { apiClient } from '@/libs/api/axios';
import { useAuthStore } from '@/store/auth-store';
import { useEffect } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 앱 시작 시 쿠키에서 토큰 읽어서 store에 설정
    const checkAuth = async () => {
      try {
        const response = await apiClient.get('/api/auth/check');
        const data = response.data;

        if (data.authenticated && data.token) {
          // 쿠키에 토큰이 있으면 store에 동기화
          useAuthStore.getState().setAuth(data.token);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, []);

  return <>{children}</>;
}