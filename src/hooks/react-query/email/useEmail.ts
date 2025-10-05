import { fetchEmail } from '@/libs/api/frontend/auth/email';
import { useMutation } from '@tanstack/react-query';

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
