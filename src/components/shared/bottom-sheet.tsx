'use client';

import Button from '@/components/ui/button';
import {
  AnimatePresence,
  motion,
  PanInfo,
  useMotionValue,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: 'auto' | 'half' | 'full';
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  closeOnOverlay?: boolean;
}

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  height = 'auto',
  confirmText = '확인',
  cancelText = '취소',
  showCancelButton = false,
  showConfirmButton = true,
  onConfirm,
  onCancel,
  closeOnOverlay = true,
}: BottomSheetProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const y = useMotionValue(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      y.set(0);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleOverlayClick = () => {
    if (closeOnOverlay) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  const handleDragStart = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const target = event.target as HTMLElement;
    const isHandleArea = handleRef.current?.contains(target);

    if (isHandleArea) {
      setIsDragging(true);
      return;
    }

    const isContentArea = contentRef.current?.contains(target);

    if (isContentArea) {
      setIsDragging(false);
      return;
    }

    const scrollTop = contentRef.current?.scrollTop || 0;

    if (scrollTop <= 5 && info.offset.y > 0) {
      setIsDragging(true);
    }
  };

  const handleDrag = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (!isDragging) return;

    if (info.offset.y > 0) {
      y.set(info.offset.y);
    } else {
      y.set(0);
    }
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (!isDragging) return;

    setIsDragging(false);

    const threshold = height === 'full' ? 200 : 150;
    const shouldClose = info.offset.y > threshold || info.velocity.y > 500;

    if (shouldClose) {
      onClose();
    } else {
      y.set(0);
    }
  };

  const handleOverlayDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const shouldClose = info.offset.y > 50 || info.velocity.y > 300;
    if (shouldClose && closeOnOverlay) {
      onClose();
    }
  };

  const heightClasses = {
    auto: 'max-h-[90vh]',
    half: 'h-[50vh]',
    full: 'h-[90vh]',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-50 mx-auto flex max-w-screen-sm items-end justify-center'>
          <motion.div
            className='absolute inset-0 bg-black/50 backdrop-blur-sm'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={handleOverlayClick}
            drag='y'
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0}
            onDragEnd={handleOverlayDragEnd}
            dragMomentum={false}
          />
          <motion.div
            ref={sheetRef}
            role='dialog'
            aria-modal='true'
            className={`relative z-10 w-full ${heightClasses[height]} flex flex-col rounded-t-3xl bg-white shadow-xl`}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'tween',
              duration: 0.5,
              ease: [0.32, 0.72, 0, 1],
            }}
            drag='y'
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.1 }}
            dragDirectionLock={false}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            dragMomentum={false}
            dragTransition={{
              power: 0.3,
              timeConstant: 200,
            }}
            style={isDragging ? { y } : undefined}
          >
            {/* 드래그 핸들 */}
            <div
              ref={handleRef}
              className='group flex cursor-grab justify-center py-4 active:cursor-grabbing'
            >
              <div className='h-1.5 w-16 rounded-full bg-gray-400 transition-colors group-hover:bg-gray-500 group-active:bg-gray-600' />
            </div>

            {/* 컨텐츠 영역 */}
            <div
              ref={contentRef}
              className={`flex-1 overflow-y-auto p-4 ${
                !showCancelButton && !showConfirmButton
                  ? 'pb-[max(1rem,env(safe-area-inset-bottom))]'
                  : ''
              }`}
            >
              {children}
            </div>

            {/* 버튼 영역 */}
            {(showCancelButton || showConfirmButton) && (
              <div className='border-t border-gray-100 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]'>
                <div className='flex gap-3'>
                  {showCancelButton && (
                    <Button
                      onClick={handleCancel}
                      variant='default'
                      className='flex-1 border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50'
                    >
                      {cancelText}
                    </Button>
                  )}
                  {showConfirmButton && (
                    <Button
                      onClick={handleConfirm}
                      variant='default'
                      className='flex-1'
                    >
                      {confirmText}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
