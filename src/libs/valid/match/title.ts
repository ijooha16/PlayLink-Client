import { z } from 'zod';

const titleSchema = z
  .string({ required_error: '모임명을 입력해 주세요.' })
  .min(5, '모임명은 최소 5글자 이상 입력해 주세요.')
  .max(50, '모임명은 최대 50글자까지 입력 가능합니다.');

export const validateTitle = (title: string): string => {
  if (!title) {
    return '모임명을 입력해 주세요.';
  }

  const normalized = title.trim();
  const result = titleSchema.safeParse(normalized);
  return result.success ? '' : result.error.errors[0].message;
};
