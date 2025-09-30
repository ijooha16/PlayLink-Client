import { validateEmail } from './email';
import { validateNickname } from './nickname';
import { validatePhone } from './phone';
import { validatePassword, validatePasswordConfirm } from './password';
import { validateVerificationCode } from './code';
import { validateAddress } from './address';

type ValidationResult = { isValid: boolean; error?: string } | string;

const toMessage = (result: ValidationResult): string | null => {
  if (typeof result === 'string') {
    return result || null;
  }
  return result.isValid ? null : result.error ?? '';
};

export const authValidators = {
  email: (value: string) => toMessage(validateEmail(value)),
  nickname: (value: string) => toMessage(validateNickname(value)),
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

export { validatePasswordConfirm };
