import { useMutation } from '@tanstack/react-query';
import { findAccountByPhone, findAccountByPhoneEmail } from '@/services/auth/find-account';

type FindAccountByPhoneType = {
  phoneNumber: string;
};

type FindAccountByPhoneEmailType = {
  phoneNumber: string;
  email: string;
};

export const useFindAccountByPhone = (options?: any) => {
  return useMutation<any, any, FindAccountByPhoneType>({
    mutationFn: findAccountByPhone,
    ...options
  });
};

export const useFindAccountByPhoneEmail = (options?: any) => {
  return useMutation<any, any, FindAccountByPhoneEmailType>({
    mutationFn: findAccountByPhoneEmail,
    ...options
  });
};