import { z } from 'zod';

const addressSchema = z
  .string({ required_error: '주소를 입력해 주세요.' })
  .min(1, '주소를 입력해 주세요.')
  .max(20, '주소는 20자 이하여야 합니다.')
  .regex(/^[ㄱ-ㅎ|가-힣|a-zA-Z|0-9| ]+$/, '주소는 한글, 영문, 숫자, 공백만 사용할 수 있습니다.')
  .trim();

export const validateAddress = (address: string): { isValid: boolean; error?: string } => {
  if (!address) {
    return { isValid: false };
  }

  const result = addressSchema.safeParse(address);
  return result.success
    ? { isValid: true }
    : { isValid: false, error: result.error.errors[0].message };
};