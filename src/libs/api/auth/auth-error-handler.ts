type ErrorCode = 0 | 1008 | 4006 | 6001 | 99999;

type AuthErrorHandlerOptions = {
  onAccountExists?: (message: string) => void;
  onUnverifiedAccount?: (message: string) => void;
  onInvalidInput?: (message: string) => void;
  onAccountNotFound?: () => void;
  onServerError?: () => void;
  onUnknownError?: (message: string) => void;
};

type AuthError = {
  response?: {
    data?: {
      errCode?: ErrorCode;
      message?: string;
    };
  };
  message?: string;
};

export const handleAuthError = (
  error: AuthError | any,
  type: 'phone' | 'email',
  options: AuthErrorHandlerOptions = {}
) => {
  const errCode = error?.response?.data?.errCode || error?.errCode;
  const message = error?.response?.data?.message || error?.message;

  const {
    onAccountExists,
    onUnverifiedAccount,
    onInvalidInput,
    onAccountNotFound,
    onServerError,
    onUnknownError
  } = options;

  switch (errCode) {
    case 0: {
      // 이미 가입된 계정
      const accountExistsMessage = type === 'phone'
        ? '이미 가입된 전화번호입니다.'
        : '이미 가입된 이메일입니다.';
      onAccountExists?.(accountExistsMessage);
      break;
    }

    case 6001: {
      // 인증 안됨
      const unverifiedMessage = type === 'phone'
        ? '전화번호 인증이 필요한 계정입니다.'
        : '전화번호 인증이 완료되지 않았습니다.';
      onUnverifiedAccount?.(unverifiedMessage);
      break;
    }

    case 1008:
      // body 값 오류
      onInvalidInput?.('입력 정보에 오류가 있습니다.');
      break;

    case 4006:
      // 가입된 계정 없음
      onAccountNotFound?.();
      break;

    case 99999:
      // 서버 내부 오류
      onServerError?.();
      break;

    default: {
      const defaultMessage = `가입 여부 확인 중 오류가 발생했습니다.${message ? ` (${message})` : ''}`;
      onUnknownError?.(defaultMessage);
      break;
    }
  }
};

export const handleAuthSuccess = (
  data: any,
  type: 'phone' | 'email',
  options: AuthErrorHandlerOptions = {}
) => {
  handleAuthError({ errCode: data?.errCode, message: data?.message }, type, options);
};

// 공통 SMS/Email 에러 핸들러
export const handleVerificationError = (
  error: Error,
  type: 'phone' | 'email'
): string => {
  const defaultMessage = type === 'phone'
    ? '인증 문자 전송에 실패했습니다.'
    : '인증 메일 전송에 실패했습니다.';

  return error.message || defaultMessage;
};