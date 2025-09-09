
'use client';

import { useEffect } from 'react';
import { useModalStore } from '@/shares/stores/modal-store';
import { X } from 'lucide-react';
import MarkdownRenderer from '@/shares/common-components/markdown-renderer';

export default function GlobalModal() {
  const {
    isOpen,
    title,
    content,
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
    showCancelButton,
    showConfirmButton,
    closeOnOverlay,
    closeModal,
    isMarkdown,
  } = useModalStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    if (closeOnOverlay) {
      closeModal();
    }
  };

  const handleConfirm = () => {
    onConfirm?.();
    closeModal();
  };

  const handleCancel = () => {
    onCancel?.();
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleOverlayClick}
      />
      
      <div className="relative z-10 mx-4 w-full max-w-md animate-modal-enter rounded-3xl bg-white p-6 shadow-xl">
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {title && (
          <h2 className="text-lg font-bold text-gray-900">
            {title}
          </h2>
        )}

        <div className="h-[500px] overflow-y-auto scrollbar-hide">
          {isMarkdown && typeof content === 'string' ? (
            <MarkdownRenderer content={content} />
          ) : (
            <div className="text-gray-700">{content}</div>
          )}
        </div>

        {(showCancelButton || showConfirmButton) && (
          <div className="flex gap-3">
            {showCancelButton && (
              <button
                onClick={handleCancel}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                {cancelText}
              </button>
            )}
            {showConfirmButton && (
              <button
                onClick={handleConfirm}
                className="flex-1 rounded-xl bg-primary px-4 py-3 font-medium text-white transition-colors hover:bg-blue-600"
              >
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}