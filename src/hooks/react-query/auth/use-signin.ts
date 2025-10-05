'use client';

import { PATHS } from '@/constant';
import { Auth } from '@/libs/api/frontend/auth/auth';
import { toast } from '@/utills/toast';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

// API 응답 타입 정의
interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  accessToken?: string;
}

interface UserData {
  id: string;
  email: string;
  name: string;
  nickname?: string;
  phoneNumber?: string;
  img_url?: string;
}

interface AuthOptions {
  onSuccess?: (data: ApiResponse<UserData>) => void;
  onError?: (error: AxiosError<ApiResponse>) => void;
}

export const useSignin = (options: AuthOptions = {}) => {
  const router = useRouter();

  return useMutation<
    ApiResponse<UserData>,
    AxiosError<ApiResponse>,
    Parameters<typeof Auth.SignIn>[0]
  >({
    mutationFn: Auth.SignIn,
    onSuccess: (data) => {
      if (options.onSuccess) {
        options.onSuccess(data);
        return;
      }

      router.replace(PATHS.HOME);
      toast.success('로그인 성공!');
    },
    onError: (error) => {
      if (options.onError) {
        options.onError(error);
        return;
      }

      console.error('로그인 실패:', error?.message ?? error);
      toast.error('이메일 또는 비밀번호가 일치하지 않아요!');
    },
  });
};

export const useSignUp = (options: AuthOptions) => {
  return useMutation<
    ApiResponse<UserData>,
    AxiosError<ApiResponse>,
    Parameters<typeof Auth.SignUp>[0]
  >({
    mutationFn: Auth.SignUp,
    onSuccess: (data) => options.onSuccess?.(data),
    onError: (error) => options.onError?.(error),
  });
};
