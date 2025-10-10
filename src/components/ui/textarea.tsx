import { cva, VariantProps } from 'class-variance-authority';
import React, { forwardRef, useId, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';

const textareaVariants = cva('bg-transparent p-3 flex flex-col flex-1 w-full', {
  variants: {
    variant: {
      default: 'rounded-12',
      gray: 'rounded-12 bg-bg-normal',
    },
    state: {
      default: 'border border-border-neutral',
      focused: 'border border-border-strong',
      error: 'border border-system-error',
      success: 'border border-system-information',
      disabled: 'bg-gray-200 text-text-disabled border border-border-neutral',
    },
  },
});

type TextAreaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'className'
> &
  VariantProps<typeof textareaVariants> & {
    wrapperClassName?: string;
    hasError?: boolean;
    errorMessage?: string;
    hasSuccess?: boolean;
    successMessage?: string;
    helperText?: string;
    label?: string;
    showCharCount?: boolean;
    maxLength?: number;
    minHeight?: number;
    maxHeight?: number;
    autoGrow?: boolean;
  };

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      variant = 'default',
      state = 'default',
      errorMessage,
      successMessage,
      helperText,
      hasError,
      hasSuccess,
      label,
      showCharCount = true,
      maxLength = 500,
      onBlur,
      onChange,
      wrapperClassName,
      id,
      disabled,
      minHeight = 80,
      maxHeight = 240,
      autoGrow = true, // <- 기본 켬
      value = '',
      ...props
    },
    ref
  ) => {
    const reactId = useId();
    const inputId = id ?? `textarea-${reactId}`;

    const [focused, setFocused] = useState(false);
    const [touched, setTouched] = useState(false);

    const innerRef = React.useRef<HTMLTextAreaElement | null>(null);
    React.useImperativeHandle(
      ref,
      () => innerRef.current as HTMLTextAreaElement
    );

    // 높이 자동 조절 함수
    const resize = React.useCallback(() => {
      const el = innerRef.current;
      if (!el || !autoGrow) return;

      // 계산 전 height 초기화
      el.style.height = 'auto';

      // 실제 컨텐츠 높이
      const next = Math.min(maxHeight, el.scrollHeight);
      el.style.height = `${next}px`;

      // 스크롤바 처리
      el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
    }, [autoGrow, maxHeight]);

    // 값이 바뀔 때도 재계산(외부에서 value 제어 시)
    React.useLayoutEffect(() => {
      resize();
    }, [value, resize]);

    const finalSuccess = React.useMemo(
      () => hasSuccess || (touched && !hasError && Boolean(value)),
      [hasSuccess, touched, hasError, value]
    );

    const finalState = React.useMemo(() => {
      if (disabled) return 'disabled';
      if (focused) return 'focused';
      if (hasError) return 'error';
      if (finalSuccess) return 'success';
      return state;
    }, [disabled, hasError, finalSuccess, focused, state]);

    const describedById = errorMessage ? `${inputId}-error` : undefined;
    const currentLength = String(value).length;

    return (
      <div
        className={twMerge('flex w-full flex-col gap-s-8', wrapperClassName)}
      >
        {label && (
          <label
            htmlFor={inputId}
            className='block text-left text-body-02 font-medium text-text-alternative'
          >
            {label}
          </label>
        )}

        <div
          className={twMerge(
            textareaVariants({ variant, state: finalState }),
            'flex flex-col'
          )}
        >
          <textarea
            id={inputId}
            ref={innerRef}
            disabled={disabled}
            aria-invalid={hasError ? true : undefined}
            aria-describedby={describedById}
            className='font-regular w-full resize-none bg-transparent text-body-02 text-text-strong outline-none placeholder:text-text-disabled'
            style={{ minHeight, maxHeight, overflowY: 'hidden' }}
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
              setFocused(false);
              setTouched(true);
              onBlur?.(e);
            }}
            onInput={resize}
            onChange={(e) => {
              onChange?.(e);
            }}
            value={value}
            maxLength={maxLength}
            {...props}
          />

          {showCharCount && (
            <div className='flex justify-start pt-s-8'>
              <span className='text-caption-01 font-medium text-text-disabled'>
                <span
                  className={
                    hasError
                      ? 'text-system-error'
                      : currentLength > 0
                        ? 'text-brand-primary'
                        : ''
                  }
                >
                  {currentLength}
                </span>
                /{maxLength}
              </span>
            </div>
          )}
        </div>

        {!focused && hasError && errorMessage && (
          <p
            id={describedById}
            className='w-full text-left text-caption-01 text-system-error'
          >
            {typeof errorMessage === 'string'
              ? errorMessage
              : JSON.stringify(errorMessage)}
          </p>
        )}

        {!hasError && !hasSuccess && helperText && (
          <p className='w-full pt-s-2 text-left text-caption-01 text-text-disabled'>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

export default TextArea;
