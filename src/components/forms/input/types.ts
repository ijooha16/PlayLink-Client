import { ChangeEvent, FocusEvent } from 'react';

export interface BaseInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  wrapperClassName?: string;
  label?: string;
  hasError?: boolean;
  errorMessage?: string;
  hasSuccess?: boolean;
  successMessage?: string;
  helperText?: string;
  autoFocus?: boolean;
}

export interface EmailInputProps extends Omit<BaseInputProps, 'onChange'> {
  onChange?: (value: string) => void;
  onValidate?: (isValid: boolean, error?: string) => void;
  showCancelToggle?: boolean;
  validateOnChange?: boolean;
  showCheckIcon?: boolean;
  isSignupFlow?: boolean;
  showSuccessMessage?:boolean;
}

export interface PhoneInputProps extends Omit<BaseInputProps, 'onChange'> {
  onChange?: (value: string) => void;
  onValidate?: (isValid: boolean, error?: string) => void;
  showCancelToggle?: boolean;
  validateOnComplete?: boolean;
}

export interface PasswordInputProps extends Omit<BaseInputProps, 'onChange'> {
  onChange?: (value: string) => void;
  onValidate?: (isValid: boolean, error?: string) => void;
  showPasswordToggle?: boolean;
  showCancelToggle?: boolean;
  showStrength?: boolean;
  confirmValue?: string;
  onConfirmChange?: (value: string) => void;
  isConfirm?: boolean;
  validateOnChange?: boolean;
  isSignupFlow?: boolean;
  showSuccessMessage?:boolean;
}

export interface CodeInputProps extends Omit<BaseInputProps, 'onChange'> {
  onChange?: (value: string) => void;
  onValidate?: (isValid: boolean, error?: string) => void;
  timer?: string;
  isTimeout?: boolean;
  onResend?: () => void;
  isResending?: boolean;
  maxLength?: number;
  validateOnComplete?: boolean;
}

export interface NicknameInputProps extends Omit<BaseInputProps, 'onChange'> {
  onChange?: (value: string) => void;
  onValidate?: (isValid: boolean, error?: string) => void;
  showCancelToggle?: boolean;
  validateOnChange?: boolean;
  isSignupFlow?: boolean;
}

export interface AddressInputProps extends Omit<BaseInputProps, 'onChange'> {
  onChange?: (value: string) => void;
  onValidate?: (isValid: boolean, error?: string) => void;
  showCancelToggle?: boolean;
  onCurrentLocationClick?: () => void;
  loading?: boolean;
  results?: Array<{
    full: string;
    si: string;
    gu: string;
    dong: string;
  }>;
  onResultSelect?: (item: {
    full: string;
    si: string;
    gu: string;
    dong: string;
  }) => void;
  selectedValue?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
  totalCount?: number;
  onClick?: (selectedFull?: string) => void;
}
