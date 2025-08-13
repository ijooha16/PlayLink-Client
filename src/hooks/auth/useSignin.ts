import { useMutation } from '@tanstack/react-query';
import { fetchSignIn } from '@/services/auth/auth';

interface authType {
  onSuccess?: (data?: unknown) => void;
  onError?: (err: Error) => void;
}

export const useSignin = (obj: authType) => {
  return useMutation({
    mutationFn: fetchSignIn,
    onSuccess: (data) => obj.onSuccess?.(data),
    onError: (err) => obj.onError?.(err),
  });
};
