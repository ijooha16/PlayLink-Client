'use client';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useInputHandlers } from '@/hooks/common/use-input-handlers';
import { useTimer } from '@/hooks/common/use-timer';
import { useFindAccount } from '@/hooks/react-query/auth/use-find-account';
import { useVerification } from '@/hooks/react-query/auth/use-verification';
import { validateEmail, validateVerificationCode } from '@/libs/valid/auth';
import React, { useState } from 'react';
import { useSignUpStepStore } from '@/store/sign-up-store';

interface EmailVerificationProps {
  initialEmail?: string;
  phoneNumber?: string;
  onSuccess?: (data: { email: string; password: string; confirmPassword: string }) => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  initialEmail = '',
  phoneNumber,
  onSuccess,
}) => {
  const { data: storeData } = useSignUpStepStore();

  // phoneNumber prop이 없으면 store에서 가져오기
  const actualPhoneNumber = phoneNumber || storeData.phone;

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const { start, formattedTime, isTimeout } = useTimer(300);

  const { values, errors: localErrors, handlers, setError } = useInputHandlers(
    {
      email: initialEmail,
      code: '',
      password: '',
      confirmPassword: '',
    },
    {
      email: { type: 'text' },
      code: { type: 'text' },
      password: { type: 'password' },
      confirmPassword: { type: 'confirmPassword' },
    }
  );

  // 이메일 인증 hook
  const { send, verify, resend, errors, setErrors, isLoading } = useVerification({
    type: 'email',
    onSendSuccess: () => {
      setIsCodeSent(true);
      start();
    },
    onVerifySuccess: () => {
      setIsCodeVerified(true);
    },
  });

  // 계정 조회 hook
  const { mutate: findAccount, isPending: isFindingAccount } = useFindAccount({
    type: 'email',
    context: 'sign-up',
    onAccountNotFound: () => send(values.email),
    onNeedVerification: () => send(values.email),
    onInvalidInput: (message) => setErrors({ email: message }),
    onError: (message) => setErrors({ email: message }),
  });

  const handleSendCode = () => {
    const emailValidation = validateEmail(values.email);
    if (!emailValidation.isValid) {
      setError('email', emailValidation.error || '');
      return;
    }

    if (actualPhoneNumber) {
      const sanitizedPhone = actualPhoneNumber.replace(/[^0-9]/g, '');
      findAccount({ phoneNumber: sanitizedPhone, email: values.email });
    } else {
      send(values.email);
    }
  };

  const handleVerifyCode = () => {
    const codeValidation = validateVerificationCode(values.code);
    if (!codeValidation.isValid) {
      setError('code', codeValidation.error || '');
      return;
    }
    verify(values.email, values.code.trim());
  };

  const handleComplete = () => {
    onSuccess?.({
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
  };

  const displayErrors = {
    email: errors.email || localErrors.email,
    code: errors.code || localErrors.code,
    password: localErrors.password,
    confirmPassword: localErrors.confirmPassword,
  };

  return (
    <>
      <div className='flex flex-col gap-s-16 pb-[24px]'>
        <Input
          label='이메일 주소'
          placeholder='playlink@example.com'
          value={values.email}
          onChange={handlers.email}
          hasError={!!displayErrors.email}
          errorMessage={displayErrors.email || ''}
          showCancelToggle={!!values.email && !isCodeSent}
          disabled={isCodeSent}
        />

        {isCodeSent && (
          <Input
            label='인증번호'
            variant='splited'
            placeholder='인증번호 6자리를 입력해주세요'
            value={values.code}
            onChange={handlers.code}
            hasError={!!displayErrors.code || isTimeout}
            errorMessage={displayErrors.code || (isTimeout ? '인증번호를 다시 보내주세요.' : '')}
            disabled={isCodeVerified}
            timer={formattedTime}
            maxLength={6}
            inputMode='numeric'
            splitedRightElement={
              <button
                onClick={() => { start(); resend(values.email); }}
                className='text-primary-800 text-label-l font-semibold'
                disabled={isLoading.sending}
              >
                재전송
              </button>
            }
            onBeforeInput={(e) => {
              const be = e as unknown as InputEvent;
              if (be.data && /[^\d]/.test(be.data)) e.preventDefault();
            }}
          />
        )}

        {isCodeVerified && (
          <div className='flex flex-col gap-s-24'>
            <Input
              label='비밀번호'
              type='password'
              placeholder='비밀번호를 입력해주세요'
              value={values.password}
              onChange={handlers.password}
              hasError={!!displayErrors.password}
              errorMessage={displayErrors.password || ''}
              helperText={!values.password ? '영문, 숫자, 특수문자 조합 8~16자' : ''}
              showCancelToggle={!!values.password}
              showPasswordToggle
            />
            <Input
              label='비밀번호 확인'
              type='password'
              placeholder='비밀번호를 다시 입력해주세요'
              value={values.confirmPassword}
              onChange={handlers.confirmPassword}
              hasError={!!displayErrors.confirmPassword}
              errorMessage={displayErrors.confirmPassword || ''}
              showCancelToggle={!!values.confirmPassword}
              showPasswordToggle
            />
          </div>
        )}
      </div>

      <Button
        isFloat
        disabled={
          isCodeVerified
            ? !values.password || !values.confirmPassword || !!displayErrors.password || !!displayErrors.confirmPassword
            : !isCodeSent
              ? !values.email || isLoading.sending || isFindingAccount
              : values.code.length !== 6 || isLoading.verifying
        }
        onClick={isCodeVerified ? handleComplete : !isCodeSent ? handleSendCode : handleVerifyCode}
      >
        {isCodeVerified
          ? '다음'
          : !isCodeSent
            ? (isFindingAccount ? '가입 여부 확인 중...' : isLoading.sending ? '전송 중...' : '인증번호 받기')
            : (isLoading.verifying ? '확인 중...' : '인증 확인')}
      </Button>
    </>
  );
};

export default EmailVerification;