import { create } from 'zustand';

interface ProfileData {
  nickname?: string;
  address?: string;
  favor?: number;
  prefer_sports?: number[];
  img?: File;
}

interface ProfileStepStore {
  data: ProfileData;
  updateStep: (data: Partial<ProfileData>) => void;
  reset: () => void;
}

const initialData: ProfileData = {
  nickname: '',
  address: '',
  favor: 0,
  prefer_sports: [],
  img: undefined,
};

export const useProfileStepStore = create<ProfileStepStore>()(
    (set) => ({
      data: initialData,
      updateStep: (newData) =>
        set((state) => ({
          data: { ...state.data, ...newData }
        })),
      reset: () => set({ data: initialData }),
    }),

  )