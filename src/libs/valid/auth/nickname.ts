import { z } from 'zod';

const nicknameSchema = z
  .string({ required_error: '닉네임을 입력해 주세요.' })
  .min(1, '닉네임을 입력해 주세요.')
  .min(2, '닉네임은 2자 이상이어야 합니다.')
  .regex(/^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]+$/, '닉네임은 글자 또는 숫자만 사용할 수 있습니다.')
  .max(15, '닉네임은 15자 이하여야 합니다.');

export const validateNickname = (nickname: string): string => {
  if (!nickname) {
    return '';
  }

  const normalized = nickname.trim();
  const result = nicknameSchema.safeParse(normalized);
  return result.success ? '' : result.error.errors[0].message;
};