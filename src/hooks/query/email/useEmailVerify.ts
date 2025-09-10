import { useMutation } from '@tanstack/react-query';
import { fetchEmailVeriify } from '@/services/auth/email';

type VerifyType = {
  status: 'success' | 'error';
  message?: string;
};

type authType = {
  onSuccess?: (data?: VerifyType) => void;
  onError?: (err: Error) => void;
};

export const useEmailVerify = (obj: authType) => {
  return useMutation({
    mutationFn: fetchEmailVeriify,
    onSuccess: (data) => obj.onSuccess?.(data),
    onError: (err) => obj.onError?.(err),
  });
};
