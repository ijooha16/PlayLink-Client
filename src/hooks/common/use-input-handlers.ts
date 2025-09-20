import { useState } from 'react';
import { formatPhoneNumber } from '@/utills/format/phone-formats';
import { validatePassword, validatePasswordConfirm } from '@/libs/valid/auth';

type FieldType = 'text' | 'phone' | 'password' | 'confirmPassword';

interface FieldConfig {
  type?: FieldType;
  validation?: (value: string, allValues?: Record<string, string>) => string | undefined;
  formatter?: (value: string) => string;
  clearErrors?: string[];
}

export const useInputHandlers = (
  initialValues: Record<string, string> = {},
  fieldConfigs: Record<string, FieldConfig> = {}
) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createHandler = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const config = fieldConfigs[field] || {};
    let value = e.target.value;

    // 포맷팅 적용
    if (config.formatter) {
      value = config.formatter(value);
    } else if (config.type === 'phone') {
      value = formatPhoneNumber(value);
    }

    // 값 업데이트
    const newValues = { ...values, [field]: value };
    setValues(newValues);

    // 에러 클리어
    const errorsToClear = config.clearErrors || [field];
    setErrors(prev => {
      const newErrors = { ...prev };
      errorsToClear.forEach(errorField => {
        delete newErrors[errorField];
      });
      return newErrors;
    });

    // 실시간 유효성 검사
    if (config.validation) {
      const error = config.validation(value, newValues);
      if (error) {
        setErrors(prev => ({ ...prev, [field]: error }));
      }
    }

    // 비밀번호 특별 처리
    if (config.type === 'password') {
      const passwordError = validatePassword(value).error;
      if (passwordError) {
        setErrors(prev => ({ ...prev, [field]: passwordError }));
      }

      // 확인 비밀번호도 재검증
      if (newValues.confirmPassword) {
        const confirmError = validatePasswordConfirm(value, newValues.confirmPassword).error;
        setErrors(prev => ({ ...prev, confirmPassword: confirmError || '' }));
      }
    } else if (config.type === 'confirmPassword') {
      const confirmError = validatePasswordConfirm(newValues.password || '', value).error;
      if (confirmError) {
        setErrors(prev => ({ ...prev, [field]: confirmError }));
      }
    }
  };

  const handlers = Object.keys({ ...initialValues, ...fieldConfigs }).reduce((acc, field) => {
    acc[field] = createHandler(field);
    return acc;
  }, {} as Record<string, (e: React.ChangeEvent<HTMLInputElement>) => void>);

  const setError = (field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const clearErrors = () => setErrors({});

  const setValue = (field: string, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  return {
    values,
    errors,
    handlers,
    setError,
    clearErrors,
    setValue,
  };
};