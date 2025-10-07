'use client';

import Button from '@/components/ui/button';
import {
  AnimatePresence,
  motion,
  PanInfo,
  useMotionValue,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const SCROLL_LOCK_THRESHOLD = 5;
const HANDLE_CLOSE_OFFSET = 80;
const HANDLE_CLOSE_VELOCITY = 1100;
const CONTENT_STRONG_OFFSET = 120;
const CONTENT_STRONG_VELOCITY = 1400;

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
  const dragOrigin = useRef<'handle' | 'content' | null>(null);
  const hasStrongContentGesture = useRef(false);

  const y = useMotionValue(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      y.set(0);
    } else {
      document.body.style.overflow = '';
    }

    dragOrigin.current = null;
    hasStrongContentGesture.current = false;
    setIsDragging(false);

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
    _info: PanInfo
  ) => {
    const target = event.target as HTMLElement;

    hasStrongContentGesture.current = false;

    if (!sheetRef.current?.contains(target)) {
      dragOrigin.current = null;
      setIsDragging(false);
      return;
    }

    if (target.closest('[data-wheel-picker="true"]')) {
      dragOrigin.current = null;
      setIsDragging(false);
      return;
    }

    if (handleRef.current?.contains(target)) {
      dragOrigin.current = 'handle';
      setIsDragging(true);
      return;
    }

    if (contentRef.current?.contains(target)) {
      const scrollTop = contentRef.current.scrollTop ?? 0;
      dragOrigin.current =
        scrollTop <= SCROLL_LOCK_THRESHOLD ? 'content' : null;
      setIsDragging(false);
      return;
    }

    dragOrigin.current = null;
    setIsDragging(false);
  };

  const handleDrag = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const origin = dragOrigin.current;

    if (origin === 'handle') {
      const nextY = Math.max(info.offset.y, 0);
      y.set(nextY);
      return;
    }

    if (origin === 'content') {
      y.set(0);

      if (info.offset.y <= 0) {
        return;
      }

      const strongOffset = info.offset.y > CONTENT_STRONG_OFFSET;
      const strongVelocity = info.velocity.y > CONTENT_STRONG_VELOCITY;
      if ((strongOffset || strongVelocity) && !hasStrongContentGesture.current) {
        hasStrongContentGesture.current = true;
        dragOrigin.current = null;
        setIsDragging(false);
        y.stop();
        y.set(0);
        onClose();
      }
      return;
    }

    y.set(0);
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const origin = dragOrigin.current;
    const offsetY = info.offset.y;
    const velocityY = info.velocity.y;

    dragOrigin.current = null;

    if (origin === 'handle') {
      const shouldClose = offsetY > HANDLE_CLOSE_OFFSET || velocityY > HANDLE_CLOSE_VELOCITY;

      if (shouldClose && offsetY > 0) {
        setIsDragging(false);
        onClose();
        return;
      }

      setIsDragging(false);
      y.stop();
      y.set(0);
      return;
    }

    if (origin === 'content') {
      if (hasStrongContentGesture.current && offsetY > 0) {
        hasStrongContentGesture.current = false;
        onClose();
        return;
      }

      hasStrongContentGesture.current = false;
      y.stop();
      y.set(0);
      return;
    }

    setIsDragging(false);
    y.stop();
    y.set(0);
  };

  const handleOverlayDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
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
            animate={isDragging ? false : { y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
              mass: 1,
              velocity: 2,
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
