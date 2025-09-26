'use client';

import { useInputHandlers } from '@/hooks/common/use-input-handlers';
import { useTimer } from '@/hooks/common/use-timer';
import { useState } from 'react';

import AuthLayoutContainer from '@/components/layout/auth-layout';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

import { useFindAccount } from '@/hooks/react-query/auth/use-find-account';
import { useVerification } from '@/hooks/react-query/auth/use-verification';

import { normalizePhone, validatePhone, validateVerificationCode } from '@/libs/valid/auth';
import { formatPhoneNumber } from '@/utills/format/phone-formats';

export default function FindId() {
  const [isCodeSent, setIsCodeSent] = useState(false);

  const { start, formattedTime, isTimeout } = useTimer(300);

  const { values, errors: localErrors, handlers, setError } = useInputHandlers(
    {
      phone: '',
      code: ''
    },
    {
      phone: { type: 'phone' },
      code: { type: 'text' }
    }
  );

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
    },
    onVerifySuccess: function() {
      findAccountAfterVerify({ phoneNumber: normalizePhone(values.phone) });
    }
  });

  const { mutate: findAccount, isPending: isFinding } = useFindAccount({
    type: 'phone',
    context: 'find-id',
    onAccountExists: function() { send(normalizePhone(values.phone)); },
    onNeedVerification: function() { send(normalizePhone(values.phone)); },
    onInvalidInput: function(message) { setErrors({ phone: message }); },
    onError: function(message) { setErrors({ phone: message }); },
    onAccountNotFound: function() { send(normalizePhone(values.phone)); }
  });

  const { mutate: findAccountAfterVerify } = useFindAccount({
    type: 'phone',
    context: 'find-id',
    isAfterVerification: true,
    onInvalidInput: function(message) { setErrors({ phone: message }); },
    onError: function(message) { setErrors({ phone: message }); }
  });

  function handleSendCode() {
    const sanitized = normalizePhone(values.phone);
    const validation = validatePhone(sanitized);
    if (!validation.isValid) {
      setError('phone', validation.error || '');
      return;
    }
    findAccount({ phoneNumber: sanitized });
  }

  function handleVerifyCode() {
    const validation = validateVerificationCode(values.code);
    if (!validation.isValid) {
      setError('code', validation.error || '');
      return;
    }
    verify(normalizePhone(values.phone), String(values.code).trim());
  }

  const displayErrors = {
    phone: errors.phone || localErrors.phone,
    code: errors.code || localErrors.code
  };

  return (
    <AuthLayoutContainer title={'가입하신 계정의 \n 휴대폰 번호를 입력해 주세요'}>
      <div className="flex flex-col gap-s-24">
        <Input
          label="휴대폰 번호"
          type="tel"
          inputMode="numeric"
          placeholder="010-0000-0000"
          value={formatPhoneNumber(values.phone)}
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
            variant="splited"
            maxLength={6}
            placeholder="인증번호 6자리를 입력해 주세요"
            value={values.code}
            onChange={handlers.code}
            hasError={Boolean(displayErrors.code) || isTimeout}
            errorMessage={displayErrors.code || (isTimeout ? '인증번호를 다시 보내주세요' : '')}
            splitedRightElement={
              <button
                onClick={function() { resend(normalizePhone(values.phone)); }}
                className="text-primary-800 text-label-l font-semibold"
                disabled={isLoading.sending}
              >
                재전송
              </button>
            }
            onBeforeInput={function(e) {
              const be = e;
              if (be.data && /[^\d]/.test(be.data)) e.preventDefault();
            }}
          />
        )}
      </div>

      <Button
        isFloat
        disabled={
          !isCodeSent
            ? normalizePhone(values.phone).length !== 11 || isLoading.sending || isFinding
            : String(values.code).length !== 6 || isLoading.verifying
        }
        onClick={!isCodeSent ? handleSendCode : handleVerifyCode}
      >
        {!isCodeSent
          ? (isFinding ? '가입 여부 확인 중' : isLoading.sending ? '전송 중' : '인증번호 받기')
          : (isLoading.verifying ? '확인 중' : '확인')}
      </Button>
    </AuthLayoutContainer>
  );
}
