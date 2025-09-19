import { apiClient } from '@/libs/api/axios';
import { useAuthStore } from '@/store/auth-store';
import { API_URLS } from '@/constant/api-urls';

interface SignInType {
  email: string;
  password: string;
  device_id: string;
}

interface SignUpType {
  name: string;
  nickname: string;
  email: string;
  password: string;
  passwordCheck: string;
  phoneNumber: string;
  platform: string;
  device_id: string;
  device_type: string;
  account_type: string;
  favor: string;
  img: File;
}

export const fetchSignIn = async (req: SignInType) => {
  const { data } = await apiClient.post(API_URLS.AUTH.SIGNIN, req);

  // Zustand store에 토큰 저장 (메모리)
  if (data.status === 'success' && data.accessToken) {
    useAuthStore.getState().setAuth(data.accessToken, data.data);
  }

  // HttpOnly 쿠키는 서버에서 자동 설정됨
  return data;
};

export const fetchSignUp = async (signupData: SignUpType) => {
  const formData = new FormData();
  Object.entries(signupData).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });

  const { data } = await apiClient.post(API_URLS.AUTH.SIGNUP, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const fetchLogout = async () => {
  const { data } = await apiClient.post(API_URLS.AUTH.LOGOUT);

  // Zustand store 초기화
  useAuthStore.getState().clearAuth();

  return data;
};
