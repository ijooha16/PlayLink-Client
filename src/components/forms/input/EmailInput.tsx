'use client';

import { Check } from '@/components/shared/icons';
import Input from '@/components/ui/input';
import { validateEmail } from '@/libs/valid/auth/email';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { EmailInputProps } from './types';

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  (
    {
      value = '',
      onChange,
      onValidate,
      onBlur,
      disabled,
      placeholder = '이메일을 입력해주세요.',
      label = '이메일',
      hasError: externalHasError,
      errorMessage: externalErrorMessage,
      hasSuccess: externalHasSuccess,
      successMessage: externalSuccessMessage,
      showCancelToggle = true,
      validateOnChange = false,
      showCheckIcon = false,
      autoFocus = false,
      ...props
    },
    ref
  ) => {
    const [localError, setLocalError] = useState('');
    const [touched, setTouched] = useState(false);

    const validate = useCallback((email: string) => {
      const trimmed = email.trim();
      const error = validateEmail(trimmed);

      setLocalError(error);
      onValidate?.(!error, error);

      return !error;
    }, [onValidate]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange?.(newValue);

      // 실시간 validation 또는 touched 상태일 때 validation
      if (validateOnChange || (touched && newValue)) {
        if (newValue) {
          validate(newValue);
        } else {
          setLocalError('');
          onValidate?.(false, '');
        }
      } else if (!newValue) {
        setLocalError('');
        onValidate?.(false, '');
      }
    }, [onChange, validate, touched, validateOnChange, onValidate]);

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

    // 초기값이 있을 때 validation 실행 (마운트 시에만)
    useEffect(() => {
      if (value && (validateOnChange || autoFocus)) {
        validate(value);
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const displayError = externalErrorMessage || localError;
    const hasError = externalHasError || Boolean(displayError);

    const checkIcon = showCheckIcon ? (
      <div className="flex items-center justify-center w-[20px] h-[20px] rounded-full bg-primary-800">
        <Check size={16} className="text-white" />
      </div>
    ) : null;

    return (
      <Input
        ref={ref}
        label={label}
        type="email"
        variant="default"
        sizes="md"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        hasError={hasError}
        errorMessage={displayError}
        hasSuccess={externalHasSuccess}
        successMessage={externalSuccessMessage}
        showCancelToggle={!showCheckIcon && showCancelToggle && Boolean(value)}
        rightElement={checkIcon}
        disabled={disabled}
        autoComplete="email"
        autoFocus={autoFocus}
        {...props}
      />
    );
  }
);

EmailInput.displayName = 'EmailInput';