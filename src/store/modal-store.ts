import { create } from 'zustand';
import { ReactNode } from 'react';

interface ModalState {
  isOpen: boolean;
  title?: string;
  content: ReactNode | string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  closeOnOverlay?: boolean;
  isMarkdown?: boolean;
}

interface ModalStore extends ModalState {
  openModal: (options: Partial<ModalState>) => void;
  closeModal: () => void;

}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  content: null,
  title: undefined,
  onConfirm: undefined,
  onCancel: undefined,
  confirmText: '확인',
  cancelText: '취소',
  showCancelButton: true,
  showConfirmButton: true,
  closeOnOverlay: true,
  isMarkdown: false,

  openModal: (options) =>
    set({
      isOpen: true,
      ...options,
    }),

  closeModal: () =>
    set({
      isOpen: false,
      content: null,
      title: undefined,
      onConfirm: undefined,
      onCancel: undefined,
      confirmText: '확인',
      cancelText: '취소',
      showCancelButton: true,
      showConfirmButton: true,
      closeOnOverlay: true,
      isMarkdown: false,
    }),
}));