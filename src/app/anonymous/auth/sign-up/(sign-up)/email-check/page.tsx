'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

import { Input } from '@/components/forms/input';
import Button from '@/components/ui/button';
import { Check } from '@/components/shared/icons';

import { useTimer } from '@/hooks/common/use-timer';
import { useFindAccount } from '@/hooks/react-query/auth/use-find-account';
import { useSignUp, useSignin } from '@/hooks/react-query/auth/use-signin';
import { useVerification } from '@/hooks/react-query/auth/use-verification';

import useSignUpStore from '@/store/use-sign-up-store';

import { getDeviceInfo } from '@/utills/get-device-info';

const EmailCheck = () => {
  const router = useRouter();
  const { signUp: signUpData, resetSignUp, updateSignUp } = useSignUpStore();

  const [email, setEmail] = useState(signUpData.emailCheck.email);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmValid, setIsConfirmValid] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

  const { start, stop, formattedTime, isTimeout } = useTimer(300);

  const trimmedEmail = email.trim();
  const trimmedCode = code.trim();
  const trimmedPassword = password.trim();
  const trimmedConfirmPassword = confirmPassword.trim();


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
      // 코드 입력 필드로 포커스 이동
      setTimeout(() => {
        codeInputRef.current?.focus();
      }, 100);
    },
    onVerifySuccess: () => {
      setIsCodeVerified(true);
      stop(); // 인증 성공 시 타이머 중지
      // 비밀번호 입력 필드로 포커스 이동
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100);
    },
  });

  const { mutate: findAccount, isPending: isFindingAccount } = useFindAccount({
    type: 'email',
    context: 'sign-up',
    onAccountNotFound: () => {
      setIsEmailVerified(true);
      send(trimmedEmail);
    },
    onNeedVerification: () => {
      setIsEmailVerified(true);
      send(trimmedEmail);
    },
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
    if (!isEmailValid) return;
    const phone = signUpData.phoneNumber ? signUpData.phoneNumber.replace(/[^0-9]/g, '') : '';

    if (phone) {
      findAccount({ phoneNumber: phone, email });
      return;
    }

    send(trimmedEmail);
  };

  const handleVerifyCode = () => {
    if (!isCodeValid) return;
    verify(trimmedEmail, trimmedCode);
  };

  const handleComplete = async () => {
    if (!isPasswordValid || !isConfirmValid) return;

    const deviceInfo = await getDeviceInfo();

    updateSignUp('emailCheck', {
      email: trimmedEmail,
      password: trimmedPassword,
      passwordCheck: trimmedConfirmPassword,
    });

    signUp({
      email: trimmedEmail,
      password: trimmedPassword,
      passwordCheck: trimmedConfirmPassword,
      device_id: deviceInfo.deviceId,
      device_type: String(deviceInfo.deviceType),
      platform: String(deviceInfo.platform),
      name: '익명',
      phoneNumber: signUpData.phoneNumber || '',
      account_type: '0',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isCodeVerified && isPasswordValid && isConfirmValid) {
      handleComplete();
    } else if (!isCodeSent && isEmailValid) {
      handleSendCode();
    } else if (isCodeSent && !isCodeVerified && isCodeValid && !isTimeout) {
      handleVerifyCode();
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col gap-s-16 pb-[24px]'>
        <Input.Email
          ref={emailInputRef}
          value={email}
          onChange={setEmail}
          onValidate={(isValid) => setIsEmailValid(isValid)}
          errorMessage={errors.email}
          validateOnChange
          showCheckIcon={isEmailVerified}
          disabled={isEmailVerified}
          autoFocus
        />

        {isCodeSent && (
          <Input.Code
            ref={codeInputRef}
            value={code}
            onChange={setCode}
            onValidate={(isValid) => setIsCodeValid(isValid)}
            onResend={() => {
              start();
              resend(trimmedEmail);
            }}
            timer={formattedTime}
            isTimeout={isTimeout}
            isResending={isLoading.sending}
            disabled={isCodeVerified}
            errorMessage={errors.code}
            validateOnComplete
          />
        )}

        {isCodeVerified && (
          <div className='flex flex-col gap-s-24'>
            <Input.Password
              ref={passwordInputRef}
              value={password}
              onChange={setPassword}
              onValidate={(isValid) => setIsPasswordValid(isValid)}
              validateOnChange
            />
            <Input.Password
              ref={confirmPasswordInputRef}
              isConfirm
              value={confirmPassword}
              onChange={setConfirmPassword}
              onValidate={(isValid) => setIsConfirmValid(isValid)}
              confirmValue={password}
              validateOnChange
            />
          </div>
        )}
      </div>

      <Button
        type="submit"
        isFloat
        disabled={
          isCodeVerified
            ? !trimmedPassword || !trimmedConfirmPassword || !isPasswordValid || !isConfirmValid
            : !isCodeSent
              ? !trimmedEmail || !isEmailValid || isLoading.sending || isFindingAccount
              : trimmedCode.length !== 6 || !isCodeValid || isLoading.verifying || isTimeout
        }
      >
        {isCodeVerified
          ? '다음'
          : !isCodeSent
            ? (isFindingAccount ? '가입 여부 확인 중...' : isLoading.sending ? '전송 중...' : '인증번호 받기')
            : (isLoading.verifying ? '확인 중...' : '인증 확인')}
      </Button>
    </form>
  );
};

export default EmailCheck;
