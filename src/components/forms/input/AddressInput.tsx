'use client';

import { Location, Search, SearchNone } from '@/components/shared/icons';
import Input from '@/components/ui/input';
import { validateAddress } from '@/libs/valid/auth/address';
import { forwardRef, useCallback, useEffect, useState } from 'react';
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
      hasSuccess: externalHasSuccess,
      successMessage: externalSuccessMessage,
      showCancelToggle = true,
      onCurrentLocationClick,
      loading = false,
      results = [],
      onResultSelect,
      selectedValue,
      hasMore = false,
      onLoadMore,
      totalCount = 0,
      autoFocus = false,
      ...props
    },
    ref
  ) => {
    const [localError, setLocalError] = useState('');
    const [touched, setTouched] = useState(false);

    const validate = useCallback(
      (address: string) => {
        const trimmed = address.trim();
        const result = validateAddress(trimmed);
        const error = result.isValid ? '' : result.error || '';

        setLocalError(error);
        onValidate?.(!error, error);

        return !error;
      },
      [onValidate]
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange?.(newValue);

        if (!newValue) {
          setLocalError('');
          onValidate?.(false, '');
        } else if (touched) {
          validate(newValue);
        }
      },
      [onChange, onValidate, touched, validate]
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

    const handleResultSelect = useCallback(
      (item: { full: string; si: string; gu: string; dong: string }) => {
        console.log('AddressInput handleResultSelect:', item);
        onChange?.(item.full);
        onResultSelect?.(item);
        setLocalError('');
        onValidate?.(true, '');
      },
      [onChange, onResultSelect, onValidate]
    );

    useEffect(() => {
      if (externalErrorMessage) {
        setLocalError(externalErrorMessage);
      }
    }, [externalErrorMessage]);

    const displayError = externalErrorMessage || localError;
    const hasError = externalHasError || Boolean(displayError);

    return (
      <div className='w-full'>
        <div className='gap-s-10 flex flex-col'>
          <Input
            ref={ref}
            label={label}
            variant='gray'
            sizes='lg'
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            hasError={hasError}
            errorMessage={displayError}
            hasSuccess={externalHasSuccess}
            successMessage={externalSuccessMessage}
            leftElement={<Search size={20} className='text-icon-neutral' />}
            showCancelToggle={showCancelToggle && Boolean(value)}
            disabled={disabled}
            autoFocus={autoFocus}
            isSignupFlow
            {...props}
          />

          {onCurrentLocationClick && (
            <div
              onClick={onCurrentLocationClick}
              className='flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-s-4 py-s-16'
            >
              <Location size={16} />
              <span className='label-m font-regular text-brand-primary'>
                현재 위치로 설정 하기
              </span>
            </div>
          )}
        </div>

        <div className='h-[8px] bg-bg-normal'></div>

        {/* 검색 결과 */}
        {results.length === 0 && value && !loading && (
          <div className='mt-s-40 flex flex-col items-center gap-s-16'>
            <SearchNone size={120} />
            <span className='text-center text-body-01 font-semibold text-text-strong'>
              검색 결과가 없어요 <br />
              다시 입력해 주세요
            </span>
          </div>
        )}

        {results.length > 0 && (
          <div className='mt-s-20'>
            {totalCount > 0 && (
              <div className='mb-s-12 flex items-center justify-between px-s-12'>
                <span className='text-caption-01 text-text-alternative'>
                  총 {totalCount}개의 결과
                </span>
              </div>
            )}
            {results.map((item, idx) => (
              <div
                key={`${item.full}-${idx}`}
                onClick={() => handleResultSelect(item)}
                className={`flex min-h-[48px] w-full cursor-pointer gap-s-4 border-b border-line-normal px-s-12 py-s-16 transition-colors ${
                  selectedValue === item.full ? 'rounded-12 bg-bg-neutral' : ''
                }`}
                aria-selected={selectedValue === item.full}
              >
                <span className='font-regular text-body-01 text-text-strong'>
                  {item.si} {item.gu} <strong>{item.dong}</strong>
                </span>
              </div>
            ))}
            {hasMore && onLoadMore && (
              <div
                onClick={onLoadMore}
                className='flex min-h-[48px] w-full cursor-pointer items-center justify-center px-s-12 py-s-16'
              >
                <span className='text-body-01 font-medium text-brand-primary'>
                  {loading ? '로딩 중...' : '더보기'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

AddressInput.displayName = 'AddressInput';
