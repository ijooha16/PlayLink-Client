import { Cancel, Check, ErrorIcon } from '@/components/shared/icons';
import { cva, VariantProps } from 'class-variance-authority';
import React, { forwardRef, useId, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';

const inputVariants = cva(
  'bg-transparent px-3 flex gap-2 items-center flex-1',
  {
    variants: {
      variant: {
        default: 'rounded-12',
        splited: 'bg-transparent rounded-l-12',
        gray: 'rounded-12 bg-bg-normal',
      },
      state: {
        default: 'border border-border-neutral',
        focused: 'border border-border-strong',
        error: 'border border-system-error',
        success: 'border border-system-information',
        // hover: '',
        disabled: 'bg-gray-200 text-text-disabled border border-border-neutral',
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
    /** 성공여부(외부 제어) */
    hasSuccess?: boolean;
    /** 성공메시지 텍스트 */
    successMessage?: string;
    /** 도움말 텍스트 (에러가 없을 때 표시) */
    helperText?: string;
    /** 회원가입/로그인 인풋일 때 (성공 후 보더 파란색으로 변하는 속성 컨트롤) */
    isSignupFlow?: boolean;
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
    /** 우측 버튼 텍스트 (예: 재전송, 확인 등) */
    buttonText?: string;
    /** 우측 버튼 클릭 핸들러 */
    onButtonClick?: () => void;
    /** 우측 상태 아이콘 표시 여부 */
    showStatusIcons?: boolean;
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
      successMessage,
      helperText,
      hasError,
      hasSuccess,
      isSignupFlow = false,
      label,
      timer,
      showPasswordToggle,
      leftElement,
      showCancelToggle,
      rightElement,
      splitedRightElement,
      buttonText,
      onButtonClick,
      type = 'text',
      onBlur,
      wrapperClassName,
      id,
      disabled,
      showStatusIcons = true,
      ...props
    },
    ref
  ) => {
    const reactId = useId();
    const inputId = id ?? `input-${reactId}`;

    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(false);
    const [hover, setHover] = useState(false);
    const [touched, setTouched] = useState(false);

    // 자동 success 판단: 외부에서 전달된 hasSuccess 또는 (touched + 에러없음 + 값있음)
    const finalSuccess = useMemo(() => {
      return hasSuccess || (touched && !hasError && Boolean(props.value));
    }, [hasSuccess, touched, hasError, props.value]);

    // disabled > focused > error > success > hover > state 순으로 우선순위
    const finalState = useMemo(() => {
      if (disabled) return 'disabled';
      if (focused) return 'focused';
      if (hasError) return 'error';
      if (isSignupFlow && finalSuccess && successMessage) return 'success';
      // if (hover) return 'hover';
      return state;
    }, [disabled, hasError, finalSuccess, focused, hover, state]);

    // splitedRightElement가 있으면 variant를 강제로 splited로
    const finalVariant = splitedRightElement ? 'splited' : variant;

    // password 토글
    const inputType =
      type === 'password' ? (showPassword ? 'text' : 'password') : type;

    const describedById = errorMessage ? `${inputId}-error` : undefined;

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

        <div className='flex'>
          <div
            className={twMerge(
              inputVariants({
                variant: finalVariant,
                state: finalState,
                sizes,
                line,
                align,
              }),
              'flex items-center'
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
              <div className='flex flex-shrink-0 items-center'>
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
              className='min-w-0 flex-1 bg-transparent outline-none placeholder:text-text-disabled'
              onFocus={(e) => {
                setFocused(true);
              }}
              onBlur={(e) => {
                setFocused(false);
                setTouched(true);
                onBlur?.(e);
              }}
              {...props}
            />

            {/* 우측 요소 컨테이너 */}
            <div className='flex flex-shrink-0 items-center gap-s-8'>
              {/* 타이머 표시 */}
              {timer && (
                <span className='text-caption-01 font-medium text-system-error'>
                  {timer}
                </span>
              )}

              {/* 포커스 중일 때만 보이는 요소들 */}
              {focused && (
                <>
                  {/* 캔슬 요소 */}
                  {showCancelToggle && (
                    <button
                      type='button'
                      onMouseDown={(e) => {
                        e.preventDefault();
                        const syntheticEvent = {
                          target: { value: '' },
                          currentTarget: { value: '' },
                        } as React.ChangeEvent<HTMLInputElement>;
                        props.onChange?.(syntheticEvent);
                      }}
                      className='transition-opacity hover:opacity-80'
                      aria-label='입력 지우기'
                      tabIndex={-1}
                    >
                      <Cancel
                        size={24}
                        className='cursor-pointer text-icon-neutral'
                      />
                    </button>
                  )}
                </>
              )}
              {!focused && (
                <>
                  {/* 에러 상태 아이콘 */}
                  {showStatusIcons &&
                    hasError &&
                    !rightElement &&
                    isSignupFlow && (
                      <button
                        type='button'
                        onMouseDown={(e) => {
                          e.preventDefault();
                          const syntheticEvent = {
                            target: { value: '' },
                            currentTarget: { value: '' },
                          } as React.ChangeEvent<HTMLInputElement>;
                          props.onChange?.(syntheticEvent);
                        }}
                        className='transition-opacity hover:opacity-80'
                        aria-label='입력 지우기'
                        tabIndex={-1}
                      >
                        <div className='pointer-events-none flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center rounded-full bg-system-error'>
                          <ErrorIcon />
                        </div>
                      </button>
                    )}

                  {/* 성공 상태 아이콘 - disabled 상태에서는 표시 안 함 */}
                  {!disabled &&
                    showStatusIcons &&
                    hasSuccess &&
                    !hasError &&
                    !rightElement &&
                    successMessage &&
                    isSignupFlow && (
                      <div className='pointer-events-none flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center rounded-full bg-primary-800'>
                        <Check size={12} className='text-white' />
                      </div>
                    )}
                </>
              )}

              {/* 사용자 정의 우측 요소 */}
              {rightElement}
              {hasSuccess && <div>success</div> && hasError && <div>error</div>}
            </div>
          </div>

          {/* 오른쪽 분리 요소 (예: 인증요청 버튼) */}
          {splitedRightElement && (
            <div className='flex items-center justify-center rounded-r-12 border-y border-r border-border-neutral px-[19px]'>
              {splitedRightElement}
            </div>
          )}

          {/* 우측 버튼 (재전송, 확인 등) */}
          {buttonText && onButtonClick && (
            <button
              type='button'
              onClick={onButtonClick}
              className='ml-s-8 whitespace-nowrap text-label-l font-semibold text-primary-800 disabled:text-primary-800'
              disabled={disabled}
            >
              {buttonText}
            </button>
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

        {/* 성공 메시지 */}
        {(() => {
          const shouldShowSuccess = !focused && hasSuccess && successMessage;

          return shouldShowSuccess;
        })() && (
          <p
            id={describedById}
            className='w-full text-left text-caption-01 text-system-information'
          >
            {typeof successMessage === 'string'
              ? successMessage
              : JSON.stringify(successMessage)}
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

Input.displayName = 'Input';
export default Input;
