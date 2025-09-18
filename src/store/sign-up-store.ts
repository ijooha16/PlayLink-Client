import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface SignUpData {
  terms: boolean;
  phone: string;
  phoneVerified: boolean;
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  profileImage: File | null;
  favoriteSports: number[];
}

interface SignUpStepStore {
  data: Partial<SignUpData>;
  updateStep: (newData: Partial<SignUpData>) => void;
  clearStep: () => void;
  validateStep: (step: 'terms' | 'phone' | 'email' | 'profile' | 'sports') => boolean;
  isStepCompleted: (step: keyof SignUpData) => boolean;
}

export const useSignUpStepStore = create<SignUpStepStore>()(
  devtools(
    (set, get) => ({
      data: {},
      updateStep: (newData: Partial<SignUpData>) =>
        set((state) => ({
          data: { ...state.data, ...newData },
        })),
      clearStep: () => set({ data: {} }),

      isStepCompleted: (step: keyof SignUpData) => {
        const { data } = get();
        switch (step) {
          case 'terms':
            return data.terms === true;
          case 'phone':
            return !!(data.phone && data.phoneVerified);
          case 'email':
            return !!(data.email && data.password && data.confirmPassword);
          case 'nickname':
            return !!data.nickname;
          case 'favoriteSports':
            return !!(data.favoriteSports && data.favoriteSports.length > 0);
          default:
            return false;
        }
      },

      validateStep: (step: 'terms' | 'phone' | 'email' | 'profile' | 'sports') => {
        const { isStepCompleted } = get();

        switch (step) {
          case 'terms':
            return true; // 약관은 첫 단계라 이전 검증 불필요
          case 'phone':
            return isStepCompleted('terms');
          case 'email':
            return isStepCompleted('terms') && isStepCompleted('phone');
          case 'profile':
            return isStepCompleted('terms') && isStepCompleted('phone') && isStepCompleted('email');
          case 'sports':
            return isStepCompleted('terms') && isStepCompleted('phone') && isStepCompleted('email') && isStepCompleted('nickname');
          default:
            return false;
        }
      },
    })
  )
);