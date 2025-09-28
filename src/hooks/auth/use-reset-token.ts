'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PATHS } from '@/constant/paths';

export const useSessionToken = () => {
  const router = useRouter();

  const setToken = (userId: number): void => {
    const token = `reset-${Date.now()}-${Math.random()}`;
    sessionStorage.setItem(`r-pw-token-${userId}`, token);
  };

  const checkToken = (userId: string): boolean => {
    const token = sessionStorage.getItem(`r-pw-token-${userId}`);
    if (!token) return false;

    sessionStorage.removeItem(`r-pw-token-${userId}`);
    return true;
  };

  const useAuth = (userId: string) => {
    useEffect(() => {
      const token = sessionStorage.getItem(`r-pw-token-${userId}`);

      if (!token) {
        router.replace(PATHS.AUTH.RESET_PASSWORD);
        return;
      }

      sessionStorage.removeItem(`r-pw-token-${userId}`);
    }, [userId, router]);
  };

  return { setToken, checkToken, useAuth };
};