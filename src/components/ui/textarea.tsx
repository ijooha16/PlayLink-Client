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
    /** 외부 래퍼에 적용할 클래스 */
    wrapperClassName?: string;
    /** 에러여부(외부 제어) */
    hasError?: boolean;
    /** 에러메시지 텍스트 */
    errorMessage?: string;
    /** 성공여부(외부 제어) */
    hasSuccess?: boolean;
    /** 성공메시지 텍스트 */
    successMessage?: string;
    /** 도움말 텍스트 (에러가 없을 때 표시) */
    helperText?: string;
    /** 상단 라벨 */
    label?: string;
    /** 글자수 표시 여부 */
    showCharCount?: boolean;
    /** 최대 글자수 */
    maxLength?: number;
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
      wrapperClassName,
      id,
      disabled,
      value = '',
      ...props
    },
    ref
  ) => {
    const reactId = useId();
    const inputId = id ?? `textarea-${reactId}`;

    const [focused, setFocused] = useState(false);
    const [hover, setHover] = useState(false);
    const [touched, setTouched] = useState(false);

    // 자동 success 판단: 외부에서 전달된 hasSuccess 또는 (touched + 에러없음 + 값있음)
    const finalSuccess = useMemo(() => {
      return hasSuccess || (touched && !hasError && Boolean(value));
    }, [hasSuccess, touched, hasError, value]);

    // disabled > focused > error > success > hover > state 순으로 우선순위
    const finalState = useMemo(() => {
      if (disabled) return 'disabled';
      if (focused) return 'focused';
      if (hasError) return 'error';
      if (finalSuccess) return 'success';
      return state;
    }, [disabled, hasError, finalSuccess, focused, hover, state]);

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
            textareaVariants({
              variant,
              state: finalState,
            }),
            'flex flex-col'
          )}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <textarea
            id={inputId}
            ref={ref}
            disabled={disabled}
            aria-invalid={hasError ? true : undefined}
            aria-describedby={describedById}
            className='font-regular min-h-[100px] w-full resize-none bg-transparent text-body-02 text-text-strong outline-none placeholder:text-text-disabled'
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
              setFocused(false);
              setTouched(true);
              onBlur?.(e);
            }}
            value={value}
            maxLength={maxLength}
            {...props}
          />

          {/* 글자수 표시 - 하단 */}
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

        {/* 에러 메시지 - 포커스 해제 시에만 표시 */}
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

        {/* 도움말 텍스트 */}
        {!hasError && !hasSuccess && helperText && (
          <p className='w-full pt-s-2 text-left text-caption-01 text-text-disabled'>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
export default TextArea;
