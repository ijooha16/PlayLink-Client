export const PATHS = {
  SPLASH: '/anonymous/splash',
  HOME: '/',
  AUTH: {
    SIGN_IN: '/anonymous/auth/sign-in',
    SIGN_UP: '/anonymous/auth/sign-up',
    FIND_ID: '/anonymous/auth/find-id',
    RESET_PASSWORD: '/anonymous/auth/reset-password',
    KAKAO: '/anonymous/auth/oauth/kakao',
    KAKAO_CALLBACK: '/anonymous/auth/oauth/kakao/callback',
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

const extractPaths = (obj: Record<string, any>): string[] =>
  Object.values(obj).flatMap((v) =>
    typeof v === 'string' ? [v] : extractPaths(v)
  );

export const ALL_PATHS = extractPaths(PATHS);

// 모든 anonymouse pages
export const ANONYMOUS_PAGES = ALL_PATHS.filter((p) =>
  p.startsWith('/anonymous')
);

// 모든 authorized pages
export const AUTHORIZED_PAGES = ALL_PATHS.filter((p) =>
  p.startsWith('/authorized')
);
