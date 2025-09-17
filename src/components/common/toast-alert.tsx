'use client';

import * as React from 'react';
import { useToastStore, ToastItem } from '@/stores/toast-alert-store';
import { Circle } from 'lucide-react';

const variants = {
  default: <Circle />,
  error: <Circle />,
  warning: <Circle />,
  success: <Circle />,
};

const colors = {
  default: 'text-white',
  error: 'text-system-error',
  warning: 'text-system-warning',
  success: 'text-system-success',
};

export const ToastContainer = () => {
  const { toasts } = useToastStore();

  return (
    <div className='fixed bottom-[46px] left-1/2 z-[9999] flex w-[calc(100%)] max-w-md -translate-x-1/2 transform flex-col gap-2 px-5'>
      {toasts.map((t) => (
        <ToastItemView key={t.id} item={t} />
      ))}
    </div>
  );
};

function ToastItemView({ item }: { item: ToastItem }) {
  return (
    <div
      className={`rounded-8 h-s-48 px-s-20 text-body-02 gap-s-8 flex items-center bg-gray-800 text-white`}
      role='status'
    >
      <div className={colors[item.variant!]}>{variants[item.variant!]}</div>
      <span className='whitespace-pre-line'>{item.message}</span>
    </div>
  );
}
