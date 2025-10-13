export const SUCCESS_MESSAGES = {
  NICKNAME: '멋진 닉네임이에요!',
  EMAIL: '메시지에 마침표를 찍으세요.',
  PASSWORD: '메시지에 마침표를 찍으세요.',
  PASSWORD_CONFIRM: '메시지에 마침표를 찍으세요.',
} as const;

export type SuccessMessageKey = keyof typeof SUCCESS_MESSAGES;
