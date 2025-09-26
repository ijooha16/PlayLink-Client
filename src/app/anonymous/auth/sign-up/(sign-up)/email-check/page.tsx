'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

import { useFindAccount } from '@/hooks/react-query/auth/use-find-account';
import { useSignUp, useSignin } from '@/hooks/react-query/auth/use-signin';
import { useVerification } from '@/hooks/react-query/auth/use-verification';

import { useInputHandlers } from '@/hooks/common/use-input-handlers';
import { useTimer } from '@/hooks/common/use-timer';

import useSignUpStore from '@/store/use-sign-up-store';

import { validateEmail, validateVerificationCode } from '@/libs/valid/auth';
import { getDeviceInfo } from '@/utills/get-device-info';

const EmailCheck = () => {
  const router = useRouter();

  const { signUp: signUpData, resetSignUp, updateSignUp } = useSignUpStore();

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  const { start, formattedTime, isTimeout } = useTimer(300);

  const {
    values,
    errors: localErrors,
    handlers,
    setError,
  } = useInputHandlers(
    {
      email: signUpData.emailCheck.email,
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

  const {
    send,
    verify,
    resend,
    errors,
    setErrors,
    isLoading,
  } = useVerification({
    type: 'email',
    onSendSuccess: () => {
      setIsCodeSent(true);
      start();
    },
    onVerifySuccess: () => {
      setIsCodeVerified(true);
    },
  });

  const { mutate: findAccount, isPending: isFindingAccount } = useFindAccount({
    type: 'email',
    context: 'sign-up',
    onAccountNotFound: () => send(values.email),
    onNeedVerification: () => send(values.email),
    onInvalidInput: (message) => setErrors({ email: message }),
    onError: (message) => setErrors({ email: message }),
  });

  const { mutate: signIn } = useSignin({
    onSuccess: () => {
      router.replace('/anonymous/auth/sign-up/welcome');
      resetSignUp();
    },
  });

  const { mutate: signUp } = useSignUp({
    onSuccess: async () => {
      const deviceInfo = await getDeviceInfo();
      signIn({
        email: signUpData.emailCheck.email,
        password: signUpData.emailCheck.password,
        device_id: deviceInfo.deviceId,
      });
    },
  });

  const handleSendCode = () => {
    const emailValidation = validateEmail(values.email);
    if (!emailValidation.isValid) {
      setError('email', emailValidation.error || '');
      return;
    }

    const phone = signUpData.phoneNumber ? signUpData.phoneNumber.replace(/[^0-9]/g, '') : '';

    if (phone) {
      findAccount({ phoneNumber: phone, email: values.email });
      return;
    }

    send(values.email);
  };

  const handleVerifyCode = () => {
    const codeValidation = validateVerificationCode(values.code);
    if (!codeValidation.isValid) {
      setError('code', codeValidation.error || '');
      return;
    }
    verify(values.email, values.code.trim());
  };

  const handleComplete = async () => {
    const deviceInfo = await getDeviceInfo();

    updateSignUp('emailCheck', {
      email: values.email,
      password: values.password,
      passwordCheck: values.confirmPassword,
    });

    signUp({
      email: values.email,
      password: values.password,
      passwordCheck: values.confirmPassword,
      device_id: deviceInfo.deviceId,
      device_type: String(deviceInfo.deviceType),
      platform: String(deviceInfo.platform),
      name: '익명',
      phoneNumber: signUpData.phoneNumber || '',
      account_type: '0',
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
          label='이메일'
          placeholder='이메일을 입력해주세요.'
          value={values.email}
          onChange={handlers.email}
          hasError={Boolean(displayErrors.email)}
          errorMessage={displayErrors.email || ''}
          showCancelToggle={Boolean(values.email) && !isCodeSent}
          disabled={isCodeSent}
        />

        {isCodeSent && (
          <Input
            label='인증번호'
            variant='splited'
            placeholder='인증번호 6자리를 입력해주세요'
            value={values.code}
            onChange={handlers.code}
            hasError={Boolean(displayErrors.code) || isTimeout}
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
              const be = e;
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
              hasError={Boolean(displayErrors.password)}
              errorMessage={displayErrors.password || ''}
              helperText={values.password ? '' : '영문, 숫자, 특수문자 조합 8~16자'}
              showCancelToggle={Boolean(values.password)}
              showPasswordToggle
            />
            <Input
              label='비밀번호 확인'
              type='password'
              placeholder='비밀번호를 다시 입력해주세요'
              value={values.confirmPassword}
              onChange={handlers.confirmPassword}
              hasError={Boolean(displayErrors.confirmPassword)}
              errorMessage={displayErrors.confirmPassword || ''}
              showCancelToggle={Boolean(values.confirmPassword)}
              showPasswordToggle
            />
          </div>
        )}
      </div>

      <Button
        isFloat
        disabled={
          isCodeVerified
            ? !values.password || !values.confirmPassword || Boolean(displayErrors.password) || Boolean(displayErrors.confirmPassword)
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

export default EmailCheck;
