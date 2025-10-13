import { z } from 'zod';

const locationSchema = z.object({
  placeName: z
    .string({ required_error: '장소를 선택해 주세요.' })
    .min(1, '장소를 선택해 주세요.'),
  placeAddress: z.string(),
  placeLocation: z
    .string()
    .regex(/^-?\d+\.?\d*,\s*-?\d+\.?\d*$/, '올바른 위치 정보가 아닙니다.'),
});

export const validateLocation = (
  location: { placeName: string; placeAddress: string; placeLocation: string } | null
): string => {
  if (!location) {
    return '장소를 선택해 주세요.';
  }

  const result = locationSchema.safeParse(location);
  return result.success ? '' : result.error.errors[0].message;
};
