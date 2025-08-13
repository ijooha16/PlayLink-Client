import { create } from 'zustand';

type AlertStore = {
  isOpen: boolean;
  title: string;
  content: string;
  timerId: NodeJS.Timeout | null;
  openAlert: (title: string, content: string) => void;
  closeAlert: () => void;
};

export const useAlertStore = create<AlertStore>((set, get) => ({
  isOpen: false,
  title: '',
  content: '',
  timerId: null,

  openAlert: (title, content) => {
    const { timerId } = get();
    if (timerId) {
      clearTimeout(timerId);
    }
    set({ isOpen: true, title, content });
    const newTimerId = setTimeout(() => {
      set({ isOpen: false, title: '', content: '', timerId: null });
    }, 3000);
    set({ timerId: newTimerId });
  },

  closeAlert: () => {
    const { timerId } = get();
    if (timerId) {
      clearTimeout(timerId);
    }
    set({ isOpen: false, title: '', content: '', timerId: null });
  },
}));
