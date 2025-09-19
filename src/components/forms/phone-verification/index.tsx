'use client';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useTimer } from '@/hooks/common/use-timer';
import { normalizePhone, validatePhone, validateVerificationCode } from '@/libs/valid/auth';
import { formatPhoneNumber } from '@/utills/format/phone-formats';
import { useState } from 'react';

interface PhoneVerificationProps {
  onSendCode?: (phoneNumber: string) => void;
  onVerifyCode?: (phoneNumber: string, code: string) => void;
  onResendCode?: (phoneNumber: string) => void;
  initialPhone?: string;
  timerDuration?: number;
  isLoading?: {
    sending?: boolean;
    verifying?: boolean;
    finding?: boolean;
  };
  customErrors?: {
    phone?: string;
    code?: string;
  };
  onPhoneChange?: (phone: string) => void;
  onCodeChange?: (code: string) => void;
  buttonText?: {
    send?: string;
    verify?: string;
    resend?: string;
  };
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({
  onSendCode,
  onVerifyCode,
  onResendCode,
  initialPhone = '',
  timerDuration = 300,
  isLoading = {},
  customErrors = {},
  onPhoneChange,
  onCodeChange,
  buttonText = {
    send: '인증번호 받기',
    verify: '확인',
    resend: '재전송',
  },
}) => {
  const [phoneNumber, setPhoneNumber] = useState(
    initialPhone ? formatPhoneNumber(initialPhone) : ''
  );
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [errors, setErrors] = useState<{
    phone?: string;
    code?: string;
  }>({});
  const { start, formattedTime, isTimeout } = useTimer(timerDuration);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input);
    setPhoneNumber(formatted);
    setErrors((prev) => ({ ...prev, phone: undefined }));
    onPhoneChange?.(normalizePhone(formatted));
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
    setErrors((prev) => ({ ...prev, code: undefined }));
    onCodeChange?.(e.target.value);
  };

  const handleSendCode = () => {
    const sanitizedPhone = normalizePhone(phoneNumber);
    const validation = validatePhone(sanitizedPhone);

    if (!validation.isValid) {
      setErrors({ phone: validation.error });
      return;
    }

    setIsCodeSent(true);
    start();
    onSendCode?.(sanitizedPhone);
  };

  const handleVerifyCode = () => {
    const codeValidation = validateVerificationCode(verificationCode);

    if (!codeValidation.isValid) {
      setErrors({ code: codeValidation.error });
      return;
    }

    onVerifyCode?.(normalizePhone(phoneNumber), verificationCode.trim());
  };

  const handleResend = () => {
    const sanitizedPhone = normalizePhone(phoneNumber);
    const validation = validatePhone(sanitizedPhone);

    if (!validation.isValid) {
      setErrors({ phone: validation.error });
      return;
    }

    start(); // 타이머 재시작
    onResendCode?.(sanitizedPhone);
  };

  const displayErrors = {
    phone: customErrors.phone || errors.phone,
    code: customErrors.code || errors.code,
  };

  return (
    <>
    <div className="gap-s-24 flex flex-col">

      <Input
        label='휴대폰 번호'
        type='tel'
        inputMode='numeric'
        placeholder='010-0000-0000'
        value={phoneNumber}
        onChange={handlePhoneChange}
        showCancelToggle={!!phoneNumber}
        hasError={!!displayErrors.phone}
        errorMessage={displayErrors.phone || ''}
      />

      {isCodeSent && (
        <Input
          label='인증번호'
          type='text'
          inputMode='numeric'
          timer={formattedTime}
          splitedRightElement={
            <button
              onClick={handleResend}
              className='text-primary-800 text-label-l font-semibold'
              disabled={isLoading.sending}
            >
              {buttonText.resend}
            </button>
          }
          variant='splited'
          maxLength={6}
          placeholder='인증번호 6자리를 입력해 주세요.'
          value={verificationCode}
          onChange={handleCodeChange}
          hasError={!!displayErrors.code || isTimeout}
          errorMessage={displayErrors.code || (isTimeout ? '인증번호를 다시 보내주세요.' : '')}
          onBeforeInput={(e) => {
            const be = e as unknown as InputEvent;
            if (be.data && /[^\d]/.test(be.data)) {
              e.preventDefault();
            }
          }}
        />
      )}
    </div>

      {!isCodeSent ? (
        <Button
          disabled={normalizePhone(phoneNumber).length !== 11 || isLoading.sending || isLoading.finding}
          isFloat
          onClick={handleSendCode}
        >
          {isLoading.finding
            ? '가입 여부 확인 중...'
            : isLoading.sending
              ? '전송 중...'
              : buttonText.send}
        </Button>
      ) : (
        <Button
          disabled={verificationCode.length !== 6 || isLoading.verifying}
          isFloat
          onClick={handleVerifyCode}
        >
          {isLoading.verifying ? '확인 중...' : buttonText.verify}
        </Button>
      )}
    </>
  );
};

export default PhoneVerification;