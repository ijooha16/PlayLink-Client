import { PATHS } from '@/constant';
import { findAccountByPhone } from '@/libs/api/auth/find-account';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

type FindAccountByPhoneEmailType = {
  phoneNumber: string;
  email: string;
};

type ErrorCode = 0 | 1008 | 4006 | 6001 | 99999;

type AuthError = {
  response?: {
    data?: {
      errCode?: ErrorCode;
      message?: string;
      data?: any;
    };
  };
  message?: string;
  errCode?: ErrorCode;
};

type UseFindAccountOptions = {
  type: 'phone' | 'email';
  context?: 'sign-up' | 'find-id';
  isAfterVerification?: boolean;
  onAccountExists?: (accountData: any) => void;
  onAccountNotFound?: () => void;
  onNeedVerification?: () => void;
  onInvalidInput?: (message: string) => void;
  onError?: (message: string) => void;
};

export const useFindAccount = (options: UseFindAccountOptions) => {
  const router = useRouter();
  const { type, context = 'sign-up', isAfterVerification = false, onAccountExists, onAccountNotFound, onNeedVerification, onInvalidInput, onError } = options;

  // 공통 처리 로직
  const processAccountData = (errCode: ErrorCode | undefined, accountData: any) => {
    // errCode 0이면 기존 계정이 있음
    if (errCode === 0 && accountData) {
      if (context === 'find-id' && isAfterVerification) {
        // find-id에서 인증 후에는 결과 페이지로 이동
        const params = new URLSearchParams({
          email: accountData.email || '',
          nickname: accountData.nickname || '',
          createdAt: accountData.created_at || '',
          accountType: accountData.account_type?.toString() || '0',
          source: 'find-id'
        });

        router.push(`${PATHS.AUTH.FOUND}?${params.toString()}`);
      } else if (context === 'find-id') {
        // find-id에서 인증 전에는 인증번호 전송
        onAccountExists?.(accountData);
      } else {
        // sign-up에서는 바로 결과 페이지로 이동
        const params = new URLSearchParams({
          email: accountData.email || '',
          nickname: accountData.nickname || '',
          createdAt: accountData.created_at || '',
          accountType: accountData.account_type?.toString() || '0',
        });

        router.push(`${PATHS.AUTH.FOUND}?${params.toString()}`);
        onAccountExists?.(accountData);
      }
      return true;
    }

    // 다른 에러 코드 처리
    switch (errCode) {
      case 6001:
        onNeedVerification?.();
        break;
      case 1008:
        onInvalidInput?.('입력 정보에 오류가 있습니다.');
        break;
      case 4006:
        if (context === 'find-id' && isAfterVerification) {
          router.push(PATHS.AUTH.NOT_FOUND);
        } else if (context === 'find-id') {
          // find-id에서 계정이 없어도 일단 인증번호 전송
          onAccountNotFound?.();
        } else {
          onAccountNotFound?.();
        }
        break;
      case 99999:
      default:
        onAccountNotFound?.();
        break;
    }
    return false;
  };

  const handleResponse = (data: any) => {
    processAccountData(data?.errCode, data?.data);
  };

  const handleError = (error: AuthError) => {
    const errCode = error?.response?.data?.errCode || error?.errCode;
    const errorData = error?.response?.data?.data;

    processAccountData(errCode, errorData);
  };

  return useMutation<any, AuthError, FindAccountByPhoneEmailType>({
    mutationFn: findAccountByPhone,
    onSuccess: handleResponse,
    onError: handleError,
  });
};

// 인증 에러 핸들러 (SMS/Email 전송 시)
export const handleVerificationError = (
  error: Error,
  type: 'phone' | 'email'
): string => {
  const defaultMessage = type === 'phone'
    ? '인증 문자 전송에 실패했습니다.'
    : '인증 메일 전송에 실패했습니다.';

  return error.message || defaultMessage;
};