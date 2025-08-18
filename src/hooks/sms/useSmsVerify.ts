import { useMutation } from '@tanstack/react-query';
import { fetchSmsVerify } from '@/services/auth/sms';

interface authType {
  onSuccess?: (data?: unknown) => void;
  onError?: (err: Error) => void;
}

export const useSmsVerify = (obj: authType) => {
  return useMutation({
    mutationFn: fetchSmsVerify,
    onSuccess: (data) => obj.onSuccess?.(data),
    onError: (err) => obj.onError?.(err),
  });
};
