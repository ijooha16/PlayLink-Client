import { fetchSignIn } from '@/libs/api/auth/auth';
import { useMutation } from '@tanstack/react-query';

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
