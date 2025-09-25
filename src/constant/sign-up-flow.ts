export type SignUpStep =
  | 'terms'
  | 'phone-check'
  | 'email-check'
  | 'welcome'
  | 'profile'
  | 'address'
  | 'interest'
  | 'sports'
  | 'complete';

export interface FlowStepConfig {
  key: SignUpStep;
  path: string;
  title: string;
  requiredData: string[];
  previousStep?: SignUpStep;
  nextStep?: SignUpStep;
}

export const SIGN_UP_FLOW: FlowStepConfig[] = [
  {
    key: 'terms',
    path: '/anonymous/auth/sign-up/terms',
    title: '서비스 이용을 위해 \n 약관 동의가 필요해요!',
    requiredData: ['terms'],
  },
  {
    key: 'phone-check',
    path: '/anonymous/auth/sign-up/phone-check',
    title: '휴대폰 번호를 \n 입력해 주세요!',
    requiredData: ['phone', 'phoneVerified'],
    previousStep: 'terms',
  },
  {
    key: 'email-check',
    path: '/anonymous/auth/sign-up/email-check',
    title: '이메일과 비밀번호를 \n 입력해 주세요!',
    requiredData: ['email', 'password', 'confirmPassword'],
    previousStep: 'phone-check',
  },
  {
    key: 'welcome',
    path: '/anonymous/auth/sign-up/welcome',
    title: '플레이링크에 오신 것을 환영해요!',
    requiredData: [],
    previousStep: 'email-check',
  },
  {
    key: 'profile',
    path: '/anonymous/auth/sign-up/profile',
    title: '프로필 사진과 닉네임을 \n설정해주세요!',
    requiredData: ['nickname'],
    previousStep: 'welcome',
  },
  {
    key: 'address',
    path: '/anonymous/auth/sign-up/address',
    title: '활동하는 동네를 \n 알려주세요!',
    requiredData: ['address'],
    previousStep: 'profile',
  },
  {
    key: 'interest',
    path: '/anonymous/auth/sign-up/interest',
    title: '어떤 걸 더\n 선호하시나요?',
    requiredData: ['participationType'],
    previousStep: 'address',
  },
  {
    key: 'sports',
    path: '/anonymous/auth/sign-up/sports',
    title: '좋아하는 운동을 \n모두 선택해 주세요!',
    requiredData: ['favoriteSports'],
    previousStep: 'interest',
  },
  {
    key: 'complete',
    path: '/anonymous/auth/sign-up/complete',
    title: '회원가입이 완료되었습니다!',
    requiredData: [],
    previousStep: 'sports',
  },
];

// 다음 단계 정보를 자동으로 계산하여 추가
SIGN_UP_FLOW.forEach((step, index) => {
  if (index < SIGN_UP_FLOW.length - 1) {
    step.nextStep = SIGN_UP_FLOW[index + 1].key;
  }
});

export const getStepConfig = (step: SignUpStep): FlowStepConfig | undefined => {
  return SIGN_UP_FLOW.find(config => config.key === step);
};

export const getStepIndex = (step: SignUpStep): number => {
  return SIGN_UP_FLOW.findIndex(config => config.key === step);
};

export const getNextStep = (currentStep: SignUpStep): SignUpStep | null => {
  const config = getStepConfig(currentStep);
  return config?.nextStep || null;
};

export const getPreviousStep = (currentStep: SignUpStep): SignUpStep | null => {
  const config = getStepConfig(currentStep);
  return config?.previousStep || null;
};