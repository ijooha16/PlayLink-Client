import { z } from 'zod';

/**
 * 전화번호에서 숫자만 추출합니다
 */
export const normalizePhone = (phone: string): string => phone.replace(/[^0-9]/g, '');

/**
 * 전화번호를 하이픈 포맷으로 변환합니다 (010-1234-5678)
 */
export const formatPhoneNumber = (value: string): string => {
  const numbers = normalizePhone(value);
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  }
};

/**
 * 전화번호 중간 자리를 마스킹합니다 (010-****-5678)
 */
export const maskPhoneNumber = (phone: string): string => {
  const normalized = normalizePhone(phone);
  return normalized.length === 11
    ? `${normalized.slice(0, 3)}-****-${normalized.slice(7)}`
    : phone;
};

/**
 * 전화번호 형식이 올바른지 검증합니다 (010-1234-5678 형식)
 */
export const isValidPhoneFormat = (phone: string): boolean =>
  /^01[016789]-\d{3,4}-\d{4}$/.test(phone);

const phoneSchema = z
  .string({ required_error: '휴대폰 번호를 입력해 주세요.' })
  .min(1, '휴대폰 번호를 입력해 주세요.')
  .transform((val) => normalizePhone(val))
  .refine((val) => val.length === 11, '휴대폰 번호는 11자리여야 합니다.')
  .refine((val) => /^01[016789]\d{8}$/.test(val), '올바른 휴대폰 번호 형식이 아닙니다.');

export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  const result = phoneSchema.safeParse(phone);
  return result.success
    ? { isValid: true }
    : { isValid: false, error: result.error.errors[0].message };
};