import { PATHS } from '@/constant';
import { TOAST_ALERT_MESSAGES } from '@/constant/toast-alert';
import { resetPassword } from '@/libs/api/auth/reset-password';
import { toast } from '@/utills/toast';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      router.push(PATHS.AUTH.RESET_PASSWORD + '/result');
      toast.success(TOAST_ALERT_MESSAGES.RESET_PASSWORD_SUCCESS);
    },
    onError: () => {
      toast.error(TOAST_ALERT_MESSAGES.RESET_PASSWORD_FAILURE);
    },
  });
};
