import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

const buttonVariants = cva(
  'w-full h-[56px] box-border cursor-pointer rounded-lg bg-primary text-white font-semibold disabled:bg-grey04 px-4 text-sm disabled:text-grey02 transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        transparent: 'bg-transparent',
      },
      size: {
        base: 'h-[56px]',
      },
    },
    defaultVariants: {},
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    children: React.ReactNode;
    className?: string;
  };

/**
 * 버튼 공통 컴포넌트
 * @param variant - 버튼의 테마 종류
 * @param size - 버튼의 크기 종류
 * @param children - 버튼 안에 들어가는 텍스트
 * @param props - 버튼의 기본 속성
 * @returns - 버튼 컴포넌트
 */
const Button = ({ variant, size, className, children, ...props }: ButtonProps) => {
  return (
    <button className={twMerge(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
