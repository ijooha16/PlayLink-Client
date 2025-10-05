import { PATHS } from '@/constant';
import { PLAYLINK_AUTH } from '@/constant/cookie';
import { useAuthStore } from '@/store/auth-store';
import { logger } from '@/utills/logger';
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
 * 외부 백엔드용 클라이언트 (NEXT_PUBLIC_DB_URL/...)
 */
export const backendClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DB_URL,
  timeout: 10000,
  withCredentials: true,
});

// Request interceptor
backendClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let token: string | undefined;

    // 서버사이드(API routes)에서는 쿠키에서, 클라이언트사이드에서는 store에서 토큰 가져오기
    if (typeof window === 'undefined') {
      // 서버사이드 - 쿠키에서 토큰 읽기 (동적 import로 클라이언트 번들에서 제외)
      try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        token = cookieStore.get(PLAYLINK_AUTH)?.value ?? undefined;
      } catch (error) {
        // cookies()를 호출할 수 없는 컨텍스트 (예: middleware)
        logger.warn('Failed to read cookies in backend-client', { error });
      }
    } else {
      // 클라이언트사이드 - store에서 토큰 가져오기
      token = useAuthStore.getState().token ?? undefined;
    }

    if (token && config.headers) {
      config.headers.Authorization = token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`;
    }

    // 백엔드 요청 로깅
    const method = config.method?.toUpperCase() || 'UNKNOWN';
    const url = config.url || '';
    logger.info('Backend request', { method, url });

    return config;
  },
  (error: unknown) => {
    logger.error('Backend request failed', { error });
    return Promise.reject(error);
  }
);

// Response interceptor
backendClient.interceptors.response.use(
  (res: AxiosResponse) => {
    // 백엔드 응답 로깅
    const method = res.config.method?.toUpperCase() || 'UNKNOWN';
    const url = res.config.url || '';
    const status = res.status;
    logger.info('Backend response', { method, url, status });

    return res;
  },
  (err: AxiosError<{ code?: number; message?: string }>) => {
    const method = err.config?.method?.toUpperCase() || 'UNKNOWN';
    const url = err.config?.url || '';
    const status = err.response?.status;
    const code = err.response?.data?.code;
    const message = err.response?.data?.message;

    // 에러 로깅
    logger.error('Backend error', {
      method,
      url,
      status,
      code,
      error: message || err.message,
    });

    // 커스텀 에러 메시지 매핑
    if (code && ERROR_MESSAGES[code]) {
      logger.warn(`Error code ${code}: ${ERROR_MESSAGES[code]}`, {
        method,
        url,
      });
    }

    // 401 에러 시 리다이렉트
    if (status === 401) {
      logger.warn('Unauthorized - redirecting to splash', { method, url });
      window.location.href = PATHS.SPLASH;
    }

    return Promise.reject(err);
  }
);

export default backendClient;
