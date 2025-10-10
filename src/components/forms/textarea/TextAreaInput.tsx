'use client';

import TextArea from '@/components/ui/textarea';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { TextAreaInputProps } from './types';

export const TextAreaInput = forwardRef<
  HTMLTextAreaElement,
  TextAreaInputProps
>(
  (
    {
      value = '',
      onChange,
      onValidate,
      onBlur,
      disabled,
      placeholder = '내용을 입력해주세요',
      label,
      hasError: externalHasError,
      errorMessage: externalErrorMessage,
      hasSuccess: externalHasSuccess,
      successMessage: externalSuccessMessage,
      helperText,
      showCharCount = true,
      maxLength = 500,
      minHeight = 100,
      maxHeight = 300,
      validateOnChange = false,
      autoFocus = false,
      ...props
    },
    ref
  ) => {
    const [localError, setLocalError] = useState('');
    const [touched, setTouched] = useState(false);

    const validate = useCallback(
      (text: string) => {
        // 기본적인 validation (빈 값 체크)
        if (!text.trim()) {
          const error = '내용을 입력해주세요';
          setLocalError(error);
          onValidate?.(false, error);
          return false;
        }

        setLocalError('');
        onValidate?.(true, '');
        return true;
      },
      [onValidate]
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      },
      [onChange, validate, touched, validateOnChange, onValidate]
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setTouched(true);
        if (value && validateOnChange) {
          validate(value);
        }
        onBlur?.(e);
      },
      [value, validate, onBlur, validateOnChange]
    );

    useEffect(() => {
      if (externalErrorMessage) {
        setLocalError(externalErrorMessage);
      }
    }, [externalErrorMessage]);

    const displayError = externalErrorMessage || localError;
    const hasError = externalHasError || Boolean(displayError);

    return (
      <TextArea
        ref={ref}
        label={label}
        variant='default'
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        hasError={hasError}
        errorMessage={displayError}
        hasSuccess={externalHasSuccess}
        successMessage={externalSuccessMessage}
        helperText={helperText}
        showCharCount={showCharCount}
        maxLength={maxLength}
        disabled={disabled}
        autoFocus={autoFocus}
        minHeight={minHeight}
        maxHeight={maxHeight}
        {...props}
      />
    );
  }
);

TextAreaInput.displayName = 'TextAreaInput';
