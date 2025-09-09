import React, { forwardRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const inputVariants = cva(
  'w-full px-4 py-2 focus:ring-0 focus:outline-none text-inherit',
  {
    variants: {
      variant: {
        default:
          'bg-transparent rounded-lg border border-gray-300 placeholder-grey03 disabled:bg-gray-200 h-14',
        error:
          'bg-transparent rounded-lg border border-red placeholder-grey03 disabled:bg-gray-200 h-14',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
      sizes: {
        lg: 'text-body-2',
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
  };

/**
 * 인풋 공통 컴포넌트
 * @param variant - Input의 테마 종류
 * @param sizes - Input의 크기 종류
 * @returns - <input />
 */

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant, sizes, line, align, errorMessage, hasError, ...props }, ref) => {
    const finalVariant = hasError ? 'error' : variant;
    
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={twMerge(inputVariants({ variant: finalVariant, sizes, line, align }))}
          {...props}
        />
        {hasError && errorMessage && (
          <p className="text-caption text-red pt-[8px]">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
