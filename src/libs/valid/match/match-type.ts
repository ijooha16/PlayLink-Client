import { z } from 'zod';

const matchTypeSchema = z.enum(['play', 'watch'], {
  required_error: '모임 종류를 선택해 주세요.',
  invalid_type_error: '올바른 모임 종류를 선택해 주세요.',
});

export const validateMatchType = (type: string | null): string => {
  if (!type) {
    return '모임 종류를 선택해 주세요.';
  }

  const result = matchTypeSchema.safeParse(type);
  return result.success ? '' : result.error.errors[0].message;
};
