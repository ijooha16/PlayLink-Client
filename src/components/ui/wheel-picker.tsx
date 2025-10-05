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
        scrollSnapAlign: 'start',
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

  // 경계값 검증
  const safeSelectedIndex = Math.max(0, Math.min(items.length - 1, selectedIndex));

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

  // 아이템 클릭 핸들러 (event delegation)
  const handleContainerClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const itemDiv = target.closest('[data-virtual-index]') as HTMLElement;

      if (itemDiv) {
        const virtualIndex = parseInt(itemDiv.dataset.virtualIndex || '0', 10);
        const actualIndex = parseInt(itemDiv.dataset.actualIndex || '0', 10);
        const targetIndex = infinite ? actualIndex : virtualIndex;

        if (targetIndex >= 0 && targetIndex < items.length) {
          onChange(targetIndex);
          if (!infinite && containerRef.current) {
            containerRef.current.scrollTo({
              top: virtualIndex * itemHeight,
              behavior: 'smooth',
            });
          }
        }
      }
    },
    [infinite, items.length, onChange, itemHeight]
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
      const scrollPosition = infinite
        ? getVirtualIndex(safeSelectedIndex) * itemHeight
        : safeSelectedIndex * itemHeight;
      containerRef.current.scrollTop = scrollPosition;
    }
  }, [safeSelectedIndex, itemHeight, isInitializing, items.length, infinite, getVirtualIndex]);

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
      ? getActualIndex(virtualIndex)
      : Math.max(0, Math.min(items.length - 1, virtualIndex));

    if (finalIndex !== safeSelectedIndex) {
      onChange(finalIndex);
    }

    // 부드럽게 스냅
    containerRef.current.scrollTo({
      top: virtualIndex * itemHeight,
      behavior: 'smooth',
    });
  }, [isInitializing, itemHeight, safeSelectedIndex, items.length, onChange, infinite, getActualIndex]);

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

      // 스냅은 디바운스
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleScrollEnd();
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
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
        }}
        onClick={handleContainerClick}
      >
        {/* 상단 빈 아이템 */}
        {Array.from({ length: paddingCount }).map((_, i) => (
          <div
            key={`top-${i}`}
            style={{
              height: `${itemHeight}px`,
              scrollSnapAlign: 'start',
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
              scrollSnapAlign: 'start',
            }}
          />
        ))}
      </div>
    </div>
  );
}
