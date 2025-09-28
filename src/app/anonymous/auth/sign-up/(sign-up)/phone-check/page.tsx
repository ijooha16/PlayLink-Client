'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, useRef, useEffect } from 'react';

import { Input } from '@/components/forms/input';
import Button from '@/components/ui/button';

import useSignUpStore from '@/store/use-sign-up-store';

import { useTimer } from '@/hooks/common/use-timer';
import { useFindAccount } from '@/hooks/react-query/auth/use-find-account';
import { useVerification } from '@/hooks/react-query/auth/use-verification';

import { PATHS } from '@/constant';
import { normalizePhone } from '@/libs/valid/auth';

const PhoneCheck: React.FC = function() {
  const router = useRouter();
  const { signUp, updateSignUp } = useSignUpStore();

  const [phone, setPhone] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);
  const [isCodeValid, setIsCodeValid] = useState<boolean>(false);
  const [existingAccountData, setExistingAccountData] = useState<any>(null);

  const phoneInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  const { start, stop, formattedTime, isTimeout } = useTimer(300);

  const normalizedPhone = useMemo(function() {
    return normalizePhone(phone);
  }, [phone]);


  const trimmedCode = useMemo(function() {
    return code.trim();
  }, [code]);

  const {
    send,
    verify,
    resend,
    errors,
    setErrors,
    isLoading
  } = useVerification({
    type: 'phone',
    onSendSuccess: function() {
      setIsCodeSent(true);
      start();
      // 코드 입력 필드로 포커스 이동
      setTimeout(() => {
        codeInputRef.current?.focus();
      }, 100);
    },
    onVerifySuccess: function() {
      stop(); // 인증 성공 시 타이머 중지

      if (existingAccountData) {
        // 기존 계정이 있으면 found 페이지로 이동
        const params = new URLSearchParams({
          email: existingAccountData.email || '',
          nickname: existingAccountData.nickname || '',
          createdAt: existingAccountData.created_at || '',
          accountType: existingAccountData.account_type?.toString() || '0',
        });
        router.replace(`${PATHS.AUTH.FOUND}?${params.toString()}`);
      } else {
        // 새 계정이면 회원가입 계속 진행
        updateSignUp('phoneNumber', normalizedPhone);
        router.replace(PATHS.AUTH.EMAIL_CHECK);
      }
    }
  });

  const { mutate: findAccount, isPending: isFindingAccount } = useFindAccount({
    type: 'phone',
    context: 'find-id',
    onAccountExists: function(accountData) {
      setExistingAccountData(accountData);
      send(normalizedPhone);
    },
    onNeedVerification: function() { send(normalizedPhone); },
    onInvalidInput: function(message) { setErrors({ phone: message }); },
    onError: function(message) { setErrors({ phone: message }); },
    onAccountNotFound: function() {
      setExistingAccountData(null);
      send(normalizedPhone);
    }
  });

  const handleCode = {
    Send: function() {
      if (!isPhoneValid) return;
      findAccount({ phoneNumber: normalizedPhone });
    },
    Verify: function() {
      if (!isCodeValid) return;
      verify(normalizedPhone, trimmedCode);
    }
  };

  const handleSubmit = function(e: React.FormEvent) {
    e.preventDefault();

    if (!isCodeSent) {
      handleCode.Send();
    } else if (isCodeSent && isCodeValid && !isTimeout) {
      handleCode.Verify();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="gap-s-24 flex flex-col">
        <Input.Phone
          ref={phoneInputRef}
          value={phone}
          onChange={setPhone}
          onValidate={function(isValid: boolean) { setIsPhoneValid(isValid); }}
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
            onValidate={function(isValid: boolean) { setIsCodeValid(isValid); }}
            onResend={function() {
              start();
              resend(normalizedPhone);
            }}
            timer={formattedTime}
            isTimeout={isTimeout}
            isResending={isLoading.sending}
            errorMessage={errors.code}
            placeholder="인증번호 6자리를 입력해 주세요."
            validateOnComplete
          />
        )}
      </div>

      <Button
        type="submit"
        disabled={
          !isCodeSent
            ? normalizedPhone.length !== 11 || !isPhoneValid || isLoading.sending || isFindingAccount
            : trimmedCode.length !== 6 || !isCodeValid || isLoading.verifying || isTimeout
        }
        isFloat
      >
        {!isCodeSent
          ? isFindingAccount
            ? '가입 여부 확인 중...'
            : isLoading.sending
            ? '전송 중...'
            : '인증번호 받기'
          : isLoading.verifying
          ? '확인 중...'
          : '다음'}
      </Button>
    </form>
  );
};

export default PhoneCheck;
