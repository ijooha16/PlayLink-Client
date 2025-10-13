/**
 * 매치 관련 상수 정의
 */

// 레벨 이름 배열
export const LEVEL_NAMES = ['입문', '초보', '중급', '고급', '매니아'] as const;

// 성별 매핑
export const GENDER_MAP = {
  male: '남자만',
  female: '여자만',
  all: '제한없음',
} as const;

// 연령대 매핑
export const AGE_MAP = {
  '20s': '20대',
  '30s': '30대',
  '40s': '40대',
  '50s': '50대 이상',
} as const;

// 매치 타입
export const MATCH_TYPE = {
  PLAY: 'play',
  WATCH: 'watch',
} as const;

// 타입 정의
export type LevelName = (typeof LEVEL_NAMES)[number];
export type GenderKey = keyof typeof GENDER_MAP;
export type AgeKey = keyof typeof AGE_MAP;
export type MatchType = (typeof MATCH_TYPE)[keyof typeof MATCH_TYPE];
