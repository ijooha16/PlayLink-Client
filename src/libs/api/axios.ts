import { PATHS } from '@/constant/paths';
import { useAuthStore } from '@/store/auth-store';
import axios from 'axios';

const ERROR_MESSAGES: Record<number, string> = {
  1001: '필수 항목을 모두 입력해주세요',
  1002: '올바른 이메일 형식이 아닙니다',
  1003: '이미 사용중인 이메일입니다',
  1004: '이미 사용중인 닉네임입니다',
  1005: '비밀번호 형식이 올바르지 않습니다',
  1006: '비밀번호가 일치하지 않습니다',
  1007: '사용자를 찾을 수 없습니다',
  1008: '잘못된 요청입니다',
  1009: '이미 존재하는 사용자입니다',
};

// 내부 API 라우트용 (/api/...)
export const apiClient = axios.create({
  timeout: 10000,
});

// 외부 백엔드용 (NEXT_PUBLIC_DB_URL/...)
export const backendClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DB_URL,
  timeout: 10000,
});

const addInterceptors = (instance: any) => {
  // Request interceptor
  instance.interceptors.request.use((config: any) => {
    const token = useAuthStore.getState().token;
    if (token) {
      // 이미 Bearer로 시작하는지 확인
      config.headers.Authorization = token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor
  instance.interceptors.response.use(
    (res: any) => res,
    (err: any) => {
      const code = err.response?.data?.code;
      if (code && ERROR_MESSAGES[code]) {
        err.message = ERROR_MESSAGES[code];
      }
      if (err.response?.status === 401) {
        window.location.href = PATHS.SPLASH;
      }
      return Promise.reject(err);
    }
  );
};

addInterceptors(apiClient);
addInterceptors(backendClient);

export default apiClient;
