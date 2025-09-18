import { create } from 'zustand';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning';
export type ToastSize = 'sm' | 'md' | 'lg';

export interface ToastItem {
  id: string;
  message: string;
  variant?: ToastVariant;
  size?: ToastSize;
  duration?: number; // ms, 기본 3000
}

interface ToastState {
  toasts: ToastItem[];
  add: (toast: Omit<ToastItem, 'id'> & { id?: string }) => string; // 생성 후 id 반환
  remove: (id: string) => void;
  clear: () => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  add: ({ id, duration = 3000, ...rest }) => {
    const newId = id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const toast: ToastItem = { id: newId, duration, ...rest };
    set((s) => ({ toasts: [...s.toasts, toast] }));

    // 자동 제거 타이머
    if (duration && duration > 0) {
      setTimeout(() => {
        const exists = get().toasts.some((t) => t.id === newId);
        if (exists) get().remove(newId);
      }, duration);
    }

    return newId;
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));
