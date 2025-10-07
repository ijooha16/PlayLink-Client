'use client';

import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';

interface WheelPickerProps {
  items: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  itemHeight?: number;
  infinite?: boolean;
  showHighlight?: boolean;
}

interface MomentumState {
  velocity: number;
  timestamp: number;
  isAnimating: boolean;
}

interface WheelPickerItemProps {
  item: string;
  virtualIndex: number;
  actualIndex: number;
  isSelected: boolean;
  opacity: number;
  itemHeight: number;
  onClick: () => void;
}

const WheelPickerItem = memo(function WheelPickerItem({
  item,
  virtualIndex,
  actualIndex,
  isSelected,
  opacity,
  itemHeight,
}: Omit<WheelPickerItemProps, 'onClick'>) {
  return (
    <div
      data-virtual-index={virtualIndex}
      data-actual-index={actualIndex}
      className={`flex items-center justify-center transition-colors ${
        isSelected ? 'text-primary-800' : 'text-text-disabled'
      }`}
      style={{
        height: `${itemHeight}px`,
        opacity,
      }}
    >
      <span className={isSelected ? 'text-body-1 font-semibold' : 'text-body-02 font-medium'}>
        {item}
      </span>
    </div>
  );
});

export default function WheelPicker({
  items,
  selectedIndex,
  onChange,
  itemHeight = 48,
  infinite = false,
  showHighlight = true,
}: WheelPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartYRef = useRef(0);
  const scrollStartTopRef = useRef(0);

  // Momentum scrolling state
  const momentumRef = useRef<MomentumState>({
    velocity: 0,
    timestamp: Date.now(),
    isAnimating: false,
  });
  const animationFrameRef = useRef<number>();
  const lastDragYRef = useRef(0);
  const lastDragTimeRef = useRef(0);
  const wheelTimeoutRef = useRef<NodeJS.Timeout>();
  const isInternalChangeRef = useRef(false);

  // Velocity tracking for better momentum calculation
  const velocitySamplesRef = useRef<number[]>([]);
  const maxVelocitySamples = 5;

  // 경계값 검증
  const safeSelectedIndex = Math.max(0, Math.min(items.length - 1, selectedIndex));

  // Stop momentum animation
  const stopMomentum = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
    momentumRef.current.isAnimating = false;
    momentumRef.current.velocity = 0;
  }, []);

  // 스크롤 끝났을 때 가장 가까운 아이템으로 스냅
  const handleScrollEnd = useCallback(() => {
    // 초기화 중이거나 아이템이 없으면 실행하지 않음
    if (!containerRef.current || isInitializing || items.length === 0) {
      return;
    }

    const paddingCount = Math.floor(5 / 2);
    const scrollTop = containerRef.current.scrollTop;

    // 가운데 위치한 아이템의 가상 인덱스 계산
    const centerPosition = scrollTop + paddingCount * itemHeight;
    const centerVirtualIndex = Math.round(centerPosition / itemHeight);
    const virtualIndex = centerVirtualIndex - paddingCount;

    // 무한 스크롤: 실제 인덱스로 변환, 일반: 범위 제한
    const finalIndex = infinite
      ? virtualIndex % items.length
      : Math.max(0, Math.min(items.length - 1, virtualIndex));

    if (finalIndex !== safeSelectedIndex) {
      isInternalChangeRef.current = true;
      onChange(finalIndex);
    }

    // 부드럽게 스냅 (infinite: virtualIndex, non-infinite: finalIndex 사용)
    const snapIndex = infinite ? virtualIndex : finalIndex;
    containerRef.current.scrollTo({
      top: snapIndex * itemHeight,
      behavior: 'smooth',
    });
  }, [isInitializing, itemHeight, safeSelectedIndex, items.length, onChange, infinite]);

  // Momentum animation loop
  const animateMomentum = useCallback(() => {
    if (!containerRef.current || !momentumRef.current.isAnimating) return;

    const now = Date.now();
    const deltaTime = now - momentumRef.current.timestamp;
    momentumRef.current.timestamp = now;

    // Apply friction (감속) - iOS 스타일 높은 friction
    const friction = 0.95; // 0.95로 높여서 스크롤 거리 크게 증가
    momentumRef.current.velocity *= friction;

    // Stop if velocity is too small
    if (Math.abs(momentumRef.current.velocity) < 0.3) {
      stopMomentum();
      handleScrollEnd();
      return;
    }

    // Apply velocity to scroll
    const scrollDelta = momentumRef.current.velocity * (deltaTime / 16); // Normalize to 60fps
    containerRef.current.scrollTop += scrollDelta;

    // Continue animation
    animationFrameRef.current = requestAnimationFrame(animateMomentum);
  }, [stopMomentum, handleScrollEnd]);

  // Start momentum with given velocity
  const startMomentum = useCallback(
    (velocity: number) => {
      stopMomentum();
      momentumRef.current.velocity = velocity;
      momentumRef.current.timestamp = Date.now();
      momentumRef.current.isAnimating = true;
      animationFrameRef.current = requestAnimationFrame(animateMomentum);
    },
    [stopMomentum, animateMomentum]
  );

  // 무한 스크롤을 위한 아이템 반복 (3 copies 기법)
  const repeatCount = infinite ? 3 : 1;
  const displayItems = useMemo(() => {
    if (!infinite) return items;
    const repeated: string[] = [];
    for (let i = 0; i < repeatCount; i++) {
      repeated.push(...items);
    }
    return repeated;
  }, [items, infinite, repeatCount]);

  // 무한 스크롤에서 가상 인덱스 계산 (중간 세트 사용)
  const getVirtualIndex = useCallback(
    (actualIndex: number) => {
      if (!infinite) return actualIndex;
      const middleSet = 1; // 3 copies에서 중간 세트 (0, 1, 2)
      return middleSet * items.length + actualIndex;
    },
    [infinite, items.length]
  );

  // 가상 인덱스를 실제 인덱스로 변환
  const getActualIndex = useCallback(
    (virtualIndex: number) => {
      if (!infinite) return virtualIndex;
      return virtualIndex % items.length;
    },
    [infinite, items.length]
  );

  // Wheel 이벤트 핸들러 (부드러운 스크롤)
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (!containerRef.current) return;

      // 기존 timeout과 momentum 정지
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
      stopMomentum();

      // deltaY를 적절히 스케일링 (너무 빠르지 않게)
      const scaledDelta = e.deltaY * 0.3; // PC 휠을 부드럽게
      containerRef.current.scrollTop += scaledDelta;

      // wheel이 멈추면 snap 실행
      wheelTimeoutRef.current = setTimeout(() => {
        handleScrollEnd();
      }, 100);
    },
    [stopMomentum]
  );

  // 마우스 드래그 핸들러
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    stopMomentum();
    setIsDragging(true);
    dragStartYRef.current = e.clientY;
    lastDragYRef.current = e.clientY;
    lastDragTimeRef.current = Date.now();
    scrollStartTopRef.current = containerRef.current.scrollTop;
    velocitySamplesRef.current = []; // Reset velocity samples
    e.preventDefault();
  }, [stopMomentum]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging || !containerRef.current) return;
      const deltaY = dragStartYRef.current - e.clientY;
      containerRef.current.scrollTop = scrollStartTopRef.current + deltaY;

      // Track velocity samples for better momentum calculation
      const now = Date.now();
      const timeDelta = now - lastDragTimeRef.current;
      if (timeDelta > 0) {
        const posDelta = e.clientY - lastDragYRef.current;
        const velocity = -posDelta / timeDelta;

        // Store velocity samples (최근 5개만 유지)
        velocitySamplesRef.current.push(velocity);
        if (velocitySamplesRef.current.length > maxVelocitySamples) {
          velocitySamplesRef.current.shift();
        }
      }
      lastDragYRef.current = e.clientY;
      lastDragTimeRef.current = now;
    },
    [isDragging, maxVelocitySamples]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      // Calculate average velocity from recent samples
      let finalVelocity = 0;
      if (velocitySamplesRef.current.length > 0) {
        // 최근 샘플들의 평균 사용
        const sum = velocitySamplesRef.current.reduce((acc, v) => acc + v, 0);
        const avgVelocity = sum / velocitySamplesRef.current.length;

        // iOS 스타일: velocity multiplier를 35-40으로 증폭
        finalVelocity = avgVelocity * 38;
      }

      // Apply momentum from drag (임계값 0.2로 낮춤)
      if (Math.abs(finalVelocity) > 0.2) {
        startMomentum(finalVelocity);
      } else {
        handleScrollEnd();
      }

      velocitySamplesRef.current = []; // Reset samples
    }
    setIsDragging(false);
  }, [isDragging, startMomentum, handleScrollEnd]);

  // 아이템 클릭 핸들러 (event delegation)
  const handleContainerClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDragging) return; // 드래그 중에는 클릭 무시

      const target = e.target as HTMLElement;
      const itemDiv = target.closest('[data-virtual-index]') as HTMLElement;

      if (itemDiv) {
        const virtualIndex = parseInt(itemDiv.dataset.virtualIndex || '0', 10);
        const actualIndex = parseInt(itemDiv.dataset.actualIndex || '0', 10);
        const targetIndex = infinite ? actualIndex : virtualIndex;

        if (targetIndex >= 0 && targetIndex < items.length) {
          if (!infinite && containerRef.current) {
            // non-infinite: 직접 scroll + onChange (중복 방지)
            isInternalChangeRef.current = true;
            containerRef.current.scrollTo({
              top: virtualIndex * itemHeight,
              behavior: 'smooth',
            });
          }
          // infinite: onChange만 호출 (useEffect에서 smooth scroll)
          onChange(targetIndex);
        }
      }
    },
    [infinite, items.length, onChange, itemHeight, isDragging]
  );

  // 초기 마운트 시 스크롤 위치 설정
  useEffect(() => {
    if (containerRef.current && items.length > 0) {
      const virtualIndex = getVirtualIndex(safeSelectedIndex);
      const scrollPosition = virtualIndex * itemHeight;

      // 렌더링이 완료될 때까지 기다림
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (containerRef.current) {
            containerRef.current.scrollTop = scrollPosition;

            // 초기화 완료 플래그 설정
            setTimeout(() => {
              setIsInitializing(false);
            }, 300);
          }
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 선택된 인덱스 변경 시 스크롤 이동
  useEffect(() => {
    if (containerRef.current && !isInitializing && items.length > 0) {
      // 내부 변경(handleScrollEnd)인 경우 스크롤하지 않음
      if (isInternalChangeRef.current) {
        isInternalChangeRef.current = false;
        return;
      }

      // 외부 변경인 경우 smooth scroll로 이동
      const scrollPosition = infinite
        ? getVirtualIndex(safeSelectedIndex) * itemHeight
        : safeSelectedIndex * itemHeight;
      containerRef.current.scrollTo({
        top: scrollPosition,
        behavior: 'smooth',
      });
    }
  }, [safeSelectedIndex, itemHeight, isInitializing, items.length, infinite, getVirtualIndex]);

  // Wheel 이벤트 리스너 등록
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      stopMomentum();
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
    };
  }, [stopMomentum]);

  // 무한 스크롤 경계 체크 (즉시 실행)
  const checkBoundaryAndReset = useCallback(() => {
    if (!containerRef.current || !infinite || repeatCount !== 3 || items.length === 0) {
      return;
    }

    const paddingCount = Math.floor(5 / 2);
    const scrollTop = containerRef.current.scrollTop;
    const centerPosition = scrollTop + paddingCount * itemHeight;
    const centerVirtualIndex = Math.round(centerPosition / itemHeight);
    const virtualIndex = centerVirtualIndex - paddingCount;

    const setIndex = Math.floor(virtualIndex / items.length);

    // 첫 번째(0) 또는 세 번째(2) 세트에 있으면 중간 세트(1)로 즉시 리셋
    if (setIndex === 0 || setIndex === 2) {
      const positionInSet = virtualIndex % items.length;
      const middleSetPosition = items.length + positionInSet;
      containerRef.current.scrollTop = middleSetPosition * itemHeight;
    }
  }, [infinite, repeatCount, items.length, itemHeight]);

  // 스크롤 이벤트: 경계 체크(즉시) + 스냅(디바운스)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      // 경계 체크는 즉시 실행
      checkBoundaryAndReset();

      // momentum animation 중에는 스냅하지 않음
      if (momentumRef.current.isAnimating) {
        return;
      }

      // 스냅은 디바운스
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (!momentumRef.current.isAnimating) {
          handleScrollEnd();
        }
      }, 150);
    };

    const container = containerRef.current;
    if (container && !isInitializing) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
        clearTimeout(timeoutId);
      };
    }
  }, [checkBoundaryAndReset, handleScrollEnd, isInitializing]);

  const visibleCount = 5; // 보이는 아이템 수
  const paddingCount = Math.floor(visibleCount / 2);
  const bottomPaddingCount = visibleCount - 1; // 마지막 아이템도 가운데 올 수 있도록

  return (
    <div className='relative flex-1'>
      {/* 선택 영역 하이라이트 */}
      {showHighlight && (
        <div
          className='pointer-events-none absolute left-0 right-0 z-10 bg-primary-50'
          style={{
            top: `${paddingCount * itemHeight}px`,
            height: `${itemHeight}px`,
          }}
        />
      )}

      {/* 상단 그라데이션 */}
      <div className='pointer-events-none absolute left-0 right-0 top-0 z-20 h-16 bg-gradient-to-b from-white to-transparent' />

      {/* 하단 그라데이션 */}
      <div className='pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-16 bg-gradient-to-t from-white to-transparent' />

      {/* 스크롤 컨테이너 */}
      <div
        ref={containerRef}
        className='relative z-30 scrollbar-hide overflow-y-auto'
        style={{
          height: `${visibleCount * itemHeight}px`,
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
        data-wheel-picker='true'
        onClick={handleContainerClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* 상단 빈 아이템 */}
        {Array.from({ length: paddingCount }).map((_, i) => (
          <div
            key={`top-${i}`}
            style={{
              height: `${itemHeight}px`,
            }}
          />
        ))}

        {/* 아이템 리스트 */}
        {displayItems.map((item, virtualIndex) => {
          // 무한 스크롤: 실제 인덱스로 비교, 일반: 가상 인덱스 그대로 사용
          const actualIndex = infinite ? getActualIndex(virtualIndex) : virtualIndex;
          const isSelected = actualIndex === safeSelectedIndex;
          const distance = Math.abs(actualIndex - safeSelectedIndex);
          const opacity = Math.max(0.3, 1 - distance * 0.3);

          return (
            <WheelPickerItem
              key={`${virtualIndex}-${item}`}
              item={item}
              virtualIndex={virtualIndex}
              actualIndex={actualIndex}
              isSelected={isSelected}
              opacity={opacity}
              itemHeight={itemHeight}
            />
          );
        })}

        {/* 하단 빈 아이템 */}
        {Array.from({ length: bottomPaddingCount }).map((_, i) => (
          <div
            key={`bottom-${i}`}
            style={{
              height: `${itemHeight}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
