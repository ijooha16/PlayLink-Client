export const SUCCESS_MESSAGES = {
  NICKNAME: '멋진 닉네임이에요!',
  EMAIL: '사용할 수 있는 이메일이에요',
  PASSWORD: '사용할수 있는 비밀번호에요',
  PASSWORD_CONFIRM: '비밀번호가 일치해요',
} as const;

export type SuccessMessageKey = keyof typeof SUCCESS_MESSAGES;

export const ERROR_MESSAGES = {
  NICKNAME: {
    DUPLICATED: '이미 사용중인 닉네임이에요',
    LENGTH_ERROR: '2자 이상으로 입력해주세요',
  },
  EMAIL: '올바른 형식의 이메일 주소를 입력해 주세요.',
  PASSWORD: '영문, 숫자, 특수문자 조합 8~16자로 입력해 주세요',
  PASSWORD_CONFIRM: '비밀번호가 일치하지 않아요',
  CODE: {
    RESEND: '인증번호를 다시 보내주세요',
    ERROR: '인증번호가 일치하지 않아요',
    LENGTH_ERROR: '인증번호 6자리를 입력해 주세요',
  },
} as const;

export type ERRORMESSAGEKEY = keyof typeof ERROR_MESSAGES;
