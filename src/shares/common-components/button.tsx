import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  "inline-flex items-center text-main w-fit transition-colors ease-in-out justify-center rounded-lg outline-none disabled:pointer-events-none disabled:bg-[#E6E6E6] disabled:text-gray disabled:border-none",
  {
    variants: {
      variant: {
        default: "border bg-color-blue",
      },
      size: {},
    },
    defaultVariants: {},
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    children: React.ReactNode;
    className?: never;
  };

/**
 * 버튼 공통 컴포넌트
 * @param variant - 버튼의 테마 종류
 * @param size - 버튼의 크기 종류
 * @param children - 버튼 안에 들어가는 텍스트
 * @param props - 버튼의 기본 속성
 * @returns - 버튼 컴포넌트
 */
const Button = ({ variant, size, children, ...props }: ButtonProps) => {
  return (
    <button className={twMerge(buttonVariants({ variant, size }))} {...props}>
      {children}
    </button>
  );
};

export default Button;
