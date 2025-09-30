'use client';

import Input from '@/components/ui/input';
import { validatePassword, validatePasswordConfirm } from '@/libs/valid/auth';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { PasswordInputProps } from './types';

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      value = '',
      onChange,
      onValidate,
      onBlur,
      disabled,
      placeholder,
      label,
      hasError: externalHasError,
      errorMessage: externalErrorMessage,
      hasSuccess: externalHasSuccess,
      successMessage: externalSuccessMessage,
      helperText,
      showPasswordToggle = true,
      showCancelToggle = true,
      isConfirm = false,
      confirmValue,
      validateOnChange = false,
      ...props
    },
    ref
  ) => {
    const [localError, setLocalError] = useState('');
    const [touched, setTouched] = useState(false);

    const defaultLabel = isConfirm ? '비밀번호 확인' : '비밀번호';
    const defaultPlaceholder = isConfirm
      ? '비밀번호를 다시 입력해주세요'
      : '비밀번호를 입력해주세요';
    const defaultHelperText = !isConfirm && !value
      ? '영문, 숫자, 특수문자 조합 8~16자'
      : '';

    const validate = useCallback((password: string) => {
      let result;

      if (isConfirm && confirmValue !== undefined) {
        result = validatePasswordConfirm(confirmValue, password);
      } else if (!isConfirm) {
        result = validatePassword(password);
      } else {
        return true;
      }

      const error = result.error || '';
      setLocalError(error);
      onValidate?.(result.isValid, error);

      return result.isValid;
    }, [isConfirm, confirmValue, onValidate]);

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

    useEffect(() => {
      if (isConfirm && confirmValue !== undefined && touched && value) {
        validate(value);
      }
    }, [confirmValue, isConfirm, touched, value, validate]);

    const displayError = externalErrorMessage || localError;
    const hasError = externalHasError || Boolean(displayError);

    return (
      <Input
        ref={ref}
        label={label || defaultLabel}
        type="password"
        placeholder={placeholder || defaultPlaceholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        hasError={hasError}
        errorMessage={displayError}
        hasSuccess={externalHasSuccess}
        successMessage={externalSuccessMessage}
        helperText={helperText || defaultHelperText}
        showPasswordToggle={showPasswordToggle}
        showCancelToggle={showCancelToggle && Boolean(value)}
        disabled={disabled}
        autoComplete={isConfirm ? 'new-password' : 'current-password'}
        {...props}
      />
    );
  }
);

PasswordInput.displayName = 'PasswordInput';