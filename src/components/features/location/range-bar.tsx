'use client';

import { useMemo } from 'react';

interface ProgressBarProps {
  currentStep: 0 | 1 | 2 | 3;
  onChange: (step: 0 | 1 | 2 | 3) => void;
}

const stepLabels = ['가까운 동네', '', '', '먼 동네'];
const stepPercents = ['가까운 동네', '조금 먼 동네', '먼 동네', '아주 먼 동네'];

const RangeBar = ({ currentStep, onChange }: ProgressBarProps) => {
  const steps = useMemo(() => [0, 1, 2, 3] as const, []);

  return (
    <div className='relative w-full px-4 py-6'>
      {/* 바 전체 */}
      <div className='px-4'>
        <div className='relative h-3 w-full rounded-full bg-gray-300'>
          {/* 진행된 영역 */}
          <div
            className='absolute left-0 top-0 h-3 rounded-full bg-blue-500 transition-all'
            style={{ width: `${currentStep * 33.3333}%` }}
          />
          {/* 포인트들 */}
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
