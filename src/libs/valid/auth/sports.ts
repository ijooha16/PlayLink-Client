import { z } from 'zod';

const sportsSchema = z
  .array(z.number())
  .min(1, '최소 1개 이상 선택해주세요')
  .max(3, '최대 3개까지 선택 가능합니다');

export const validateSports = (sports: number[]): string => {
  const result = sportsSchema.safeParse(sports);
  return result.success ? '' : result.error.errors[0].message;
};
