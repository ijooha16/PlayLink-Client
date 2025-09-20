import { Cancel, Eye, EyeOff } from '@/components/shared/icons';
import { cva, VariantProps } from 'class-variance-authority';
import React, { forwardRef, useId, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';

const inputVariants = cva(
  'bg-transparent px-3 flex gap-2 items-center flex-1',
  {
    variants: {
      variant: {
        default: 'rounded-[8px]',
        splited: 'bg-transparent rounded-l-[8px]',
        gray: 'rounded-[8px] bg-bg-normal',
      },
      state: {
        default: 'border border-border-netural',
        focused: 'border border-border-strong',
        error: 'border border-system-error',
        // hover: '',
        disabled: 'bg-gray-200 text-text-disabled border border-border-netural',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
      sizes: {
        lg: 'text-body-02 h-[48px]',
        md: 'text-body-02 h-[44px]',
        sm: 'text-body-02 h-[40px]',
        xs: 'text-body-02 h-[36px]',
      },
      line: {
        underline: 'underline',
        cancelLine: 'line-through',
        default: 'no-underline',
      },
    },
  }
);

type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'className'
> &
  VariantProps<typeof inputVariants> & {
    /** 외부 래퍼에 적용할 클래스 */
    wrapperClassName?: string;
    /** 에러여부(외부 제어) */
    hasError?: boolean;
    /** 에러메시지 텍스트 */
    errorMessage?: string;
    /** 도움말 텍스트 (에러가 없을 때 표시) */
    helperText?: string;
    /** 상단 라벨 */
    label?: string;
    /** 우측 타이머 텍스트 (ex. 02:59) */
    timer?: string;
    /** 비밀번호 보기/숨기기 토글 표시 */
    showPasswordToggle?: boolean;
    /** 좌측 영역 커스텀 노드 (아이콘 등) */
    leftElement?: React.ReactNode;
    /** 우측 영역 커스텀 노드 (아이콘/버튼 등) */
    showCancelToggle?: boolean;
    /** 우측 영역 커스텀 노드 (아이콘/버튼 등) */
    rightElement?: React.ReactNode;
    /** 오른쪽이 분리된 버튼/요소(예: 인증요청) */
    splitedRightElement?: React.ReactNode;
  };

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      state = 'default',
      sizes = 'lg',
      line = 'default',
      align = 'left',
      errorMessage,
      helperText,
      hasError,
      label,
      timer,
      showPasswordToggle,
      leftElement,
      showCancelToggle,
      rightElement,
      splitedRightElement,
      type = 'text',
      onBlur,
      wrapperClassName,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const reactId = useId();
    const inputId = id ?? `input-${reactId}`;

    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(false);
    const [hover, setHover] = useState(false);

    // disabled > error > hover > focused > state 순으로 우선순위
    const finalState = useMemo(() => {
      if (disabled) return 'disabled';
      if (hasError) return 'error';
      if (focused) return 'focused';
      // if (hover) return 'hover';
      return state;
    }, [disabled, hasError, focused, hover, state]);

    // splitedRightElement가 있으면 variant를 강제로 splited로
    const finalVariant = splitedRightElement ? 'splited' : variant;

    // password 토글
    const inputType =
      type === 'password' ? (showPassword ? 'text' : 'password') : type;

    const describedById = errorMessage ? `${inputId}-error` : undefined;

    return (
      <div
        className={twMerge('gap-s-8 flex w-full flex-col', wrapperClassName)}
      >
        {label && (
          <label
            htmlFor={inputId}
            className='text-body-02 text-text-alternative block text-left font-medium'
          >
            {label}
          </label>
        )}

        <div className='flex'>
          <div
            className={twMerge(
              inputVariants({
                variant: finalVariant as any,
                state: finalState as any,
                sizes,
                line,
                align,
              })
            )}
            onMouseEnter={(e) => {
              setHover(true);
            }}
            onMouseLeave={(e) => {
              setHover(false);
            }}
          >
            {/* 좌측 요소 */}
            {leftElement && (
              <div className='flex items-center'>
                {leftElement}
              </div>
            )}

            <input
              id={inputId}
              ref={ref}
              type={inputType}
              disabled={disabled}
              aria-invalid={hasError ? true : undefined}
              aria-describedby={describedById}
              className='placeholder:text-text-disabled flex-1 outline-none'
              onFocus={(e) => {
                setFocused(true);
              }}
              onBlur={(e) => {
                setFocused(false);
                onBlur?.(e);
              }}
              {...props}
            />

            {/* 우측 요소 컨테이너 */}
            <div className='flex items-center gap-s-8'>
              {/* 타이머 표시 */}
              {timer && (
                <span className='text-system-error text-caption-01 font-medium'>
                  {timer}
                </span>
              )}

              {/* 비밀번호 토글 */}
              {type === 'password' && showPasswordToggle && (
                <button
                  type='button'
                  onClick={() => setShowPassword((s) => !s)}
                  className='p-1 transition-opacity hover:opacity-80'
                  aria-label={
                    showPassword ? '비밀번호 숨기기' : '비밀번호 보기'
                  }
                  tabIndex={-1} // 포커스 훅 뺐기 방지(선택)
                >
                  {showPassword ? (
                    <Eye size={24} className='text-icon-netural' />
                  ) : (
                    <EyeOff size={24} className='text-icon-netural' />
                  )}
                </button>
              )}

              {/* 사용자 정의 우측 요소 */}
              {rightElement}

              {/* 캔슬 요소 - 가장 우측 */}
              {showCancelToggle && (
                <button
                  type='button'
                  onClick={() => {
                    // onChange 이벤트 직접 호출
                    const syntheticEvent = {
                      target: { value: '' },
                      currentTarget: { value: '' }
                    } as React.ChangeEvent<HTMLInputElement>;
                    props.onChange?.(syntheticEvent);
                  }}
                  className='transition-opacity hover:opacity-80'
                  aria-label='입력 지우기'
                  tabIndex={-1}
                >
                  <Cancel size={24} className='text-icon-netural cursor-pointer' />
                </button>
              )}
            </div>
          </div>

          {/* 오른쪽 분리 요소 (예: 인증요청 버튼) */}
          {splitedRightElement && (
              <div className='border-border-netural flex items-center justify-center rounded-r-[8px] border-y border-r px-[19px]'>
              {splitedRightElement}
            </div>
          )}
        </div>

        {/* 에러 메시지 */}
        {hasError && errorMessage && (
          <p
            id={describedById}
            className='text-system-error text-caption-01 w-full text-left'
          >
            {errorMessage}
          </p>
        )}

        {/* 도움말 텍스트 */}
        {!hasError && helperText && (
          <p className='text-text-disabled text-caption-01 w-full text-left pt-s-2'>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
