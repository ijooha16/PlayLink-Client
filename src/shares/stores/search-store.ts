import { create } from 'zustand';

interface SearchStore {
  keyword: string;
  setKeyword: (k: string) => void;
  resetKeyword: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  keyword: '',
  setKeyword: (k) => set({ keyword: k }),
  resetKeyword: () => set({ keyword: '' }),
}));
