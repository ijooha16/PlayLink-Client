export const PATHS = {
  SPLASH: '/anonymous/splash',
  HOME: '/',
  AUTH: {
    SIGN_IN: '/anonymous/auth/sign-in',
    SIGN_UP: '/anonymous/auth/sign-up',
    FIND_ID: '/anonymous/auth/find-id',
    RESET_PASSWORD: '/anonymous/auth/reset-password',
    RESET_PASSWORD_ID: (id: string) => `/anonymous/auth/reset-password/${id}`,
    KAKAO: '/anonymous/auth/oauth/kakao',
    KAKAO_CALLBACK: '/anonymous/auth/oauth/kakao/callback',
    NOT_FOUND: '/anonymous/auth/find-id/result/not-found',
    FOUND: '/anonymous/auth/find-id/result/found',
    WELCOME: '/anonymous/auth/sign-up/welcome',
    TERMS: '/anonymous/auth/sign-up/terms',
    PHONE_CHECK: '/anonymous/auth/sign-up/phone-check',
    EMAIL_CHECK: '/anonymous/auth/sign-up/email-check',
    PROFILE: '/anonymous/auth/sign-up/profile',
    ADDRESS: '/anonymous/auth/sign-up/address',
    INTEREST: '/anonymous/auth/sign-up/interest',
    SPORTS: '/anonymous/auth/sign-up/sports',
  },
  MATCH: {
    LIST: '/authorized/match',
    APPLY_MATCH: '/authorized/match/apply-match',
    APPLY_MATCH_ID: (id: string) => `/authorized/match/apply-match/${id}`,
    CREATE_MATCH: '/authorized/match/create-match',
    MATCH_DETAIL: '/authorized/match/match-detail',
    MATCH_DETAIL_ID: (id: string) => `/authorized/match/match-detail/${id}`,
  },
  QUERY: '/authorized/query',
  CHAT: '/authorized/chat',
  MY_NEAR: '/authorized/my-near',
  MY_PAGE: '/authorized/my-page',
} as const;



