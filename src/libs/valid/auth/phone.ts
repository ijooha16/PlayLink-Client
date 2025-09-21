import { z } from 'zod';

const phoneSchema = z
  .string({ required_error: '휴대폰 번호를 입력해 주세요.' })
  .min(1, '휴대폰 번호를 입력해 주세요.')
  .transform((val) => val.replace(/[^0-9]/g, ''))
  .refine((val) => val.length === 11, '휴대폰 번호는 11자리여야 합니다.')
  .refine((val) => /^01[016789]\d{8}$/.test(val), '올바른 휴대폰 번호 형식이 아닙니다.');

export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  const result = phoneSchema.safeParse(phone);
  return result.success
    ? { isValid: true }
    : { isValid: false, error: result.error.errors[0].message };
};

export const normalizePhone = (phone: string): string => phone.replace(/[^0-9]/g, '');

export const isValidPhoneFormat = (phone: string): boolean => /^01[016789]-\d{3,4}-\d{4}$/.test(phone);

export const maskPhoneNumber = (phone: string): string => {
  const normalized = normalizePhone(phone);
  return normalized.length === 11
    ? `${normalized.slice(0, 3)}-****-${normalized.slice(7)}`
    : phone;
};