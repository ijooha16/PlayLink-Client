import { z } from 'zod';

const sportsSchema = z
  .array(z.number())
  .min(2, '최소 2개 이상 선택해주세요')
  .max(10, '최대 10개까지 선택 가능합니다');

export const validateSports = (sports: number[]): string => {
  const result = sportsSchema.safeParse(sports);
  return result.success ? '' : result.error.errors[0].message;
};
