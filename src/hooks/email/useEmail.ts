import { useMutation } from '@tanstack/react-query';
import { fetchEmail } from '@/services/auth/email';

interface authType {
  onSuccess?: (data?: unknown) => void;
  onError?: (err: Error) => void;
}

export const useEmail = (obj: authType) => {
  return useMutation({
    mutationFn: fetchEmail,
    onSuccess: (data) => obj.onSuccess?.(data),
    onError: (err) => obj.onError?.(err),
  });
};
