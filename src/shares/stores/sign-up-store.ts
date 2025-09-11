import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface SignUpData {
  terms: boolean;
  phone: string;
  phoneVerified: boolean;
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  profileImage: File | null;
}

interface SignUpStepStore {
  data: Partial<SignUpData>;
  updateStep: (newData: Partial<SignUpData>) => void;
  clearStep: () => void;
}

export const useSignUpStepStore = create<SignUpStepStore>()(
  devtools(
    persist(
      (set) => ({
        data: {},
        updateStep: (newData: Partial<SignUpData>) =>
          set((state) => ({
            data: { ...state.data, ...newData },
          })),
        clearStep: () => set({ data: {} }),
      }),
      {
        name: 'sign-up-step-storage',
      }
    )
  )
);