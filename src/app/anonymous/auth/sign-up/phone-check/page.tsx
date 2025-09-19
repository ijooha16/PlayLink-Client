'use client';

import PhoneVerification from '@/components/forms/phone-verification';
import AuthLayoutContainer from '@/components/layout/auth-layout';
import { PATHS } from '@/constant/paths';
import { useFindAccountByPhone } from '@/hooks/react-query/auth/use-find-account';
import { useSms } from '@/hooks/react-query/sms/useSms';
import { useSmsVerify } from '@/hooks/react-query/sms/useSmsVerify';
import { useSignUpNavigation } from '@/hooks/use-sign-up-navigation';
import {
  handleAuthError,
  handleAuthSuccess,
  handleVerificationError,
} from '@/libs/api/auth/auth-error-handler';
import { useSignUpStepStore } from '@/store/sign-up-store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const PhoneCheck = () => {
  const router = useRouter();
  const { data, updateStep } = useSignUpStepStore();
  const { goToNext, currentStepTitle } = useSignUpNavigation({
    currentStep: 'phone-check',
  });
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

        // errCode 0이면 기존 계정이 있음 - account-exists 페이지로 이동
        if (data.errCode === 0 && data.data) {
          const params = new URLSearchParams({
            nickname: data.data.nickname || '',
            email: data.data.email || '',
            accountType: data.data.account_type?.toString() || '0',
            createdAt: data.data.created_at || '',
          });
          router.push(
            `${PATHS.AUTH.SIGN_UP}/account-exists?${params.toString()}`
          );
          return;
        }

        handleAuthSuccess(data, 'phone', {
          onAccountExists: (message) => {
            // 이미 가입된 계정일 경우 account-exists 페이지로 이동
            const params = new URLSearchParams({
              nickname: data.data?.nickname || '',
              email: data.data?.email || '',
              accountType: data.data?.account_type?.toString() || '0',
              createdAt: data.data?.created_at || '',
            });
            router.push(
              `${PATHS.AUTH.SIGN_UP}/account-exists?${params.toString()}`
            );
          },
          onUnverifiedAccount: () => smsSend({ phoneNumber: currentPhone }),
          onInvalidInput: (message) => setCustomErrors({ phone: message }),
          onAccountNotFound: (message) => smsSend({ phoneNumber: currentPhone }),
          onServerError: () => smsSend({ phoneNumber: currentPhone }),
          onUnknownError: () => smsSend({ phoneNumber: currentPhone }),
        });
      },
      onError: (err: any) => {
        console.log('Find account error:', err);

        handleAuthError(err, 'phone', {
          onAccountExists: (message) => {
            // 이미 가입된 계정일 경우 account-exists 페이지로 이동
            const params = new URLSearchParams({
              nickname: err.response?.data?.data?.nickname || '',
              email: err.response?.data?.data?.email || '',
              accountType: err.response?.data?.data?.account_type?.toString() || '0',
              createdAt: err.response?.data?.data?.created_at || '',
            });
            router.push(
              `${PATHS.AUTH.SIGN_UP}/account-exists?${params.toString()}`
            );
          },
          onUnverifiedAccount: () => smsSend({ phoneNumber: currentPhone }),
          onInvalidInput: (message) => setCustomErrors({ phone: message }),
          onAccountNotFound: (message) => smsSend({ phoneNumber: currentPhone }),
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
          updateStep({
            phone: currentPhone,
            phoneVerified: true,
          });
          goToNext();
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
    <AuthLayoutContainer title={currentStepTitle}>
      <PhoneVerification
        initialPhone={data.phone}
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
          verify: '다음',
          resend: '재전송',
        }}
      />
    </AuthLayoutContainer>
  );
};

export default PhoneCheck;