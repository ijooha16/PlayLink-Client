import React, { forwardRef, useState } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import { Eye, EyeOff } from '@/components/common/icons';

const inputVariants = cva(
  'w-full px-4 py-2 focus:ring-0 focus:outline-none text-body-02 h-[48px]',
  {
    variants: {
      variant: {
        disabled: 'bg-gray-200 text-text-disabled',
        default:
          'bg-transparent rounded-lg border border-border-neutral focus:border-border-strong placeholder-text-disabled',
        error:
          'bg-transparent rounded-lg border border-system-error placeholder-text-disabled disabled:bg-bg-neutral',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
      sizes: {
        lg: 'text-body-02',
        md: 'text-md',
        sm: 'text-sm',
        xs: 'text-xs',
      },
      line: {
        underline: 'underline',
        cancelLine: 'line-through',
        default: 'no-underline',
      },
    },
  }
);

type InputProps = VariantProps<typeof inputVariants> &
  React.InputHTMLAttributes<HTMLInputElement> & {
    className?: never;
    errorMessage?: string;
    hasError?: boolean;
    label?: string;
    timer?: string;
    showPasswordToggle?: boolean;
    rightElement?: React.ReactNode;
  };

/**
 * 인풋 공통 컴포넌트
 * @param variant - Input의 테마 종류
 * @param sizes - Input의 크기 종류
 * @param label - Input 상단에 표시될 라벨
 * @param timer - 우측에 표시될 타이머
 * @param showPasswordToggle - 비밀번호 보기/숨기기 토글 버튼 표시 여부
 * @param rightElement - 우측에 표시될 커스텀 요소
 * @returns - <input />
 */

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant='default',
      sizes='md',
      line,
      align,
      errorMessage,
      hasError,
      label,
      timer,
      showPasswordToggle,
      rightElement,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const finalVariant = hasError ? 'error' : variant;
    const [showPassword, setShowPassword] = useState(false);

    // type이 password인 경우 showPassword 상태에 따라 타입 변경
    const inputType =
      type === 'password' && !showPassword
        ? 'password'
        : type === 'password' && showPassword
          ? 'text'
          : type;

    return (
      <div className='w-full'>
        {label && (
          <label className='text-body-02 text-text-alternative mb-s-8 block text-left font-medium'>
            {label}
          </label>
        )}
        <div className='relative w-full'>
          <input
            ref={ref}
            type={inputType}
            className={twMerge(
              inputVariants({ variant: finalVariant, sizes, line, align }),
              timer || showPasswordToggle || rightElement ? 'pr-12' : ''
            )}
            {...props}
          />

          {/* 우측 요소 컨테이너 */}
          {(timer || showPasswordToggle || rightElement) && (
            <div className='absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2'>
              {/* 타이머 표시 */}
              {timer && (
                <span className='text-system-error text-caption font-medium'>
                  {timer}
                </span>
              )}

              {/* 비밀번호 토글 버튼 */}
              {type === 'password' && showPasswordToggle && (
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='p-1 transition-colors'
                  aria-label={
                    showPassword ? '비밀번호 숨기기' : '비밀번호 보기'
                  }
                >
                  {showPassword ? (
                    <Eye size={24} className='text-icon-neutral' />
                  ) : (
                    <EyeOff size={24} className='text-icon-neutral' />
                  )}
                </button>
              )}

              {/* 커스텀 우측 요소 - 아이콘이나 버튼 등 뭐든 들어올 수 있음 */}
              {rightElement}
            </div>
          )}
        </div>

        {hasError && errorMessage && (
          <p className='text-system-error text-caption-01 w-full pt-[8px] text-left'>
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
