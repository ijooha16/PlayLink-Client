import { z } from 'zod';

const peopleSchema = z
  .number({ required_error: '인원을 선택해 주세요.' })
  .int('올바른 인원을 선택해 주세요.')
  .min(2, '최소 인원은 2명입니다.');

export const validatePeople = (min: number, max: number): string => {
  const minResult = peopleSchema.safeParse(min);
  if (!minResult.success) {
    return minResult.error.errors[0].message;
  }

  const maxResult = peopleSchema.safeParse(max);
  if (!maxResult.success) {
    return maxResult.error.errors[0].message;
  }

  if (min > max) {
    return '최대 인원은 최소 인원보다 많아야 합니다.';
  }

  return '';
};
