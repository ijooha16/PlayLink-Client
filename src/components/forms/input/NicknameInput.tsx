'use client';

import Input from '@/components/ui/input';
import { validateNickname } from '@/libs/valid/auth/nickname';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { NicknameInputProps } from './types';
import { checkNicknameDuplicate } from '@/libs/api';

export const NicknameInput = forwardRef<HTMLInputElement, NicknameInputProps>(
  (
    {
      value = '',
      onChange,
      onValidate,
      onBlur,
      disabled,
      placeholder = '닉네임을 입력해주세요',
      label = '닉네임',
      hasError: externalHasError,
      errorMessage: externalErrorMessage,
      hasSuccess: externalHasSuccess,
      successMessage: externalSuccessMessage,
      helperText,
      showCancelToggle = true,
      validateOnChange = true,
      autoFocus = false,
      ...props
    },
    ref
  ) => {
    const [localError, setLocalError] = useState('');
    const [touched, setTouched] = useState(false);
    const reqIdRef = useRef(0);

    const defaultHelperText = !value.length
      ? '한글, 영문, 숫자 2~12자로 입력해주세요'
      : '';

    const validate = useCallback(
      async (nickname: string) => {
        const trimmed = nickname.trim();

        const syncError = validateNickname(trimmed);
        if (syncError) {
          setLocalError(syncError);
          onValidate?.(false, syncError);
          return false;
        }

        const myId = ++reqIdRef.current;
        try {
          const { data } = await checkNicknameDuplicate(trimmed);
          if (myId !== reqIdRef.current) {
            return false;
          }

          if (data?.isDuplicate === 1) {
            const msg = '이미 존재하는 닉네임입니다.';
            setLocalError(msg);
            onValidate?.(false, msg);
            return false;
          }

          setLocalError('');
          onValidate?.(true, '');
          return true;
        } catch (e) {
          const msg = '닉네임 중복 확인 중 오류가 발생했어요.';
          setLocalError(msg);
          onValidate?.(false, msg);
          return false;
        }
      },
      [onValidate]
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
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
      (e: React.FocusEvent<HTMLInputElement>) => {
        setTouched(true);
        if (value) {
          validate(value);
        }
        onBlur?.(e);
      },
      [value, validate, onBlur]
    );

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
        type='text'
        variant='default'
        sizes='lg'
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        hasError={hasError}
        errorMessage={displayError}
        hasSuccess={externalHasSuccess}
        successMessage={externalSuccessMessage}
        helperText={helperText || defaultHelperText}
        showCancelToggle={showCancelToggle && Boolean(value)}
        disabled={disabled}
        autoFocus={autoFocus}
        isSignupFlow
        {...props}
      />
    );
  }
);

NicknameInput.displayName = 'NicknameInput';
