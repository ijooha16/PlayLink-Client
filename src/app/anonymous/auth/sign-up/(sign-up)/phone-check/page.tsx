'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

import useSignUpStore from '@/store/use-sign-up-store';

import { useInputHandlers } from '@/hooks/common/use-input-handlers';
import { useTimer } from '@/hooks/common/use-timer';

import { useFindAccount } from '@/hooks/react-query/auth/use-find-account';
import { useVerification } from '@/hooks/react-query/auth/use-verification';

import { normalizePhone, validatePhone, validateVerificationCode } from '@/libs/valid/auth';
import { formatPhoneNumber } from '@/utills/format/phone-formats';

const PhoneCheck = () => {
  const router = useRouter();
  const { signUp, updateSignUp } = useSignUpStore();

  const [isCodeSent, setIsCodeSent] = useState(false);

  const { start, formattedTime, isTimeout } = useTimer(300);

  const {
    values,
    errors: localErrors,
    handlers,
    setError,
  } = useInputHandlers(
    {
      phone: signUp.phoneNumber ? formatPhoneNumber(signUp.phoneNumber) : '',
      code: '',
    },
    {
      phone: { type: 'phone' },
      code: { type: 'text' },
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
    type: 'phone',
    onSendSuccess: () => {
      setIsCodeSent(true);
      start();
    },
    onVerifySuccess: () => {
      const normalized = normalizePhone(values.phone);
      updateSignUp('phoneNumber', normalized);
      router.replace('/anonymous/auth/sign-up/email-check');
    },
  });

  const {
    mutate: findAccount,
    isPending: isFindingAccount,
  } = useFindAccount({
    type: 'phone',
    context: 'sign-up',
    onAccountExists: () => send(normalizePhone(values.phone)),
    onNeedVerification: () => send(normalizePhone(values.phone)),
    onInvalidInput: (message) => setErrors({ phone: message }),
    onError: (message) => setErrors({ phone: message }),
    onAccountNotFound: () => send(normalizePhone(values.phone)),
  });

  const { mutate: findAccountAfterVerify } = useFindAccount({
    type: 'phone',
    context: 'sign-up',
    isAfterVerification: true,
    onInvalidInput: (message) => setErrors({ phone: message }),
    onError: (message) => setErrors({ phone: message }),
  });

  const handleSendCode = () => {
    const sanitized = normalizePhone(values.phone);
    const validation = validatePhone(sanitized);

    if (!validation.isValid) {
      setError('phone', validation.error || '');
      return;
    }

    findAccount({ phoneNumber: sanitized });
  };

  const handleVerifyCode = () => {
    const validation = validateVerificationCode(values.code);

    if (!validation.isValid) {
      setError('code', validation.error || '');
      return;
    }

    verify(normalizePhone(values.phone), values.code.trim());
  };

  const displayErrors = {
    phone: errors.phone || localErrors.phone,
    code: errors.code || localErrors.code,
  };

  return (
    <>
      <div className="gap-s-24 flex flex-col">
        <Input
          label="휴대폰 번호"
          type="tel"
          inputMode="numeric"
          placeholder="010-0000-0000"
          value={values.phone}
          onChange={handlers.phone}
          showCancelToggle={Boolean(values.phone)}
          hasError={Boolean(displayErrors.phone)}
          errorMessage={displayErrors.phone || ''}
        />

        {isCodeSent && (
          <Input
            label="인증번호"
            type="text"
            inputMode="numeric"
            timer={formattedTime}
            splitedRightElement={
              <button
                onClick={() => resend(normalizePhone(values.phone))}
                className="text-primary-800 text-label-l font-semibold"
                disabled={isLoading.sending}
              >
                재전송
              </button>
            }
            variant="splited"
            maxLength={6}
            placeholder="인증번호 6자리를 입력해 주세요."
            value={values.code}
            onChange={handlers.code}
            hasError={Boolean(displayErrors.code) || isTimeout}
            errorMessage={displayErrors.code || (isTimeout ? '인증번호를 다시 보내주세요.' : '')}
            onBeforeInput={(e) => {
              const be = e;
              if (be.data && /[^\d]/.test(be.data)) {
                e.preventDefault();
              }
            }}
          />
        )}
      </div>

      <Button
        disabled={
          !isCodeSent
            ? normalizePhone(values.phone).length !== 11 || isLoading.sending || isFindingAccount
            : values.code.length !== 6 || isLoading.verifying
        }
        isFloat
        onClick={!isCodeSent ? handleSendCode : handleVerifyCode}
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
    </>
  );
};

export default PhoneCheck;
