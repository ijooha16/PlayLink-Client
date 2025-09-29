import { create } from 'zustand';

interface SearchStore {
  keyword: string;
  type: number | string;
  setKeyword: (k: string) => void;
  setType: (t: number) => void;
  resetKeyword: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  keyword: '',
  type: '',
  setKeyword: (k) => set({ keyword: k, type: '' }),
  setType: (t) => set({ type: t, keyword: '' }),
  resetKeyword: () => set({ keyword: '', type: '' }),
}));
