'use client';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { PATHS } from '@/constant';
import { useInputHandlers } from '@/hooks/common/use-input-handlers';
import { useTimer } from '@/hooks/common/use-timer';
import { useFindAccount } from '@/hooks/react-query/auth/use-find-account';
import { useVerification } from '@/hooks/react-query/auth/use-verification';
import {
  validateEmail,
  validatePhone,
  validateVerificationCode,
} from '@/libs/valid/auth';
import { normalizePhone } from '@/libs/valid/auth';
import { useRouter } from 'next/navigation';
// import { formatPhoneNumber } from '@/utills/format/phone-formats';
import React, { use, useState } from 'react';

interface ResetPasswordVerificationProps {
  onSuccess?: (data: {
    email: string;
    phoneNumber: string;
    code: string;
  }) => void;
}

const ResetPasswordVerification: React.FC<ResetPasswordVerificationProps> = ({
  onSuccess,
}) => {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const { start, formattedTime, isTimeout } = useTimer(300);
  const router = useRouter();

  const {
    values,
    errors: localErrors,
    handlers,
    setError,
  } = useInputHandlers(
    {
      email: '',
      phone: '',
      code: '',
      password: '',
      confirmPassword: '',
    },
    {
      email: { type: 'text' },
      phone: { type: 'phone' },
      code: { type: 'text' },
      password: { type: 'password' },
      confirmPassword: { type: 'confirmPassword' },
    }
  );

  // 인증 hook
  const { send, verify, resend, errors, setErrors, isLoading } =
    useVerification({
      type: 'phone',
      onSendSuccess: () => {
        setIsCodeSent(true);
        start();
      },
      onVerifySuccess: (data) => {
        setIsCodeVerified(true);
        onSuccess?.({
          email: values.email,
          phoneNumber: normalizePhone(values.phone),
          code: values.code,
        });
        router.push(PATHS.AUTH.RESET_PASSWORD + `/${userId}`)
      },
    });

  // 계정 조회 hook
  const { data, mutate: findAccount, isPending: isFindingAccount } = useFindAccount({
    type: 'phone',
    context: 'find-id',
     onAccountExists: (accountData) => {
       // 계정이 존재하면 user_id 저장하고 인증번호 전송
       console.log('계정 조회 응답 데이터:', accountData);
       if (accountData?.user_id) {
         setUserId(accountData.user_id);
       }
       send(normalizePhone(values.phone));
     },
     onNeedVerification: (accountData) => {
       // 인증이 필요한 경우에도 user_id 저장
       console.log('인증 필요 응답 데이터:', accountData);
       if (accountData?.user_id) {
         setUserId(accountData.user_id);
       }
       send(normalizePhone(values.phone));
     },
    onInvalidInput: (message) => setErrors({ phone: message }),
    onError: (message) => setErrors({ phone: message }),
  });

  const handleSendCode = () => {
    // 이메일 유효성 검사
    const emailValidation = validateEmail(values.email);
    if (!emailValidation.isValid) {
      setError('email', emailValidation.error || '');
      return;
    }

    // 전화번호 유효성 검사
    const phoneValidation = validatePhone(normalizePhone(values.phone));
    if (!phoneValidation.isValid) {
      setError('phone', phoneValidation.error || '');
      return;
    }

    // 계정 조회 (이메일과 전화번호 모두 포함)
    findAccount({
      phoneNumber: normalizePhone(values.phone),
      email: values.email,
    });
    setUserId(data?.user_id || null);
  };

  const handleVerifyCode = () => {
    const codeValidation = validateVerificationCode(values.code);
    if (!codeValidation.isValid) {
      setError('code', codeValidation.error || '');
      return;
    }
    verify(normalizePhone(values.phone), values.code.trim());
  };

  const handleResend = () => {
    start();
    resend(normalizePhone(values.phone));
  };

  const displayErrors = {
    email: errors.email || localErrors.email,
    phone: errors.phone || localErrors.phone,
    code: errors.code || localErrors.code,
    password: localErrors.password,
    confirmPassword: localErrors.confirmPassword,
  };

  return (
    <>

        <div className='flex flex-col gap-s-16 pb-[24px]'>
          <Input
            label='이메일'
            placeholder='이메일을 입력해주세요.'
            value={values.email}
            onChange={handlers.email}
            hasError={!!displayErrors.email}
            errorMessage={displayErrors.email || ''}
            showCancelToggle={!!values.email && !isCodeSent}
            disabled={isCodeSent}
          />

          <Input
            label='휴대폰 번호'
            type='tel'
            inputMode='numeric'
            placeholder='010-0000-0000'
            value={values.phone}
            onChange={handlers.phone}
            showCancelToggle={!!values.phone && !isCodeSent}
            hasError={!!displayErrors.phone}
            errorMessage={displayErrors.phone || ''}
            disabled={isCodeSent}
          />

          {isCodeSent && (
            <Input
              label='인증번호'
              variant='splited'
              placeholder='인증번호 6자리를 입력해주세요'
              value={values.code}
              onChange={handlers.code}
              hasError={!!displayErrors.code || isTimeout}
              errorMessage={
                displayErrors.code ||
                (isTimeout ? '인증번호를 다시 보내주세요.' : '')
              }
              disabled={isCodeVerified}
              timer={formattedTime}
              maxLength={6}
              inputMode='numeric'
              splitedRightElement={
                <button
                  onClick={handleResend}
                  className='text-label-l font-semibold text-primary-800'
                  disabled={isLoading.sending}
                >
                  재전송
                </button>
              }
              onBeforeInput={(e) => {
                const be = e as unknown as InputEvent;
                if (be.data && /[^\d]/.test(be.data)) e.preventDefault();
              }}
            />
          )}
        </div>


      <Button
        isFloat
        disabled={
          isCodeVerified
            ? false
            : !isCodeSent
              ? !values.email ||
                !values.phone ||
                isLoading.sending ||
                isFindingAccount
              : values.code.length !== 6 || isLoading.verifying
        }
        onClick={
          isCodeVerified
            ? () => {}
            : !isCodeSent
              ? handleSendCode
              : handleVerifyCode
        }
      >
        {isCodeVerified
          ? '다음'
          : !isCodeSent
            ? isFindingAccount
              ? '가입 여부 확인 중...'
              : isLoading.sending
                ? '전송 중...'
                : '인증번호 받기'
            : isLoading.verifying
              ? '확인 중...'
              : '인증 확인'}
      </Button>
    </>
  );
};

export default ResetPasswordVerification;
