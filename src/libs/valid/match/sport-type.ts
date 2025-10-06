import { z } from 'zod';

const sportTypeSchema = z
  .number({ required_error: '운동 종목을 선택해 주세요.' })
  .int('올바른 운동 종목을 선택해 주세요.')
  .positive('올바른 운동 종목을 선택해 주세요.');

export const validateSportType = (sportId: number | null): string => {
  if (sportId === null || sportId === undefined) {
    return '운동 종목을 선택해 주세요.';
  }

  const result = sportTypeSchema.safeParse(sportId);
  return result.success ? '' : result.error.errors[0].message;
};
