'use client';

import AuthLayoutContainer from '@/components/layout/auth-layout';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { PATHS } from '@/constant/paths';
import { useTimer } from '@/hooks/common/use-timer';
import { useFindAccountByPhoneEmail } from '@/hooks/react-query/auth/use-find-account';
import { useEmail } from '@/hooks/react-query/email/useEmail';
import { useEmailVerify } from '@/hooks/react-query/email/useEmailVerify';
import { useSignUpNavigation } from '@/hooks/use-sign-up-navigation';
import {
  handleAuthError,
  handleAuthSuccess,
  handleVerificationError,
} from '@/libs/api/auth/auth-error-handler';
import { validateEmail, validatePassword, validatePasswordConfirm, validateVerificationCode } from '@/libs/valid/auth';
import { useSignUpStepStore } from '@/store/sign-up-store';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const EmailCheck = () => {
  const router = useRouter();
  const { data, updateStep } = useSignUpStepStore();
  const { goToNext, currentStepTitle } = useSignUpNavigation({
    currentStep: 'email-check',
  });
  const [email, setEmail] = useState(data.email || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [passwordState, setPasswordState] = useState({
    password: '',
    confirmPassword: '',
  });
  const { start, formattedTime, isTimeout } = useTimer(300); // 5분
  const [errors, setErrors] = useState<{
    email?: string;
    code?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

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

        handleAuthSuccess(data, 'email', {
          onAccountExists: (message) => setErrors({ email: message }),
          onUnverifiedAccount: (message) => setErrors({ email: message }),
          onInvalidInput: (message) => setErrors({ email: message }),
          onAccountNotFound: () => emailSend({ email }),
          onServerError: () => emailSend({ email }),
          onUnknownError: () => emailSend({ email }),
        });
      },
      onError: (err: any) => {
        console.log('Find account error:', err);
        handleAuthError(err, 'email', {
          onAccountExists: (message) => setErrors({ email: message }),
          onUnverifiedAccount: (message) => setErrors({ email: message }),
          onInvalidInput: (message) => setErrors({ email: message }),
          onAccountNotFound: () => emailSend({ email }),
          onServerError: () => emailSend({ email }),
          onUnknownError: (message) => setErrors({ email: message }),
        });
      },
    },
    email: {
      onSuccess: () => {
        setIsCodeSent(true);
        setErrors({});
        start();
        alert('인증번호를 발송하였습니다.');
      },
      onError: (err: Error) => {
        const errorMessage = handleVerificationError(err, 'email');
        setErrors({ email: errorMessage });
      },
    },
    verify: {
      onSuccess: (data?: { status: string }) => {
        if (data?.status !== 'error') {
          setErrors({});
          setIsCodeVerified(true);
        } else {
          setErrors({ code: '인증번호가 올바르지 않습니다.' });
        }
      },
      onError: () => {
        setErrors({ code: '인증번호가 올바르지 않습니다.' });
      },
    },
  };

  // 가입 여부 조회
  const { mutate: findAccount, isPending: isFindingAccount } =
    useFindAccountByPhoneEmail(handlers.findAccount);

  // 이메일 인증코드 전송
  const { mutate: emailSend, isPending: isEmailSending } = useEmail(
    handlers.email
  );

  // 이메일 인증코드 확인
  const { mutate: emailVerify, isPending: isEmailVerifying } = useEmailVerify(
    handlers.verify
  );

  const handleSendCode = () => {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setErrors({ email: emailValidation.error });
      return;
    }

    // 전화번호가 있으면 함께 조회, 없으면 이메일만 조회
    if (data.phone) {
      const sanitizedPhone = data.phone.replace(/[^0-9]/g, '');
      findAccount({ phoneNumber: sanitizedPhone, email });
    } else {
      // 전화번호가 없는 경우 바로 인증번호 전송
      emailSend({ email });
    }
  };

  const handleResendCode = () => {
    start(); // 타이머 재시작
    emailSend({ email });
  };

  const handleVerifyCode = () => {
    const codeValidation = validateVerificationCode(verificationCode);
    if (!codeValidation.isValid) {
      setErrors({ code: codeValidation.error });
      return;
    }
    emailVerify({ email, code: verificationCode.trim() });
  };


  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPasswordState((prev) => ({ ...prev, password: newPassword }));

    const passwordValidation = validatePassword(newPassword);
    setErrors((prev) => ({ ...prev, password: passwordValidation.error }));

    // 비밀번호 확인 필드도 다시 검증
    if (passwordState.confirmPassword) {
      const confirmValidation = validatePasswordConfirm(newPassword, passwordState.confirmPassword);
      setErrors((prev) => ({ ...prev, confirmPassword: confirmValidation.error }));
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newConfirmPassword = e.target.value;
    setPasswordState((prev) => ({
      ...prev,
      confirmPassword: newConfirmPassword,
    }));

    const confirmValidation = validatePasswordConfirm(passwordState.password, newConfirmPassword);
    setErrors((prev) => ({ ...prev, confirmPassword: confirmValidation.error }));
  };

  return (
    <AuthLayoutContainer title={currentStepTitle}>

        <div className='flex flex-col gap-s-16 pb-[24px]'>
          <Input
            label='이메일 주소'
            variant='default'
            sizes='lg'
            placeholder='playlink@example.com'
            value={email}
            showCancelToggle={!!email && !isCodeSent}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            hasError={!!errors.email}
            errorMessage={errors.email || ''}
            disabled={isCodeSent}
          />

        {isCodeSent && (
          <Input
            label='인증번호'
            variant='splited'
            sizes='lg'
            placeholder='인증번호 6자리를 입력해주세요'
            value={verificationCode}
            onChange={(e) => {
              setVerificationCode(e.target.value);
              setErrors((prev) => ({ ...prev, code: undefined }));
            }}
            hasError={!!errors.code || isTimeout}
            errorMessage={errors.code || (isTimeout ? '인증번호를 다시 보내주세요.' : '')}
            disabled={isCodeVerified}
            timer={formattedTime}
            splitedRightElement={
              <button
                onClick={handleResendCode}
                className='text-primary-800 text-label-l font-semibold px-4'
                disabled={isEmailSending}
              >
                재전송
              </button>
            }
            maxLength={6}
            inputMode='numeric'
            onBeforeInput={(e) => {
              const be = e as unknown as InputEvent;
              if (be.data && /[^\d]/.test(be.data)) {
                e.preventDefault();
              }
            }}
          />
        )}

        {isCodeVerified && (
          <div className='flex flex-col gap-s-24'>
            <Input
              label='비밀번호'
              type='password'
              variant='default'
              sizes='lg'
              placeholder='비밀번호를 입력해주세요'
              value={passwordState.password}
              onChange={handlePasswordChange}
              hasError={!!errors.password}
              errorMessage={errors.password || ''}
              helperText={passwordState.password.length === 0 ? '영문, 숫자, 특수문자 조합 8~16자' : ''}
              showCancelToggle={!!passwordState.password}
              showPasswordToggle={true}
            />

            <Input
              label='비밀번호 확인'
              type='password'
              variant='default'
              sizes='lg'
              placeholder='비밀번호를 다시 입력해주세요'
              value={passwordState.confirmPassword}
              onChange={handleConfirmPasswordChange}
              hasError={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword || ''}
              showCancelToggle={!!passwordState.confirmPassword}
              showPasswordToggle={true}
            />
          </div>
        )}
      </div>

      {!isCodeVerified ? (
        <Button
          variant='default'
          size='base'
          fontSize='lg'
          isFloat
          disabled={
            (!isCodeSent && (!email || isEmailSending || isFindingAccount)) ||
            (isCodeSent && (verificationCode.length !== 6 || isEmailVerifying))
          }
          onClick={!isCodeSent ? handleSendCode : handleVerifyCode}
        >
          {!isCodeSent
            ? (isFindingAccount
                ? '가입 여부 확인 중...'
                : isEmailSending
                  ? '전송 중...'
                  : '인증번호 받기')
            : (isEmailVerifying ? '확인 중...' : '인증 확인')
          }
        </Button>
      ) : (
        <Button
          variant='default'
          size='base'
          fontSize='lg'
          isFloat
          disabled={
            !passwordState.password ||
            !passwordState.confirmPassword ||
            !!errors.password ||
            !!errors.confirmPassword
          }
          onClick={() => {
            updateStep({
              email,
              password: passwordState.password,
              confirmPassword: passwordState.confirmPassword,
            });
            goToNext();
          }}
        >
          다음
        </Button>
      )}
    </AuthLayoutContainer>

  );
};

export default EmailCheck;
