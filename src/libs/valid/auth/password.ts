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

/**
 * 디바이스 ID 기반으로 백엔드 요구사항을 만족하는 비밀번호를 생성한다.
 * - 8~16자 범위 유지 (현재 8자)
 * - 영문/숫자/특수문자 각각 최소 1자 포함
 */
export const generatePasswordFromDeviceId = (deviceId: string): string => {
  const sanitized = (deviceId ?? '').replace(/[^a-zA-Z0-9]/g, '');
  const fallback = 'Playl1';
  let base = sanitized.slice(0, 6);

  if (base.length < 6) {
    base = (base + fallback).slice(0, 6);
  }

  if (!/[a-zA-Z]/.test(base)) {
    base = `A${base.slice(1) || fallback.slice(1)}`;
  }

  if (!/\d/.test(base)) {
    base = `${base.slice(0, 5) || fallback.slice(0, 5)}1`;
  }

  const candidate = `${base.slice(0, 6)}Q!`;
  return candidate.slice(0, 8);
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
