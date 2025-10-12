'use client';

import Input from '@/components/ui/input';
import { validateNickname } from '@/libs/valid/auth/nickname';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { NicknameInputProps } from './types';
import { checkNicknameDuplicate } from '@/libs/api';
import useDebounce from '@/hooks/common/use-debounce';

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

    const debouncedValue = useDebounce(value, 1000);

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
          const response = await checkNicknameDuplicate(trimmed);

          if (myId !== reqIdRef.current) {
            return false;
          }

          // API 응답: { status, errCode, message, data }
          if (response.status === 'error') {
            const msg =
              response.message || '닉네임 확인 중 오류가 발생했습니다.';
            setLocalError(msg);
            onValidate?.(false, msg);
            return false;
          }

          // errCode가 0이 아니면 중복 또는 에러
          if (response.errCode !== 0) {
            const msg = response.message || '이미 사용 중인 닉네임입니다.';
            setLocalError(msg);
            onValidate?.(false, msg);
            return false;
          }

          // errCode가 0이면 사용 가능
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

        // 입력 중에는 서버 검증하지 않고 에러만 초기화
        if (!newValue) {
          setLocalError('');
          onValidate?.(false, '');
        }
      },
      [onChange, onValidate]
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

    // 디바운스
    useEffect(() => {
      if (!validateOnChange) return;

      if (!debouncedValue || !debouncedValue.trim()) {
        setLocalError('');
        onValidate?.(false, '');
        return;
      }

      // 서버 페칭
      validate(debouncedValue);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue, validateOnChange]);

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
