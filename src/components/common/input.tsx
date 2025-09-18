import React, { forwardRef, useState } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import { Eye, EyeOff } from '@/components/common/icons';

const inputVariants = cva(
  'bg-transparent px-3 flex gap-2 items-center flex-1',
  {
    variants: {
      variant: {
        default: 'rounded-lg',
        splited: 'bg-transparent rounded-l-lg border',
      },
      state: {
        default: 'border border-border-neutral',
        focused: 'border border-border-strong',
        error: 'border border-system-error',
        hover: '',
        disabled: 'bg-gray-200 text-text-disabled',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
      sizes: {
        lg: 'text-body-02 h-[48px]',
        md: 'text-body-02 h-[48px]',
        sm: 'text-body-02 h-[48px]',
        xs: 'text-body-02 h-[48px]',
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
    splitedRightElement?: React.ReactNode;
  };

/**
 * 인풋 공통 컴포넌트
 * @param variant - Input의 테마 종류
 * @param state - Input의 상태
 * @param sizes - Input의 크기 종류
 * @param label - Input 상단에 표시될 라벨
 * @param timer - 우측에 표시될 타이머
 * @param showPasswordToggle - 비밀번호 보기/숨기기 토글 버튼 표시 여부
 * @param rightElement - 우측에 표시될 커스텀 요소
 * @param splitedRightElement - 우측에 표시될 커스텀 요소, 인풋창과 나눠진 경우
 * @returns - <input />
 */

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      state = 'default',
      sizes = 'lg',
      line,
      align,
      errorMessage,
      hasError,
      label,
      timer,
      showPasswordToggle,
      rightElement,
      type = 'text',
      splitedRightElement,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(false);
    const [hover, setHover] = useState(false);
    const finalState = hasError
      ? 'error'
      : hover
        ? 'hover'
        : focused
          ? 'focused'
          : state;

    // type이 password인 경우 showPassword 상태에 따라 타입 변경
    const inputType =
      type === 'password' && !showPassword
        ? 'password'
        : type === 'password' && showPassword
          ? 'text'
          : type;

    return (
      <div className='gap-s-8 flex w-full flex-col'>
        {label && (
          <label className='text-body-02 text-text-alternative block text-left font-medium'>
            {label}
          </label>
        )}
        <div className='flex'>
          <div
            className={twMerge(
              inputVariants({ variant, state: finalState, sizes, line, align }),
              !sizes && 'flex-1'
            )}
          >
            <input
              ref={ref}
              type={inputType}
              {...props}
              onFocus={() => setFocused(true)}
              onBlur={(e) => {
                setFocused(false);
                onBlur?.(e);
              }}
              className='placeholder:text-text-disabled flex-1'
              onMouseDown={() => setHover(true)}
              onMouseUp={() => setHover(false)}
            />

            {/* 우측 요소 컨테이너 */}

            <div className='flex items-center gap-2'>
              {/* 타이머 표시 */}
              {timer && (
                <span className='text-system-error text-caption-01 font-medium'>
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
          </div>
          {splitedRightElement && (
            <div className='border-border-neutral flex items-center justify-center rounded-r-lg border-y border-r px-[19px]'>
              {splitedRightElement}
            </div>
          )}
        </div>

        {hasError && errorMessage && (
          <p className='text-system-error text-caption-01 w-full text-left'>
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
