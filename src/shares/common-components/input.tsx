import React, { forwardRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const inputVariants = cva(
  'w-full px-4 py-2 focus:ring-0 focus:outline-none text-inherit',
  {
    variants: {
      variant: {
        default:
          'bg-transparent rounded-lg border border-gray-300 placeholder-gray-400 disabled:bg-gray-200 h-14',
      },
      sizes: {
        lg: 'text-lg',
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
  };

/**
 * 인풋 공통 컴포넌트
 * @param variant - Input의 테마 종류
 * @param sizes - Input의 크기 종류
 * @returns - <input />
 */

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant, sizes, line, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={twMerge(inputVariants({ variant, sizes, line }))}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
export default Input;
