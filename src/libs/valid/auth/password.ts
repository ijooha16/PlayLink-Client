import { z } from 'zod';

const passwordSchema = z
  .string({ required_error: '비밀번호를 입력해 주세요.' })
  .min(8, '영문, 숫자, 특수문자 조합 8~16자')
  .max(16, '영문, 숫자, 특수문자 조합 8~16자')
  .regex(/[a-zA-Z]/, '영문, 숫자, 특수문자 조합 8~16자')
  .regex(/\d/, '영문, 숫자, 특수문자 조합 8~16자')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, '영문, 숫자, 특수문자 조합 8~16자');
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false };
  }

  const result = passwordSchema.safeParse(password);
  return result.success
    ? { isValid: true }
    : { isValid: false, error: result.error.errors[0].message };
};

export const validatePasswordConfirm = (password: string, confirmPassword: string): { isValid: boolean; error?: string } => {
  if (!confirmPassword) {
    return { isValid: false };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: '비밀번호가 일치하지 않습니다.' };
  }

  return { isValid: true };
};