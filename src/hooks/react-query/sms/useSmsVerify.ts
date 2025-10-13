import { fetchSmsVerify } from '@/libs/api/frontend/auth/sms';
import { useMutation } from '@tanstack/react-query';

type VerifyType = {
  status: 'success' | 'error';
  message?: string;
};

type authType = {
  onSuccess?: (data?: VerifyType) => void;
  onError?: (err: Error) => void;
};

export const useSmsVerify = (obj: authType) => {
  return useMutation({
    mutationFn: fetchSmsVerify,
    onSuccess: (data) => obj.onSuccess?.(data),
    onError: (err) => obj.onError?.(err),
  });
};
