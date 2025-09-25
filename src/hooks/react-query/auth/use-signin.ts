import { Auth } from '@/libs/api/auth/auth';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

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

export const useSignin = (options: AuthOptions) => {
  return useMutation<ApiResponse<UserData>, AxiosError<ApiResponse>, Parameters<typeof Auth.SignIn>[0]>({
    mutationFn: Auth.SignIn,
    onSuccess: (data) => options.onSuccess?.(data),
    onError: (error) => options.onError?.(error),
  });
};

export const useSignUp = (options: AuthOptions) => {
  return useMutation<ApiResponse<UserData>, AxiosError<ApiResponse>, Parameters<typeof Auth.SignUp>[0]>({
    mutationFn: Auth.SignUp,
    onSuccess: (data) => options.onSuccess?.(data),
    onError: (error) => options.onError?.(error),
  });
};
