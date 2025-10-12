'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface ProgressBarProps {
  currentStep: 0 | 1 | 2 | 3;
  onChange: (step: 0 | 1 | 2 | 3) => void;
}

const stepLabels = ['가까운 동네', '', '', '먼 동네'];
const stepPercents = ['가까운 동네', '조금 먼 동네', '먼 동네', '아주 먼 동네'];

// TODO PWA 할 때 navigator,vibrate()로 햅틱 추가
const RangeBar = ({ currentStep, onChange }: ProgressBarProps) => {
  const steps = useMemo(() => [0, 1, 2, 3] as const, []);
  const barRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0); // 진행 바 퍼센트

  // step → % 계산 함수
  const stepToPercent = (step: number) => (step / (steps.length - 1)) * 100;

  useEffect(() => {
    // 드래그 중이 아닐 때는 step에 맞춰 스냅
    if (!isDragging) {
      setProgressWidth(stepToPercent(currentStep));
    }
  }, [currentStep, isDragging]);

  const getPercentFromPosition = (clientX: number) => {
    if (!barRef.current) return progressWidth;
    const rect = barRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.max(0, Math.min(100, (x / rect.width) * 100));
  };

  // 가장 가까운 step 찾기
  const snapToStep = (percent: number) => {
    const step = Math.round((percent / 100) * (steps.length - 1)) as
      | 0
      | 1
      | 2
      | 3;
    return step;
  };

  // 마우스/터치 이벤트
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setProgressWidth(getPercentFromPosition(clientX));
  };
  const handleMove = (clientX: number) => {
    if (isDragging) setProgressWidth(getPercentFromPosition(clientX));
  };
  const handleEnd = () => {
    setIsDragging(false);
    const step = snapToStep(progressWidth);
    onChange(step);
  };

  // 전역 이벤트 등록
  useEffect(() => {
    const mouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const touchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const mouseUp = handleEnd;
    const touchEnd = handleEnd;

    if (isDragging) {
      window.addEventListener('mousemove', mouseMove);
      window.addEventListener('mouseup', mouseUp);
      window.addEventListener('touchmove', touchMove);
      window.addEventListener('touchend', touchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', mouseUp);
      window.removeEventListener('touchmove', touchMove);
      window.removeEventListener('touchend', touchEnd);
    };
  }, [isDragging, progressWidth]);

  return (
    <div className='relative w-full px-4 py-6'>
      <div className='px-4'>
        <div
          ref={barRef}
          className='relative h-3 w-full cursor-pointer rounded-full bg-gray-300'
          onMouseDown={(e) => handleStart(e.clientX)}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        >
          {/* 진행 영역 */}
          <div
            className={`absolute left-0 top-0 h-3 rounded-full bg-blue-500 ${!isDragging ? 'transition-all duration-300' : ''}`}
            style={{ width: `${progressWidth}%` }}
          />

          {/* 포인트 버튼 */}
          <div className='absolute left-0 top-0 flex w-full justify-between'>
            {steps.map((step) => (
              <button
                key={step}
                onClick={() => onChange(step)}
                aria-label={`${stepPercents[step]}`}
                className='relative z-10 h-6 w-6 rounded-full border-2 border-blue-500 transition-all'
                style={{
                  transform: 'translateY(-25%)',
                  backgroundColor:
                    step <= currentStep
                      ? 'rgb(59, 130, 246)'
                      : 'rgb(209 213 219)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 라벨 */}
      <div className='mt-2 flex justify-between pr-2 text-sm font-medium text-gray-600'>
        {stepLabels.map((label, idx) => (
          <span
            key={idx}
            className={idx === currentStep ? 'font-bold text-blue-600' : ''}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RangeBar;
