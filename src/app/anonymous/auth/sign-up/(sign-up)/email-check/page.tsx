'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import { Input } from '@/components/forms/input';
import Button from '@/components/ui/button';

import { useFindAccount } from '@/hooks/react-query/auth/use-find-account';
import { useSignUp, useSignin } from '@/hooks/react-query/auth/use-signin';

import useSignUpStore from '@/store/use-sign-up-store';

import { getDeviceInfo } from '@/utills/get-device-info';

const EmailCheck = () => {
  const router = useRouter();
  const { signUp: signUpData, resetSignUp, updateSignUp } = useSignUpStore();

  const [email, setEmail] = useState(signUpData.emailCheck.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmValid, setIsConfirmValid] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

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
    },
    onNeedVerification: () => {
      setIsEmailVerified(true);
    },
    onInvalidInput: (message) => setEmailError(message),
    onError: (message) => setEmailError(message),
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

  const handleVerifyEmail = () => {
    if (!isEmailValid) return;
    const phone = signUpData.phoneNumber
      ? signUpData.phoneNumber.replace(/[^0-9]/g, '')
      : '';

    if (phone) {
      findAccount({ phoneNumber: phone, email });
      return;
    }

    setIsEmailVerified(true);
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


  return (
    <div>
      <div className='flex flex-col gap-s-16 pb-[24px]'>
        <Input.Email
          ref={emailInputRef}
          value={email}
          onChange={setEmail}
          onValidate={(isValid) => setIsEmailValid(isValid)}
          errorMessage={emailError}
          validateOnChange
          showCheckIcon={isEmailVerified}
          disabled={isEmailVerified}
          autoFocus
        />

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
      </div>

      <Button
        variant='default'
        disabled={!isEmailValid || !isPasswordValid || !isConfirmValid}
        onClick={() => {
          if (!isEmailVerified) {
            handleVerifyEmail();
          } else {
            updateSignUp('emailCheck', {
              email: trimmedEmail,
              password: trimmedPassword,
              passwordCheck: trimmedConfirmPassword,
            });
            handleComplete();
          }
        }}
        isFloat
      >
        다음
      </Button>
    </div>
  );
};

export default EmailCheck;
