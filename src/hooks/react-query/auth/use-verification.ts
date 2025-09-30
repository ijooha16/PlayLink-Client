import { useEmail } from '@/hooks/react-query/email/useEmail';
import { useEmailVerify } from '@/hooks/react-query/email/useEmailVerify';
import { useSms } from '@/hooks/react-query/sms/useSms';
import { useSmsVerify } from '@/hooks/react-query/sms/useSmsVerify';
import { useState } from 'react';
import { handleVerificationError } from './use-find-account';

type VerificationType = 'phone' | 'email';

interface UseVerificationOptions {
  type: VerificationType;
  onVerifySuccess?: (data: any) => void;
  onSendSuccess?: () => void;
}

interface UseVerificationReturn {
  send: (target: string) => void;
  verify: (target: string, code: string) => void;
  resend: (target: string) => void;
  errors: {
    phone?: string;
    email?: string;
    code?: string;
  };
  setErrors: React.Dispatch<React.SetStateAction<{
    phone?: string;
    email?: string;
    code?: string;
  }>>;
  isLoading: {
    sending: boolean;
    verifying: boolean;
  };
}

export const useVerification = (options: UseVerificationOptions): UseVerificationReturn => {
  const { type, onVerifySuccess, onSendSuccess } = options;
  const [errors, setErrors] = useState<{
    phone?: string;
    email?: string;
    code?: string;
  }>({});

  // SMS 관련 hooks
  const { mutate: smsSend, isPending: isSmsSending } = useSms({
    onSuccess: () => {
      setErrors({});
      // alert('인증번호를 발송하였습니다.');
      onSendSuccess?.();
    },
    onError: (err: Error) => {
      const errorMessage = handleVerificationError(err, 'phone');
      setErrors({ phone: errorMessage });
    },
  });

  const { mutate: smsVerify, isPending: isSmsVerifying } = useSmsVerify({
    onSuccess: (data?: { status: string }) => {
      if (data?.status === 'success') {
        setErrors({});
        onVerifySuccess?.(data);
      } else {
        setErrors({ code: '인증번호가 올바르지 않습니다.' });
      }
    },
    onError: () => {
      setErrors({ code: '인증번호가 올바르지 않습니다.' });
    },
  });

  // Email 관련 hooks
  const { mutate: emailSend, isPending: isEmailSending } = useEmail({
    onSuccess: () => {
      setErrors({});
      alert('인증번호를 발송하였습니다.');
      onSendSuccess?.();
    },
    onError: (err: Error) => {
      const errorMessage = handleVerificationError(err, 'email');
      setErrors({ email: errorMessage });
    },
  });

  const { mutate: emailVerify, isPending: isEmailVerifying } = useEmailVerify({
    onSuccess: (data?: { status: string }) => {
      if (data?.status !== 'error') {
        setErrors({});
        onVerifySuccess?.(data);
      } else {
        setErrors({ code: '인증번호가 올바르지 않습니다.' });
      }
    },
    onError: () => {
      setErrors({ code: '인증번호가 올바르지 않습니다.' });
    },
  });

  const send = (target: string) => {
    if (type === 'phone') {
      smsSend({ phoneNumber: target });
    } else {
      emailSend({ email: target });
    }
  };

  const verify = (target: string, code: string) => {
    if (type === 'phone') {
      smsVerify({ phoneNumber: target, code });
    } else {
      emailVerify({ email: target, code });
    }
  };

  const resend = send;

  return {
    send,
    verify,
    resend,
    errors,
    setErrors,
    isLoading: {
      sending: type === 'phone' ? isSmsSending : isEmailSending,
      verifying: type === 'phone' ? isSmsVerifying : isEmailVerifying,
    },
  };
};