import { backendClient } from '@/libs/http';

interface LoginRequest {
  email: string;
  password: string;
  device_id: string;
}

interface EmailRequest {
  email: string;
}

interface EmailVerifyRequest {
  email: string;
  code: string;
}

interface SMSRequest {
  phoneNumber: string;
}

interface SMSVerifyRequest {
  phoneNumber: string;
  code: string;
}

interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export const BackendAuthAPI = {
  /**
   * 백엔드 로그인
   */
  login: async (payload: LoginRequest) => {
    const response = await backendClient.post('/playlink/login', payload);
    return response;
  },

  /**
   * 백엔드 회원가입
   */
  signup: async (formData: FormData) => {
    const response = await backendClient.post('/playlink/signup', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  },

  /**
   * 이메일 인증 코드 전송
   */
  sendEmailCode: async (payload: EmailRequest) => {
    const response = await backendClient.post(
      '/playlink/signup/email',
      payload
    );
    return response;
  },

  /**
   * 이메일 인증 코드 검증
   */
  verifyEmailCode: async (payload: EmailVerifyRequest) => {
    const response = await backendClient.post(
      '/playlink/signup/email/verify',
      payload
    );
    return response;
  },

  /**
   * SMS 인증 코드 전송
   */
  sendSMSCode: async (payload: SMSRequest) => {
    const response = await backendClient.post('/playlink/signup/sms', payload);

    return response;
  },

  /**
   * SMS 인증 코드 검증
   */
  verifySMSCode: async (payload: SMSVerifyRequest) => {
    const response = await backendClient.post(
      '/playlink/signup/sms/verify',
      payload
    );
    return response;
  },

  /**
   * 비밀번호 재설정
   */
  resetPassword: async (payload: ResetPasswordRequest) => {
    const response = await backendClient.put(
      '/playlink/resetPassword',
      payload
    );
    return response;
  },

  /**
   * 아이디 찾기
   */
  findAccount: async (phoneNumber: string) => {
    const response = await backendClient.post('/playlink/find-account', {
      phoneNumber,
    });
    return response;
  },
};
