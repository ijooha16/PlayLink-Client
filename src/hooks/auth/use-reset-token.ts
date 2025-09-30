'use client';

import { PATHS } from '@/constant';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useSessionToken = () => {
  const router = useRouter();

  const setToken = (userId: number): void => {
    const token = `reset-${Date.now()}-${Math.random()}`;
    const tokenKey = `r-pw-token-${userId}`;
    sessionStorage.setItem(tokenKey, token);
  };

  const checkToken = (userId: string): boolean => {
    const token = sessionStorage.getItem(`r-pw-token-${userId}`);
    if (!token) return false;

    sessionStorage.removeItem(`r-pw-token-${userId}`);
    return true;
  };

  const useAuth = (userId: string) => {
    useEffect(() => {
      const tokenKey = `r-pw-token-${userId}`;
      const token = sessionStorage.getItem(tokenKey);

      if (!token) {
        router.replace(PATHS.AUTH.RESET_PASSWORD);
        return;
      }
    }, [userId, router]);
  };

  return { setToken, checkToken, useAuth };
};
