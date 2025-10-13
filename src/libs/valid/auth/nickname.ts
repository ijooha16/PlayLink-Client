import { z } from 'zod';

const nicknameSchema = z
  .string({ required_error: '닉네임을 입력해 주세요.' })
  .min(1, '닉네임을 입력해 주세요.')
  .regex(
    /^[a-zA-Z0-9가-힣]{2,12}$/,
    '닉네임은 한글, 영문, 숫자 2~12자로 입력해주세요.'
  );

export const validateNickname = (nickname: string): string => {
  if (!nickname) {
    return '';
  }

  if (/\s/.test(nickname)) {
    return '닉네임에는 공백을 사용할 수 없습니다.';
  }

  const normalized = nickname.trim();
  if (!normalized) {
    return '닉네임을 입력해 주세요.';
  }

  const lowerNickname = normalized.toLowerCase();
  if (lowerNickname === 'admin' || normalized === '관리자') {
    return '사용할 수 없는 닉네임입니다.';
  }

  const result = nicknameSchema.safeParse(normalized);
  return result.success ? '' : result.error.errors[0].message;
};
