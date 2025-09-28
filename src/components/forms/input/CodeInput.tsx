'use client';

import Input from '@/components/ui/input';
import { validateVerificationCode } from '@/libs/valid/auth';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { CodeInputProps } from './types';

export const CodeInput = forwardRef<HTMLInputElement, CodeInputProps>(
  (
    {
      value = '',
      onChange,
      onValidate,
      onBlur,
      onResend,
      disabled,
      placeholder = '인증번호 6자리를 입력해주세요',
      label = '인증번호',
      hasError: externalHasError,
      errorMessage: externalErrorMessage,
      timer,
      isTimeout,
      isResending,
      maxLength = 6,
      validateOnComplete = true,
      ...props
    },
    ref
  ) => {
    const [localError, setLocalError] = useState('');
    const [touched, setTouched] = useState(false);

    const validate = useCallback((code: string) => {
      const trimmed = code.trim();
      const result = validateVerificationCode(trimmed);
      const error = result.error || '';

      setLocalError(error);
      onValidate?.(result.isValid, error);

      return result.isValid;
    }, [onValidate]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value.replace(/\D/g, '').slice(0, maxLength);
      onChange?.(newValue);

      // maxLength 달성 시 즉시 validation 또는 touched 상태일 때 validation
      if ((validateOnComplete && newValue.length === maxLength) || (touched && newValue)) {
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
    }, [onChange, validate, touched, validateOnComplete, onValidate, maxLength]);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true);
      if (value) {
        validate(value);
      }
      onBlur?.(e);
    }, [value, validate, onBlur]);

    const handleBeforeInput = useCallback((e: any) => {
      const be = e;
      if (be.data && /[^\d]/.test(be.data)) {
        e.preventDefault();
      }
    }, []);

    useEffect(() => {
      if (externalErrorMessage) {
        setLocalError(externalErrorMessage);
      }
    }, [externalErrorMessage]);

    const displayError = externalErrorMessage || localError || (isTimeout ? '인증번호를 다시 보내주세요.' : '');
    const hasError = externalHasError || Boolean(displayError) || isTimeout;

    const resendButton = onResend && (
      <button
        type="button"
        onClick={onResend}
        className="text-primary-800 text-label-l font-semibold whitespace-nowrap"
        disabled={isResending || disabled}
      >
        재전송
      </button>
    );

    return (
      <Input
        ref={ref}
        label={label}
        type="text"
        inputMode="numeric"
        variant="splited"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onBeforeInput={handleBeforeInput}
        hasError={hasError}
        errorMessage={displayError}
        timer={timer}
        maxLength={maxLength}
        disabled={disabled}
        splitedRightElement={resendButton}
        {...props}
      />
    );
  }
);

CodeInput.displayName = 'CodeInput';