'use client';

import { Location, Search, SearchNone } from '@/components/shared/icons';
import Input from '@/components/ui/input';
import { validateAddress } from '@/libs/valid/auth/address';
import { forwardRef, useCallback, useState, useEffect } from 'react';
import { AddressInputProps } from './types';

export const AddressInput = forwardRef<HTMLInputElement, AddressInputProps>(
  (
    {
      value = '',
      onChange,
      onValidate,
      onBlur,
      disabled,
      placeholder = '동/읍/면 검색 (EX.서초동)',
      label,
      hasError: externalHasError,
      errorMessage: externalErrorMessage,
      showCancelToggle = true,
      onCurrentLocationClick,
      loading = false,
      results = [],
      onResultSelect,
      autoFocus = false,
      ...props
    },
    ref
  ) => {
    const [localError, setLocalError] = useState('');
    const [touched, setTouched] = useState(false);

    const validate = useCallback((address: string) => {
      const trimmed = address.trim();
      const result = validateAddress(trimmed);
      const error = result.isValid ? '' : result.error || '';

      setLocalError(error);
      onValidate?.(!error, error);

      return !error;
    }, [onValidate]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange?.(newValue);

      if (!newValue) {
        setLocalError('');
        onValidate?.(false, '');
      } else if (touched) {
        validate(newValue);
      }
    }, [onChange, onValidate, touched, validate]);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true);
      if (value) {
        validate(value);
      }
      onBlur?.(e);
    }, [value, validate, onBlur]);

    const handleResultSelect = useCallback((item: { full: string; si: string; gu: string; dong: string }) => {
      onChange?.(item.dong);
      onResultSelect?.(item);
      setLocalError('');
      onValidate?.(true, '');
    }, [onChange, onResultSelect, onValidate]);

    useEffect(() => {
      if (externalErrorMessage) {
        setLocalError(externalErrorMessage);
      }
    }, [externalErrorMessage]);

    const displayError = externalErrorMessage || localError;
    const hasError = externalHasError || Boolean(displayError);

    return (
      <div className="w-full">
        <div className="gap-s-10 flex flex-col">
          <Input
            ref={ref}
            label={label}
            variant="gray"
            sizes="lg"
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            hasError={hasError}
            errorMessage={displayError}
            leftElement={<Search size={20} className="text-icon-netural" />}
            showCancelToggle={showCancelToggle && Boolean(value)}
            disabled={disabled}
            autoFocus={autoFocus}
            {...props}
          />

          {onCurrentLocationClick && (
            <div
              onClick={onCurrentLocationClick}
              className="flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-s-4 px-s-12 py-s-16"
            >
              <Location size={16} />
              <span className="label-m font-regular text-brand-primary">
                현재 위치로 설정 하기
              </span>
            </div>
          )}
        </div>

        <div className="h-[8px] bg-bg-normal"></div>

        {/* 검색 결과 */}
        {results.length === 0 && value && !loading && (
          <div className="mt-s-40 flex flex-col items-center gap-s-16">
            <SearchNone size={120} />
            <span className="text-center text-body-01 font-semibold text-text-strong">
              검색 결과가 없어요 <br />
              다시 입력해 주세요
            </span>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-s-20">
            {results.map((item, idx) => (
              <div
                key={`${item.full}-${idx}`}
                onClick={() => handleResultSelect(item)}
                className="hover:bg-bg-weak mx-s-20 flex min-h-[48px] w-full cursor-pointer gap-s-4 border-b border-line-normal px-s-12 py-s-16"
              >
                <span className="font-regular text-body-01 text-text-strong">
                  {item.si} {item.gu} <strong>{item.dong}</strong>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

AddressInput.displayName = 'AddressInput';