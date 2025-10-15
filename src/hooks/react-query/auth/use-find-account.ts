import { PATHS } from '@/constant';
import {
  findAccountByPhone,
  findAccountByPhoneEmail,
} from '@/libs/api/frontend/auth/find-account';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

type FindAccountRequestType = {
  phoneNumber: string;
  email?: string;
  account_type: string;
};

type ErrorCode = 0 | 1008 | 4006 | 6001 | 99999;

interface AccountData {
  user_id?: number | string;
  email?: string;
  nickname?: string;
  created_at?: string;
  account_type?: number;
}

type AuthError = {
  response?: {
    data?: {
      errCode?: ErrorCode;
      message?: string;
      data?: AccountData;
    };
  };
  message?: string;
  errCode?: ErrorCode;
};

type UseFindAccountOptions = {
  type: 'phone' | 'email';
  context?: 'sign-up' | 'find-id' | 'reset-password';
  isAfterVerification?: boolean;
  onAccountExists?: (accountData: AccountData) => void;
  onAccountNotFound?: () => void;
  onNeedVerification?: (accountData?: AccountData) => void;
  onInvalidInput?: (message: string) => void;
  onError?: (message: string) => void;
};

export const useFindAccount = (options: UseFindAccountOptions) => {
  const router = useRouter();
  const {
    type,
    context = 'sign-up',
    isAfterVerification = false,
    onAccountExists,
    onAccountNotFound,
    onNeedVerification,
    onInvalidInput,
    onError,
  } = options;

  // 공통 처리 로직
  const processAccountData = (
    errCode: ErrorCode | undefined,
    accountData?: AccountData
  ) => {
    // errCode 0이면 기존 계정이 있음
    if (errCode === 0 && accountData) {
      if (context === 'find-id' && isAfterVerification) {
        // find-id에서 인증 후에는 결과 페이지로 이동
        const params = new URLSearchParams({
          email: accountData.email || '',
          nickname: accountData.nickname || '',
          createdAt: accountData.created_at || '',
          accountType: accountData.account_type?.toString() || '0',
          source: 'find-id',
        });

        router.push(`${PATHS.AUTH.FOUND}?${params.toString()}`);
      } else if (context === 'reset-password') {
        // reset-password에서는 callback으로 처리
        onAccountExists?.(accountData);
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
        // 인증이 필요한 경우
        if (context === 'sign-up') {
          onNeedVerification?.();
        } else {
          onInvalidInput?.('인증이 필요한 계정입니다.');
        }
        break;
      case 1008:
        onInvalidInput?.('입력 정보에 오류가 있습니다.');
        break;
      case 4006:
        // 계정을 찾을 수 없는 경우
        if (context === 'find-id' && isAfterVerification) {
          router.push(PATHS.AUTH.NOT_FOUND);
        } else if (context === 'reset-password') {
          onInvalidInput?.(
            '등록되지 않은 계정입니다. 회원가입을 진행해주세요.'
          );
        } else if (context === 'find-id') {
          // find-id에서 계정이 없어도 일단 인증번호 전송
          onAccountNotFound?.();
        } else if (context === 'sign-up') {
          // 회원가입 시 계정이 없으면 정상 플로우
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

  interface FindAccountResponse {
    errCode?: ErrorCode;
    data?: AccountData;
  }

  const handleResponse = (data: FindAccountResponse) => {
    processAccountData(data?.errCode, data?.data);
  };

  const handleError = (error: AuthError) => {
    const errCode = error?.response?.data?.errCode || error?.errCode;
    const errorData = error?.response?.data?.data;

    processAccountData(errCode, errorData);
  };

  return useMutation<FindAccountResponse, AuthError, FindAccountRequestType>({
    mutationFn: async (params) => {
      // email이 있으면 findAccountByPhoneEmail 호출
      if (params.email) {
        return findAccountByPhoneEmail({
          phoneNumber: params.phoneNumber,
          email: params.email,
          account_type: params.account_type,
        });
      }
      // email이 없으면 findAccountByPhone만 호출
      return findAccountByPhone({
        phoneNumber: params.phoneNumber,
        account_type: params.account_type,
      });
    },
    onSuccess: handleResponse,
    onError: handleError,
  });
};

// 인증 에러 핸들러 (SMS/Email 전송 시)
export const handleVerificationError = (
  error: Error,
  type: 'phone' | 'email'
): string => {
  const defaultMessage =
    type === 'phone'
      ? '인증 문자 전송에 실패했습니다.'
      : '인증 메일 전송에 실패했습니다.';

  return error.message || defaultMessage;
};
