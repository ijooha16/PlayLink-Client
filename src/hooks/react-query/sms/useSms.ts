import { fetchSms } from '@/libs/api/frontend/auth/sms';
import { useMutation } from '@tanstack/react-query';

interface authType {
  onSuccess?: (data?: unknown) => void;
  onError?: (err: Error) => void;
}

export const useSms = (obj: authType) => {
  return useMutation({
    mutationFn: fetchSms,
    onSuccess: (data) => obj.onSuccess?.(data),
    onError: (err) => obj.onError?.(err),
  });
};
