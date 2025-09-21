import { z } from 'zod';

const verificationCodeSchema = z
  .string({ required_error: '인증번호를 입력해 주세요.' })
  .min(1, '인증번호를 입력해 주세요.')
  .regex(/^\d+$/, '인증번호는 숫자만 입력 가능합니다.')
  .length(6, '인증번호는 6자리여야 합니다.');

export const validateVerificationCode = (code: string): { isValid: boolean; error?: string } => {
  const result = verificationCodeSchema.safeParse(code);
  return result.success
    ? { isValid: true }
    : { isValid: false, error: result.error.errors[0].message };
};