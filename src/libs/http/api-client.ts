import { PATHS } from '@/constant';
import { useAuthStore } from '@/store/auth-store';
import { toast } from '@/utills/toast';
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

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
