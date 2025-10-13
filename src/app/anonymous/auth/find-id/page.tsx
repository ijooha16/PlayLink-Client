'use client';

import { useTimer } from '@/hooks/common/use-timer';
import { useState } from 'react';

import { Input } from '@/components/forms/input';
import AuthLayoutContainer from '@/components/layout/auth-layout';
import Button from '@/components/ui/button';

import { useFindAccount } from '@/hooks/react-query/auth/use-find-account';
import { useVerification } from '@/hooks/react-query/auth/use-verification';

import { normalizePhone } from '@/libs/valid/auth';

export default function FindId() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const { start, stop, formattedTime, isTimeout } = useTimer(300);

  const { send, verify, resend, errors, setErrors, isLoading } =
    useVerification({
      type: 'phone',
      onSendSuccess: function () {
        setIsCodeSent(true);
        start();
      },
      onVerifySuccess: function () {
        stop(); // 인증 성공 시 타이머 중지
        findAccountAfterVerify({
          phoneNumber: normalizePhone(phone),
          account_type: '0',
        });
      },
    });

  const { mutate: findAccountAfterVerify } = useFindAccount({
    type: 'phone',
    context: 'find-id',
    isAfterVerification: true,
    onInvalidInput: function (message) {
      setErrors({ phone: message });
    },
    onError: function (message) {
      setErrors({ phone: message });
    },
  });

  const handleCode = {
    Send: function (e?: React.FormEvent<HTMLFormElement> | React.MouseEvent) {
      e?.preventDefault();
      if (!isPhoneValid) return;
      send(normalizePhone(phone));
    },
    Verify: function (e?: React.FormEvent<HTMLFormElement> | React.MouseEvent) {
      setIsLocked(true);
      e?.preventDefault();
      if (!isCodeValid) return;
      verify(normalizePhone(phone), String(code).trim());
    },
  };

  return (
    <AuthLayoutContainer
      title={'가입하신 계정의 \n 휴대폰 번호를 입력해 주세요'}
    >
      <div className='flex flex-col gap-s-24'>
        <form onSubmit={handleCode.Send}>
          <Input.Phone
            value={phone}
            onChange={setPhone}
            onValidate={(isValid) => setIsPhoneValid(isValid)}
            errorMessage={errors.phone}
            validateOnComplete
            autoFocus
            disabled={isCodeSent}
          />
        </form>

        {isCodeSent && (
          <form onSubmit={handleCode.Verify}>
            <Input.Code
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
              autoFocus
            />
          </form>
        )}
      </div>

      <Button
        isFloat
        disabled={
          isLocked ||
          (!isCodeSent
            ? normalizePhone(phone).length !== 11 ||
              !isPhoneValid ||
              isLoading.sending
            : String(code).length !== 6 ||
              !isCodeValid ||
              isLoading.verifying ||
              isTimeout)
        }
        onClick={!isCodeSent ? handleCode.Send : handleCode.Verify}
      >
        {!isCodeSent ? '인증번호 받기' : '확인'}
      </Button>
    </AuthLayoutContainer>
  );
}
