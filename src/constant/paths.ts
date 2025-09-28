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
    PHONE_CHECK: '/anonymous/auth/sign-up/phone-check',
    EMAIL_CHECK: '/anonymous/auth/sign-up/email-check',
    INTEREST: '/anonymous/auth/sign-up/interest',
    SPORTS: '/anonymous/auth/sign-up/sports',
    ADDRESS: '/anonymous/auth/sign-up/address',
    PROFILE: '/anonymous/auth/sign-up/profile',
  },
  MATCH: {
    APPLY_MATCH: '/authorized/match/apply-match',
    CREATE_MATCH: '/authorized/match/create-match',
    MATCH_DETAIL: '/authorized/match/match-detail',
  },
  QUERY: '/authorized/query',
  CHAT: '/authorized/chat',
  MY_NEAR: '/authorized/my-near',
  MY_PAGE: '/authorized/my-page',
};



