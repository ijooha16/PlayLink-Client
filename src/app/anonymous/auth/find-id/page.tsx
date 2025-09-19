'use client';

import PhoneVerification from '@/components/forms/phone-verification';
import AuthLayoutContainer from '@/components/layout/auth-layout';
import { useFindAccountByPhone } from '@/hooks/react-query/auth/use-find-account';
import { useSms } from '@/hooks/react-query/sms/useSms';
import { useSmsVerify } from '@/hooks/react-query/sms/useSmsVerify';
import {
  handleAuthError,
  handleAuthSuccess,
  handleVerificationError,
} from '@/libs/api/auth/auth-error-handler';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const FindId = () => {
  const router = useRouter();
  const [customErrors, setCustomErrors] = useState<{
    phone?: string;
    code?: string;
  }>({});
  const [currentPhone, setCurrentPhone] = useState('');

  // API 응답 핸들러
  const handlers = {
    findAccount: {
      onSuccess: (data: any) => {
        console.log('Find account success:', data);

        // errCode 0이면 계정을 찾았음 - 아이디 표시 페이지로 이동
        if (data.errCode === 0 && data.data) {
          const params = new URLSearchParams({
            email: data.data.email || '',
            nickname: data.data.nickname || '',
            createdAt: data.data.created_at || '',
            accountType: data.data.account_type?.toString() || '0',
            source: 'find-id',
          });
          router.push(`/anonymous/auth/sign-up/account-exists?${params.toString()}`);
          return;
        }

        handleAuthSuccess(data, 'phone', {
          onAccountExists: () => smsSend({ phoneNumber: currentPhone }),
          onUnverifiedAccount: () => smsSend({ phoneNumber: currentPhone }),
          onInvalidInput: (message) => setCustomErrors({ phone: message }),
          onAccountNotFound: (message) => setCustomErrors({ phone: message }),
          onServerError: () => smsSend({ phoneNumber: currentPhone }),
          onUnknownError: () => smsSend({ phoneNumber: currentPhone }),
        });
      },
      onError: (err: any) => {
        console.log('Find account error:', err);

        handleAuthError(err, 'phone', {
          onAccountExists: () => smsSend({ phoneNumber: currentPhone }),
          onUnverifiedAccount: () => smsSend({ phoneNumber: currentPhone }),
          onInvalidInput: (message) => setCustomErrors({ phone: message }),
          onAccountNotFound: (message) => setCustomErrors({ phone: message }),
          onServerError: () => smsSend({ phoneNumber: currentPhone }),
          onUnknownError: (message) => setCustomErrors({ phone: message }),
        });
      },
    },
    sms: {
      onSuccess: () => {
        setCustomErrors({});
        alert('인증번호를 발송하였습니다.');
      },
      onError: (err: Error) => {
        const errorMessage = handleVerificationError(err, 'phone');
        setCustomErrors({ phone: errorMessage });
      },
    },
    verify: {
      onSuccess: (data?: { status: string }) => {
        if (data?.status === 'success') {
          setCustomErrors({});
          // 인증 완료 후 계정 정보 조회
          findAccount({ phoneNumber: currentPhone });
        } else {
          setCustomErrors({ code: '인증번호가 올바르지 않습니다.' });
        }
      },
      onError: () => {
        setCustomErrors({ code: '인증번호가 올바르지 않습니다.' });
      },
    },
  };

  // 가입 여부 조회
  const { mutate: findAccount, isPending: isFindingAccount } =
    useFindAccountByPhone(handlers.findAccount);

  // SMS 인증코드 전송
  const { mutate: smsSend, isPending: isSmsSending } = useSms(handlers.sms);

  // SMS 인증코드 확인
  const { mutate: smsVerify, isPending: isSmsVerifying } = useSmsVerify(
    handlers.verify
  );

  const handleSendCode = (phoneNumber: string) => {
    setCurrentPhone(phoneNumber);
    // 가입 여부 확인 후 인증번호 전송
    findAccount({ phoneNumber });
  };

  const handleVerifyCode = (phoneNumber: string, code: string) => {
    smsVerify({
      phoneNumber,
      code,
    });
  };

  const handleResendCode = (phoneNumber: string) => {
    smsSend({ phoneNumber });
  };

  return (
    <>
      <AuthLayoutContainer
        title={'가입하신 계정의 \n 휴대폰 번호를 입력해 주세요!'}
      >
        <PhoneVerification
          onSendCode={handleSendCode}
          onVerifyCode={handleVerifyCode}
          onResendCode={handleResendCode}
          onPhoneChange={setCurrentPhone}
          isLoading={{
            finding: isFindingAccount,
            sending: isSmsSending,
            verifying: isSmsVerifying,
          }}
          customErrors={customErrors}
          buttonText={{
            send: '인증번호 받기',
            verify: '확인',
            resend: '재전송',
          }}
        />
      </AuthLayoutContainer>
    </>
  );
};

export default FindId;