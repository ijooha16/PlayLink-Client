'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import { Input } from '@/components/forms/input';
import Button from '@/components/ui/button';
import { ERROR_MESSAGES, LOGIN_DEVICE_IDS, PATHS } from '@/constant';

import { useFindAccount } from '@/hooks/react-query/auth/use-find-account';
import { useSignUp, useSignin } from '@/hooks/react-query/auth/use-signin';

import useSignUpStore from '@/store/use-sign-up-store';

import { getDeviceInfo } from '@/utills/get-device-info';

// Email verification without code confirmation - simplified signup flow
// Skip code verification step: Email -> Password -> Complete
const EmailCheckNonCheck = () => {
  const router = useRouter();
  const { signUp: signUpData, resetSignUp, updateSignUp } = useSignUpStore();

  const [email, setEmail] = useState(signUpData.emailCheck.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmValid, setIsConfirmValid] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();
  const trimmedConfirmPassword = confirmPassword.trim();

  const [emailError, setEmailError] = useState<string>('');

  const { mutate: findAccount, isPending: isFindingAccount } = useFindAccount({
    type: 'email',
    context: 'sign-up',
    onAccountNotFound: () => {
      setIsEmailVerified(true);
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100);
    },
    onNeedVerification: () => {
      setIsEmailVerified(true);
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100);
    },
    onInvalidInput: (message) => setEmailError(message),
    onError: (message) => setEmailError(message),
  });

  const { mutate: signIn } = useSignin({
    onSuccess: () => {
      router.push(PATHS.AUTH.WELCOME);
      resetSignUp();
    },
  });

  const { mutate: signUp } = useSignUp({
    onSuccess: () => {
      signIn({
        email: signUpData.emailCheck.email,
        password: signUpData.emailCheck.password,
        device_id: LOGIN_DEVICE_IDS.DEFAULT,
      });
    },
  });

  const handleVerifyEmail = () => {
    if (!isEmailValid) return;
    const phone = signUpData.phoneNumber
      ? signUpData.phoneNumber.replace(/[^0-9]/g, '')
      : '';

    if (phone) {
      findAccount({
        phoneNumber: phone,
        email,
        account_type: '0',
      });
      return;
    }

    setIsEmailVerified(true);
    setTimeout(() => {
      passwordInputRef.current?.focus();
    }, 100);
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
    if (!isEmailVerified) {
      return isFindingAccount ? '계정 확인 중...' : '다음';
    }
    return '완료';
  };

  const getButtonDisabled = () => {
    if (!isEmailVerified) {
      return !isEmailValid || isFindingAccount;
    }
    return !isPasswordValid || !isConfirmValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    handleVerifyEmail();
    updateSignUp('emailCheck', {
      email: trimmedEmail,
      password: trimmedPassword,
      passwordCheck: trimmedConfirmPassword,
    });
    handleComplete();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col gap-s-16 pb-[24px]'>
        <Input.Email
          ref={emailInputRef}
          value={email}
          onChange={setEmail}
          onValidate={(isValid) => setIsEmailValid(isValid)}
          errorMessage={emailError}
          validateOnChange
          showCheckIcon={isEmailVerified}
          autoFocus
        />

        <div className='flex flex-col gap-s-24'>
          <Input.Password
            ref={passwordInputRef}
            value={password}
            onChange={(v) => {
              setPassword(v);
              // 비밀번호 바뀌면 확인 상태 초기화
              setIsConfirmValid(false);
              setConfirmPasswordTouched(false);
            }}
            onValidate={(isValid, error) => {
              setIsPasswordValid(isValid);
              setPasswordError(error || '');
            }}
            onBlur={() => setPasswordTouched(true)}
            validateOnChange
            hasError={passwordTouched && Boolean(passwordError)}
            errorMessage={passwordError}
          />
          <Input.Password
            ref={confirmPasswordInputRef}
            isConfirm
            value={confirmPassword}
            onChange={setConfirmPassword}
            onValidate={(isValid, error) => {
              setIsConfirmValid(isValid);
            }}
            onBlur={() => setConfirmPasswordTouched(true)}
            confirmValue={password}
            validateOnChange
            hasError={
              confirmPasswordTouched &&
              !isConfirmValid &&
              confirmPassword.length > 0
            }
            errorMessage={
              confirmPasswordTouched &&
              !isConfirmValid &&
              confirmPassword.length > 0
                ? ERROR_MESSAGES.PASSWORD_CONFIRM
                : ''
            }
          />
        </div>
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

export default EmailCheckNonCheck;
