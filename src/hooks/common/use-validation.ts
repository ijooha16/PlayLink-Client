import type { Dispatch, RefObject, SetStateAction } from 'react';
import { useCallback } from 'react';

import { AuthValidatorKey, runAuthValidator } from '@/libs/valid/auth/validators';

type ExternalErrorsOption<T extends Record<string, string | undefined>> = {
  key: keyof T & string;
  setErrors: Dispatch<SetStateAction<T>>;
};

type UseValidationParams<T extends Record<string, string | undefined>> = {
  type: AuthValidatorKey;
  value: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  setFieldError?: (message: string) => void;
  externalErrors?: ExternalErrorsOption<T>;
};
/**
 * 인증 검증 훅
 * @param param0 
 * @returns 
 */
export const useValidation = <T extends Record<string, string | undefined> = Record<string, string | undefined>>(
  { type, value, inputRef, setFieldError, externalErrors }: UseValidationParams<T>
) => {
  const validate = useCallback(
    (shouldFocus = false) => {
      const message = runAuthValidator(type, value);

      setFieldError?.(message ?? '');

      if (externalErrors) {
        const { key, setErrors } = externalErrors;
        setErrors(prev => {
          const base = (prev ?? {}) as Record<string, string | undefined>;
          const next = { ...base };

          if (!message) {
            if (next[key] === undefined) return (prev ?? base) as T;
            delete next[key];
            return next as T;
          }

          next[key] = message;
          return next as T;
        });
      }

      if (shouldFocus && message) inputRef?.current?.focus();

      return !message;
    },
    [externalErrors, inputRef, setFieldError, type, value]
  );

  const handleBlur = useCallback(() => validate(), [validate]);

  return { validate, handleBlur };
};
