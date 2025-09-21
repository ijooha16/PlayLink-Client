import { useToastStore } from '@/store/toast-alert-store';

export function showToast(
  message: string,
  options?: {
    variant?: 'default' | 'success' | 'error' | 'warning';
    size?: 'sm' | 'md' | 'lg';
    duration?: number;
  }
) {
  const { add } = useToastStore.getState();
  return add({ message, ...options });
}

export const toast = {
  show: showToast,
  success: (
    msg: string,
    opts?: Omit<Parameters<typeof showToast>[1], 'variant'>
  ) => showToast(msg, { ...opts, variant: 'success' }),
  error: (
    msg: string,
    opts?: Omit<Parameters<typeof showToast>[1], 'variant'>
  ) => showToast(msg, { ...opts, variant: 'error' }),
  warn: (
    msg: string,
    opts?: Omit<Parameters<typeof showToast>[1], 'variant'>
  ) => showToast(msg, { ...opts, variant: 'warning' }),
  clearAll: () => useToastStore.getState().clear(),
  hide: (id: string) => useToastStore.getState().remove(id),
};
