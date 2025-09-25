export const API_URLS = {
  AUTH: {
    SIGNIN: '/api/auth/signin',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
    FIND_ACCOUNT: '/api/auth/find-account',
    RESET_PASSWORD: '/api/auth/reset-password',
    EMAIL: {
      SEND: '/api/auth/email/send',
      VERIFY: '/api/auth/email/verify',
    },
    SMS: {
      SEND: '/api/auth/sms/send',
      VERIFY: '/api/auth/sms/verify',
    },
  },
  CHAT: {
    LIST: '/api/chatlist',
    ROOM: (id: number) => `/api/chatlist/${id}`,
  },
  MATCH: {
    GET_MATCHES: '/api/match/get-matches',
    GET_MATCH_DETAIL: '/api/match/get-match-detail',
    GET_SEARCHED_MATCH: '/api/match/get-searched-match',
    ADD_MATCH: '/api/match/add-match',
    APPLY_MATCH: '/api/match/apply-match',
    MATCH_JOIN: '/api/match/match-join',
    REMOVE_MATCH: (matchId: string) => `/api/match/remove-match/${matchId}`,
    UPDATE_MATCH: (matchId: string) => `/api/match/update-match/${matchId}`,
  },
  NOTIFICATION: {
    GET_NOTIFICATION_LIST: '/api/notification/get-notification-list',
    SEND_NOTIFICATION_TOKEN: '/api/notification/send-notification-token',
  },
  PROFILE: '/api/auth/profile',
  SPORT: {
    GET_SPORTS: '/api/sport/get-sports',
  },
} as const;