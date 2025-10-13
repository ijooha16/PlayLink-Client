'use client';

import Button from '@/components/ui/button';
import { animate, AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import type { AnimationPlaybackControls, PanInfo, SpringOptions } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const HANDLE_CLOSE_OFFSET = 80;
const HANDLE_CLOSE_VELOCITY = 1100;
const SPRING_CONFIG: SpringOptions = {
  stiffness: 360,
  damping: 36,
  mass: 0.92,
  restDelta: 0.3,
  restSpeed: 12,
};

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
  const sheetHeightRef = useRef(0);
  const closingAnimationRef = useRef<Promise<void> | null>(null);
  const closeFallbackTimeoutRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dragOrigin = useRef<'handle' | null>(null);
  const animationControls = useRef<AnimationPlaybackControls | null>(null);

  const y = useMotionValue(0);
  const overlayOpacity = useTransform(y, (value) => {
    const height = sheetHeightRef.current || sheetRef.current?.getBoundingClientRect().height || 1;
    const progress = Math.min(Math.max(value / height, 0), 1);
    return 0.5 * (1 - progress);
  });

  const stopActiveAnimation = () => {
    animationControls.current?.stop();
    animationControls.current = null;
  };

  const clearCloseFallbackTimeout = () => {
    if (closeFallbackTimeoutRef.current !== null) {
      clearTimeout(closeFallbackTimeoutRef.current);
      closeFallbackTimeoutRef.current = null;
    }
  };

  const animateTo = (target: number, options?: Partial<SpringOptions>) => {
    stopActiveAnimation();
    const controls = animate(y, target, {
      ...SPRING_CONFIG,
      velocity: y.getVelocity(),
      ...options,
    });
    animationControls.current = controls;
    return new Promise<void>((resolve) => {
      const finish = () => {
        if (animationControls.current === controls) {
          animationControls.current = null;
        }
        resolve();
      };

      controls.then(finish, finish);
    });
  };

  const measureSheetHeight = () => {
    const fallbackHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
    const measured =
      sheetRef.current?.getBoundingClientRect().height ?? fallbackHeight;
    sheetHeightRef.current = measured;
    return measured;
  };

  const clampToSheetHeight = (value: number) => {
    const height = sheetHeightRef.current || measureSheetHeight();
    return Math.min(Math.max(value, 0), height);
  };

  const closeSheet = () => {
    if (closingAnimationRef.current) {
      return closingAnimationRef.current;
    }

    setIsClosing(true);
    setIsDragging(false);
    dragOrigin.current = null;

    const targetY = measureSheetHeight();
    clearCloseFallbackTimeout();
    const promise = animateTo(targetY).catch(() => {
      // Swallow animation errors and continue closing flow
    });
    let finished = false;
    const finalizeClose = () => {
      if (finished) {
        return;
      }
      finished = true;
      clearCloseFallbackTimeout();
      setIsClosing(false);
      if (closingAnimationRef.current === promise) {
        closingAnimationRef.current = null;
      }
      onClose();
    };

    closingAnimationRef.current = promise;
    promise.then(finalizeClose);

    if (typeof window !== 'undefined') {
      closeFallbackTimeoutRef.current = window.setTimeout(finalizeClose, 600);
    } else {
      finalizeClose();
    }
    return promise;
  };

  useEffect(() => {
    let frame: number | null = null;
    const previousOverflow = document.body.style.overflow;

    if (isOpen) {
      document.body.style.overflow = 'hidden';

      stopActiveAnimation();
      clearCloseFallbackTimeout();
      closingAnimationRef.current = null;
      dragOrigin.current = null;
      setIsClosing(false);
      setIsDragging(false);

      frame = requestAnimationFrame(() => {
        const height = measureSheetHeight();
        y.set(height);
        animateTo(0);
      });
    } else {
      document.body.style.overflow = '';
      stopActiveAnimation();
      clearCloseFallbackTimeout();
      closingAnimationRef.current = null;
      dragOrigin.current = null;
      setIsDragging(false);
      setIsClosing(false);
    }

    return () => {
      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
      document.body.style.overflow = previousOverflow;
      clearCloseFallbackTimeout();
      stopActiveAnimation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeSheet();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleOverlayClick = () => {
    if (closeOnOverlay) {
      closeSheet();
    }
  };

  const handleConfirm = () => {
    onConfirm?.();
    closeSheet();
  };

  const handleCancel = () => {
    onCancel?.();
    closeSheet();
  };

  const handleDragStart = (
    event: MouseEvent | TouchEvent | PointerEvent,
    _info: PanInfo
  ) => {
    const target = event.target as HTMLElement;

    if (!sheetRef.current?.contains(target)) {
      dragOrigin.current = null;
      setIsDragging(false);
      return;
    }

    if (target.closest('[data-no-drag="true"]')) {
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

    dragOrigin.current = null;
    setIsDragging(false);
  };

  const handleDrag = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const origin = dragOrigin.current;

    if (origin === 'handle') {
      y.set(clampToSheetHeight(info.offset.y));
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

    if (origin === 'handle') {
      const shouldClose =
        offsetY > HANDLE_CLOSE_OFFSET || velocityY > HANDLE_CLOSE_VELOCITY;

      if (shouldClose && offsetY > 0) {
        y.set(clampToSheetHeight(offsetY));
        closeSheet();
        return;
      }

      dragOrigin.current = null;
      setIsDragging(false);
      animateTo(0);
      return;
    }

    dragOrigin.current = null;
    setIsDragging(false);
    animateTo(0);
  };

  const handleOverlayDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const shouldClose = info.offset.y > 50 || info.velocity.y > 300;
    if (shouldClose && closeOnOverlay) {
      closeSheet();
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
            className='absolute inset-0 bg-black backdrop-blur-sm'
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={handleOverlayClick}
            drag='y'
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0}
            onDragEnd={handleOverlayDragEnd}
            dragMomentum={false}
            style={isDragging || isClosing ? { opacity: overlayOpacity } : undefined}
          />
          <motion.div
            ref={sheetRef}
            role='dialog'
            aria-modal='true'
            className={`relative z-10 w-full ${heightClasses[height]} flex flex-col rounded-t-3xl bg-white shadow-xl`}
            animate={false}
            exit={{ y: '100%' }}
            transition={{ duration: 0 }}
            drag='y'
            dragElastic={0}
            dragDirectionLock={false}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            dragMomentum={false}
            dragTransition={{
              power: 0.3,
              timeConstant: 200,
            }}
            style={{ y }}
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
              data-no-drag="true"
              className={`flex-1 overflow-y-auto p-4 ${
                !showCancelButton && !showConfirmButton
                  ? 'pb-[max(1rem,env(safe-area-inset-bottom))]'
                  : ''
              }`}
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
            >
              {children}
            </div>

            {/* 버튼 영역 */}
            {(showCancelButton || showConfirmButton) && (
              <div
                data-no-drag="true"
                className='border-t border-gray-100 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]'
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
              >
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
