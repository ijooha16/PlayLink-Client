'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import { Input } from '@/components/forms/input';
import Button from '@/components/ui/button';
import { PATHS } from '@/constant';

import { clearFlow, completeStep } from '@/hooks/auth/use-signup-flow';
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

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmValid, setIsConfirmValid] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();
  const trimmedConfirmPassword = confirmPassword.trim();

  const { start, stop, formattedTime, isTimeout } = useTimer(300);
  const [emailError, setEmailError] = useState<string>('');

  const { send, verify, resend, errors, setErrors, isLoading } =
    useVerification({
      type: 'email',
      onSendSuccess: function () {
        setIsCodeSent(true);
        start();
        setTimeout(() => {
          codeInputRef.current?.focus();
        }, 100);
      },
      onVerifySuccess: function () {
        stop();
        setIsEmailVerified(true);
        setTimeout(() => {
          passwordInputRef.current?.focus();
        }, 100);
      },
    });

  const { mutate: findAccount, isPending: isFindingAccount } = useFindAccount({
    type: 'email',
    context: 'sign-up',
    onAccountNotFound: () => {
      send(trimmedEmail);
    },
    onNeedVerification: () => {
      send(trimmedEmail);
    },
    onInvalidInput: (message) => setEmailError(message),
    onError: (message) => setEmailError(message),
  });

  const { mutate: signIn } = useSignin({
    onSuccess: () => {
      completeStep('email-check');
      clearFlow();
      router.replace(PATHS.AUTH.WELCOME);
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

  const handleCheckAccount = () => {
    if (!isEmailValid) return;
    const phone = signUpData.phoneNumber
      ? signUpData.phoneNumber.replace(/[^0-9]/g, '')
      : '';

    if (phone) {
      findAccount({ phoneNumber: phone, email });
    } else {
      send(trimmedEmail);
    }
  };

  const handleVerifyCode = () => {
    if (!isCodeValid) return;
    verify(trimmedEmail, code.trim());
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

  const getButtonText = () => {
    if (!isCodeSent) {
      return isFindingAccount
        ? '계정 확인 중...'
        : isLoading.sending
          ? '전송 중...'
          : '다음';
    }
    if (!isEmailVerified) {
      return isLoading.verifying ? '확인 중...' : '다음';
    }
    return '완료';
  };

  const getButtonDisabled = () => {
    if (!isCodeSent) {
      return !isEmailValid || isFindingAccount || isLoading.sending;
    }
    if (!isEmailVerified) {
      return !isCodeValid || isLoading.verifying || isTimeout;
    }
    return !isPasswordValid || !isConfirmValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCodeSent) {
      handleCheckAccount();
    } else if (!isEmailVerified) {
      handleVerifyCode();
    } else {
      updateSignUp('emailCheck', {
        email: trimmedEmail,
        password: trimmedPassword,
        passwordCheck: trimmedConfirmPassword,
      });
      handleComplete();
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
          errorMessage={emailError || errors.email}
          validateOnChange
          showCheckIcon={isEmailVerified}
          disabled={isCodeSent}
          autoFocus
        />

        {isCodeSent && !isEmailVerified && (
          <Input.Code
            ref={codeInputRef}
            value={code}
            onChange={setCode}
            onValidate={(isValid) => setIsCodeValid(isValid)}
            onResend={() => resend(trimmedEmail)}
            timer={formattedTime}
            isTimeout={isTimeout}
            isResending={isLoading.sending}
            errorMessage={errors.code}
            placeholder='인증번호 6자리를 입력해 주세요'
            validateOnComplete
            autoFocus
          />
        )}

        {isEmailVerified && (
          <div className='flex flex-col gap-s-24'>
            <Input.Password
              ref={passwordInputRef}
              value={password}
              onChange={setPassword}
              onValidate={(isValid, error) => {
                setIsPasswordValid(isValid);
                setPasswordError(error || '');
              }}
              onBlur={() => setPasswordTouched(true)}
              validateOnChange
              hasError={
                passwordTouched &&
                confirmPasswordTouched &&
                !isConfirmValid &&
                confirmPassword.length > 0
              }
              errorMessage={
                passwordTouched &&
                confirmPasswordTouched &&
                !isConfirmValid &&
                confirmPassword.length > 0
                  ? '비밀번호가 일치하지 않습니다.'
                  : passwordError
              }
            />
            <Input.Password
              ref={confirmPasswordInputRef}
              isConfirm
              value={confirmPassword}
              onChange={setConfirmPassword}
              onValidate={(isValid, error) => {
                setIsConfirmValid(isValid);
                setConfirmPasswordError(error || '');
              }}
              onBlur={() => setConfirmPasswordTouched(true)}
              confirmValue={password}
              validateOnChange
              errorMessage={confirmPasswordError}
            />
          </div>
        )}
      </div>

      <Button
        type='submit'
        variant='default'
        disabled={getButtonDisabled()}
        isFloat
      >
        {getButtonText()}
      </Button>
    </form>
  );
};

export default EmailCheck;
