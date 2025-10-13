'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';

import { Input } from '@/components/forms/input';
import Button from '@/components/ui/button';

import useSignUpStore from '@/store/use-sign-up-store';

import { completeStep } from '@/hooks/auth/use-signup-flow';
import { useTimer } from '@/hooks/common/use-timer';
import { useFindAccount } from '@/hooks/react-query/auth/use-find-account';
import { useVerification } from '@/hooks/react-query/auth/use-verification';

import { PATHS } from '@/constant';
import { normalizePhone } from '@/libs/valid/auth';

const PhoneCheck: React.FC = function () {
  const router = useRouter();
  const { signUp, updateSignUp } = useSignUpStore();

  const [phone, setPhone] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);
  const [isCodeValid, setIsCodeValid] = useState<boolean>(false);
  const [isButtonClicked, setIsButtonClicked] = useState<boolean>(false);

  const phoneInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  const { start, stop, formattedTime, isTimeout } = useTimer(300);

  const normalizedPhone = useMemo(
    function () {
      return normalizePhone(phone);
    },
    [phone]
  );

  const trimmedCode = useMemo(
    function () {
      return code.trim();
    },
    [code]
  );

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
        stop(); // 인증 성공 시 타이머 중지
        // 인증 성공 후 계정 정보를 다시 조회
        findAccountAfterVerify({
          phoneNumber: normalizedPhone,
          account_type: '0',
        });
      },
    });

  const { mutate: findAccountAfterVerify } = useFindAccount({
    type: 'phone',
    context: 'sign-up',
    isAfterVerification: true,
    onAccountExists: function (accountData) {
      // 인증 후 계정이 확인되면 found 페이지로 이동
      const params = new URLSearchParams({
        email: accountData.email || '',
        nickname: accountData.nickname || '',
        createdAt: accountData.created_at || '',
        accountType: accountData.account_type?.toString() || '0',
      });
      router.push(`${PATHS.AUTH.FOUND}?${params.toString()}`);
    },
    onAccountNotFound: function () {
      // 인증 후 계정이 없으면 회원가입 진행
      updateSignUp('phoneNumber', normalizedPhone);
      completeStep('phone-check');
      router.push(PATHS.AUTH.EMAIL_CHECK);
    },
    onInvalidInput: function (message) {
      setErrors({ phone: message });
    },
    onError: function (message) {
      setErrors({ phone: message });
    },
  });

  const handleCode = {
    Send: function () {
      if (!isPhoneValid) return;
      send(normalizedPhone);
    },
    Verify: function () {
      if (!isCodeValid) return;
      verify(normalizedPhone, trimmedCode);
    },
  };

  const handleSubmit = function (e: React.FormEvent) {
    e.preventDefault();
    
    if (!isCodeSent) {
      handleCode.Send();
    } else if (isCodeSent && isCodeValid && !isTimeout) {
      handleCode.Verify();
      setIsButtonClicked(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col gap-s-24'>
        <Input.Phone
          ref={phoneInputRef}
          value={phone}
          onChange={setPhone}
          onValidate={function (isValid: boolean) {
            setIsPhoneValid(isValid);
          }}
          errorMessage={errors.phone}
          validateOnComplete
          disabled={isCodeSent}
          autoFocus
        />

        {isCodeSent && (
          <Input.Code
            ref={codeInputRef}
            value={code}
            onChange={setCode}
            onValidate={function (isValid: boolean) {
              setIsCodeValid(isValid);
            }}
            onResend={function () {
              start();
              resend(normalizedPhone);
            }}
            timer={formattedTime}
            isTimeout={isTimeout}
            isResending={isLoading.sending}
            errorMessage={errors.code}
            placeholder='인증번호 6자리를 입력해 주세요.'
            validateOnComplete
          />
        )}
      </div>

      <Button
        type='submit'
        disabled={
          isButtonClicked ||
          (!isCodeSent
            ? normalizedPhone.length !== 11 ||
              !isPhoneValid ||
              isLoading.sending
            : trimmedCode.length !== 6 ||
              !isCodeValid ||
              isLoading.verifying ||
              isTimeout)
        }
        isFloat
      >
        {!isCodeSent ? '인증번호 받기' : '다음'}
      </Button>
    </form>
  );
};

export default PhoneCheck;
