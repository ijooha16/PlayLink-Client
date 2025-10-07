import { z } from 'zod';

const dateSchema = z
  .string({ required_error: '날짜를 선택해 주세요.' })
  .regex(/^\d{4}-\d{2}-\d{2}$/, '올바른 날짜 형식을 선택해 주세요.');

const timeSchema = z
  .string({ required_error: '시간을 선택해 주세요.' })
  .regex(/^\d{2}:\d{2}$/, '올바른 시간 형식을 선택해 주세요.');

export const validateDate = (date: string): string => {
  if (!date) {
    return '날짜를 선택해 주세요.';
  }

  const result = dateSchema.safeParse(date);
  return result.success ? '' : result.error.errors[0].message;
};

export const validateTime = (time: string): string => {
  if (!time) {
    return '시간을 선택해 주세요.';
  }

  const result = timeSchema.safeParse(time);
  return result.success ? '' : result.error.errors[0].message;
};

export const validateDateTime = (
  date: string,
  startTime: string,
  endTime: string
): string => {
  const dateError = validateDate(date);
  if (dateError) return dateError;

  const startError = validateTime(startTime);
  if (startError) return startError;

  const endError = validateTime(endTime);
  if (endError) return endError;

  return '';
};
