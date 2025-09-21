import { SignUpStep, getStepConfig } from '@/constant/sign-up-flow';
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
  address: string;
  participationType: 'participate' | 'watch' | 'both' | null;
  favoriteSports: number[];
}

interface SignUpStepStore {
  data: Partial<SignUpData>;
  currentStep: SignUpStep | null;
  updateStep: (newData: Partial<SignUpData>) => void;
  clearStep: () => void;
  setCurrentStep: (step: SignUpStep) => void;
  canNavigateToStep: (step: SignUpStep) => boolean;
  isStepCompleted: (step: SignUpStep) => boolean;
}

export const useSignUpStepStore = create<SignUpStepStore>()(
  devtools(
    (set, get) => ({
      data: {},
      currentStep: null,

      updateStep: (newData: Partial<SignUpData>) =>
        set((state) => ({
          data: { ...state.data, ...newData },
        })),

      clearStep: () => set({ data: {}, currentStep: null }),

      setCurrentStep: (step: SignUpStep) => set({ currentStep: step }),

      canNavigateToStep: (step: SignUpStep) => {
        const { isStepCompleted } = get();
        const stepConfig = getStepConfig(step);

        if (!stepConfig) return false;
        if (step === 'terms') return true;

        let currentCheck = stepConfig.previousStep;
        while (currentCheck) {
          if (!isStepCompleted(currentCheck)) return false;
          const prevConfig = getStepConfig(currentCheck);
          currentCheck = prevConfig?.previousStep;
        }
        return true;
      },

      isStepCompleted: (step: SignUpStep) => {
        const { data } = get();
        const stepConfig = getStepConfig(step);

        if (!stepConfig) return false;

        return stepConfig.requiredData.every(field => {
          const value = data[field as keyof SignUpData];
          if (field === 'terms') return value === true;
          if (field === 'phoneVerified') return value === true;
          if (field === 'favoriteSports') return Array.isArray(value) && value.length > 0;
          return !!value;
        });
      },
    }),
  ),
);