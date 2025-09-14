
'use client';

import { useEffect } from 'react';
import { useModalStore } from '@/shares/stores/modal-store';
import { X } from 'lucide-react';
import MarkdownRenderer from '@/components/common-components/markdown-renderer';
import Button from '@/components/common-components/button';

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
              <Button
                onClick={handleCancel}
                variant="default"
                className="flex-1 bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {cancelText}
              </Button>
            )}
            {showConfirmButton && (
              <Button
                onClick={handleConfirm}
                variant="default"
                className="flex-1"
              >
                {confirmText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}