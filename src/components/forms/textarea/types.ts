import { FocusEvent } from 'react';

export interface BaseTextAreaProps {
  value: string;
  onChange?: (value: string) => void;
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: FocusEvent<HTMLTextAreaElement>) => void;
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

export interface TextAreaInputProps extends BaseTextAreaProps {
  onValidate?: (isValid: boolean, error?: string) => void;
  showCharCount?: boolean;
  maxLength?: number;
  validateOnChange?: boolean;
  minHeight?: number;
  maxHeight?: number;
}
