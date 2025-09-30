'use client';

import { Input } from '@/components/forms/input';
import Button from '@/components/ui/button';
import { PATHS } from '@/constant';
import { useSessionToken } from '@/hooks/auth/use-reset-token';
import { useTimer } from '@/hooks/common/use-timer';
import { useFindAccount } from '@/hooks/react-query/auth/use-find-account';
import { useVerification } from '@/hooks/react-query/auth/use-verification';
import { normalizePhone } from '@/libs/valid/auth';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

const ResetPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isAccountChecking, setIsAccountChecking] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  const { start, stop, formattedTime, isTimeout } = useTimer(300);
  const { setToken } = useSessionToken();

  // 초기 사용자 찾기 (인증 전)
  const { mutate: findAccount, isPending: isFindingAccount } = useFindAccount({
    type: 'phone',
    context: 'reset-password',
    onAccountExists: function () {
      send(normalizePhone(phone));
    },
    onNeedVerification: function () {
      send(normalizePhone(phone));
    },
    onInvalidInput: function (message) {
      setErrors({ phone: message });
    },
    onError: function (message) {
      setErrors({ phone: message });
    },
    onAccountNotFound: function () {
      send(normalizePhone(phone));
    },
  });

  // 인증 후 사용자 찾기
  const { mutate: findAccountAfterVerify, isPending: isFindingAfterVerify } =
    useFindAccount({
      type: 'phone',
      context: 'reset-password',
      isAfterVerification: true,
      onAccountExists: function (accountData) {
        if (accountData?.user_id) {
          const userId =
            typeof accountData.user_id === 'string'
              ? parseInt(accountData.user_id, 10)
              : accountData.user_id;
          const path = PATHS.AUTH.RESET_PASSWORD_ID(userId.toString());
          setToken(userId);
          setTimeout(() => {
            router.push(path);
          }, 100);
        }
      },
      onInvalidInput: function (message) {
        setErrors({ phone: message });
      },
      onError: function (message) {
        setErrors({ phone: message });
      },
    });

  const { send, verify, resend, errors, setErrors, isLoading } =
    useVerification({
      type: 'phone',
      onSendSuccess: function () {
        setIsCodeSent(true);
        start();
        // 코드 입력 필드로 포커스 이동
        setTimeout(() => {
          codeInputRef.current?.focus();
        }, 100);
      },
      onVerifySuccess: function () {
        stop();
        findAccountAfterVerify({
          phoneNumber: normalizePhone(phone),
          email: email.trim(),
        });
      },
    });

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCodeSent) {
      // 이메일이나 전화번호가 비어있으면 해당 필드로 포커스
      if (!email.trim()) {
        emailInputRef.current?.focus();
        return;
      }
      if (!isEmailValid) {
        emailInputRef.current?.focus();
        return;
      }
      if (!phone.trim()) {
        phoneInputRef.current?.focus();
        return;
      }
      if (!isPhoneValid) {
        phoneInputRef.current?.focus();
        return;
      }

      // 모든 필드가 유효하면 인증번호 전송
      setIsAccountChecking(true);
      setTimeout(() => {
        setIsAccountChecking(false);
        findAccount({
          phoneNumber: normalizePhone(phone),
          email: email.trim(),
        });
      }, 1500);
    } else {
      // 코드 입력 상태에서는 코드 검증
      if (!code.trim()) {
        codeInputRef.current?.focus();
        return;
      }
      if (!isCodeValid) {
        codeInputRef.current?.focus();
        return;
      }
      verify(normalizePhone(phone), String(code).trim());
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col gap-s-24'>
        <Input.Email
          ref={emailInputRef}
          value={email}
          onChange={handleEmailChange}
          onValidate={(isValid) => setIsEmailValid(isValid)}
          validateOnChange
          disabled={isCodeSent}
          autoFocus
        />

        <Input.Phone
          ref={phoneInputRef}
          value={phone}
          onChange={handlePhoneChange}
          onValidate={(isValid) => setIsPhoneValid(isValid)}
          errorMessage={errors.phone}
          validateOnComplete
          disabled={isCodeSent}
        />

        {isCodeSent && (
          <Input.Code
            ref={codeInputRef}
            value={code}
            onChange={setCode}
            onValidate={(isValid) => setIsCodeValid(isValid)}
            onResend={() => resend(normalizePhone(phone))}
            timer={formattedTime}
            isTimeout={isTimeout}
            isResending={isLoading.sending}
            errorMessage={errors.code}
            placeholder='인증번호 6자리를 입력해 주세요'
            validateOnComplete
          />
        )}
      </div>

      <Button type='submit' isFloat>
        {!isCodeSent
          ? isAccountChecking
            ? '가입 여부 확인 중...'
            : isLoading.sending
              ? '전송 중...'
              : '다음'
          : isLoading.verifying
            ? '확인 중...'
            : isFindingAfterVerify
              ? '사용자 확인 중...'
              : '확인'}
      </Button>
    </form>
  );
};

export default ResetPassword;
