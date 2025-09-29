import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

const buttonVariants = cva(
  `w-full h-[48px] box-border cursor-pointer rounded-12 bg-primary-800 
   disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-text-disabled 
   font-semibold text-white px-4 transition-colors`,
  {
    variants: {
      variant: {
        default: 'bg-primary-800',
        transparent: 'bg-transparent',
        disabled: 'bg-gray-200 cursor-not-allowed text-text-disabled',
      },
      fontSize: {
        sm: 'text-label-s',
        md: 'text-label-m',
        lg: 'text-label-l',
      },
      size: {
        base: 'h-[48px]',
      },
    },
    defaultVariants: {
      size: 'base',
      variant: 'default',
    },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    isFloat?: boolean;
    children: React.ReactNode;
    className?: string;
  };

const Button = ({
  variant,
  size,
  className,
  children,
  isFloat = false,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={twMerge(
        buttonVariants({ variant, size }),
        isFloat &&
          'fixed bottom-3 left-0 right-0 z-50 mx-auto mb-[env(safe-area-inset-bottom)] w-[calc(100%-40px)] max-w-[640px]'
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
