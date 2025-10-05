import { API_URLS } from '@/constant/api-urls';
import { apiClient } from '@/libs/http';
import { useAuthStore } from '@/store/auth-store';

interface SignInType {
  email: string;
  password: string;
  device_id: string;
}

interface SignUpType {
  name: string;
  // nickname: string;
  email: string;
  password: string;
  passwordCheck: string;
  phoneNumber: string;
  platform: string;
  device_id: string;
  device_type: string;
  account_type: string;
  // favor: string;
  // img: File;
}

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

export const Auth = {
  SignIn: async (req: SignInType): Promise<ApiResponse<UserData>> => {
    const { data } = await apiClient.post<ApiResponse<UserData>>(API_URLS.AUTH.SIGNIN, req);

    // Zustand store에 토큰 저장 (메모리)
    if (data.status === 'success' && data.accessToken) {
      useAuthStore.getState().setAuth(data.accessToken, data.data);
    }

    // HttpOnly 쿠키는 서버에서 자동 설정됨
    return data;
  },

  SignUp: async (signupData?: SignUpType): Promise<ApiResponse<UserData>> => {
    const formData = new FormData();
    Object.entries(signupData || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const { data } = await apiClient.post<ApiResponse<UserData>>(API_URLS.AUTH.SIGNUP, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  Logout: async (): Promise<ApiResponse> => {
    const { data } = await apiClient.post<ApiResponse>(API_URLS.AUTH.LOGOUT);

    // Zustand store 초기화
    useAuthStore.getState().clearAuth();

    return data;
  }
};
