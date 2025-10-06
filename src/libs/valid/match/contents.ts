import { z } from 'zod';

const contentsSchema = z
  .string({ required_error: '주제를 입력해 주세요.' })
  .min(1, '주제를 입력해 주세요.')
  .max(2000, '주제는 최대 2000자까지 입력 가능합니다.');

export const validateContents = (contents: string): string => {
  if (!contents) {
    return '주제를 입력해 주세요.';
  }

  const normalized = contents.trim();
  const result = contentsSchema.safeParse(normalized);
  return result.success ? '' : result.error.errors[0].message;
};
