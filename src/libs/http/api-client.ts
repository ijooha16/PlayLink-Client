import { PATHS } from '@/constant';
import { useAuthStore } from '@/store/auth-store';
import { toast } from '@/utills/toast';
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

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

/**
 * 내부 API 라우트용 클라이언트 (/api/...)
 */
export const apiClient = axios.create({
  timeout: 10000,
  withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    // 이미 Bearer로 시작하는지 확인
    config.headers.Authorization = token.startsWith('Bearer ')
      ? token
      : `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err: AxiosError<{ code?: number; message?: string }>) => {
    // 네트워크 에러 (인터넷 연결 끊김 등)
    if (!err.response) {
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        toast.error('인터넷 연결을 확인해주세요.');
      } else if (
        err.code === 'ECONNABORTED' ||
        err.message?.includes('timeout')
      ) {
        toast.error('요청 시간이 초과되었습니다.');
      }
      return Promise.reject(err);
    }

    // 401 인증 에러 처리
    if (err.response?.status === 401) {
      window.location.href = PATHS.SPLASH;
    }

    return Promise.reject(err);
  }
);

export default apiClient;
