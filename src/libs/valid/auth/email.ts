import { z } from 'zod';

const emailSchema = z
  .string({ required_error: '이메일을 입력해 주세요.' })
  .min(1, '이메일을 입력해 주세요.')
  .email('올바른 형식의 이메일 주소를 입력해 주세요.');

export const validateEmail = (email: string): string => {
  if (!email) {
    return '';
  }

  const normalized = email.trim();
  const result = emailSchema.safeParse(normalized);
  return result.success ? '' : result.error.errors[0].message;
};
