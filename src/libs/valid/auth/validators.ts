import { validateEmail } from './email';
import { validateNickname } from './nickname';
import { validatePhone } from './phone';
import { validatePassword } from './password';
import { validateVerificationCode } from './code';
import { validateAddress } from './address';

const toMessage = (result: { isValid: boolean; error?: string } | null | undefined) => {
  if (!result) return null;
  return result.isValid ? null : result.error ?? '';
};

export const authValidators = {
  email: (value: string) => validateEmail(value),
  nickname: (value: string) => validateNickname(value),
  phone: (value: string) => toMessage(validatePhone(value)),
  password: (value: string) => toMessage(validatePassword(value)),
  code: (value: string) => toMessage(validateVerificationCode(value.trim())),
  address: (value: string) => toMessage(validateAddress(value)),
} as const;

export type AuthValidatorKey = keyof typeof authValidators;

export const runAuthValidator = (type: AuthValidatorKey, value: string): string | null => {
  const validator = authValidators[type];
  return validator ? validator(value) : null;
};
