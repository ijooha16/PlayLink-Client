export const LOGIN_DEVICE_IDS = {
  /** 기본 로그인 (이메일/비밀번호) */
  DEFAULT: '0',
  /** 소셜 로그인 (카카오 등) */
  SOCIAL: '1',
} as const;

export type LoginDeviceId = (typeof LOGIN_DEVICE_IDS)[keyof typeof LOGIN_DEVICE_IDS];
