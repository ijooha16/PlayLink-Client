'use client';

import { forwardRef, useCallback, useEffect, useState } from 'react';
import Input from '@/components/ui/input';
import { PhoneInputProps } from './types';
import { validatePhone, normalizePhone, formatPhoneNumber } from '@/libs/valid/auth';

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      value = '',
      onChange,
      onValidate,
      onBlur,
      disabled,
      placeholder = '010-0000-0000',
      label = '휴대폰 번호',
      hasError: externalHasError,
      errorMessage: externalErrorMessage,
      hasSuccess: externalHasSuccess,
      successMessage: externalSuccessMessage,
      showCancelToggle = true,
      validateOnComplete = true,
      autoFocus = false,
      ...props
    },
    ref
  ) => {
    const [localError, setLocalError] = useState('');
    const [touched, setTouched] = useState(false);

    const validate = useCallback((phone: string) => {
      const normalized = normalizePhone(phone);
      const result = validatePhone(normalized);
      const error = result.error || '';

      setLocalError(error);
      onValidate?.(result.isValid, error);

      return result.isValid;
    }, [onValidate]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhoneNumber(e.target.value);
      onChange?.(formatted);

      const normalized = normalizePhone(formatted);

      // 11자리 완성 시 즉시 validation 또는 touched 상태일 때 validation
      if ((validateOnComplete && normalized.length === 11) || (touched && formatted)) {
        if (formatted) {
          validate(formatted);
        } else {
          setLocalError('');
          onValidate?.(false, '');
        }
      } else if (!formatted) {
        setLocalError('');
        onValidate?.(false, '');
      }
    }, [onChange, validate, touched, validateOnComplete, onValidate]);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true);
      if (value) {
        validate(value);
      }
      onBlur?.(e);
    }, [value, validate, onBlur]);

    useEffect(() => {
      if (externalErrorMessage) {
        setLocalError(externalErrorMessage);
      }
    }, [externalErrorMessage]);

    const displayError = externalErrorMessage || localError;
    const hasError = externalHasError || Boolean(displayError);

    return (
      <Input
        ref={ref}
        label={label}
        type="tel"
        inputMode="numeric"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        hasError={hasError}
        errorMessage={displayError}
        hasSuccess={externalHasSuccess}
        successMessage={externalSuccessMessage}
        showCancelToggle={showCancelToggle && Boolean(value)}
        disabled={disabled}
        autoFocus={autoFocus}
        isSignupFlow
        {...props}
      />
    );
  }
);

PhoneInput.displayName = 'PhoneInput';