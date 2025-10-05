'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProgressBarProps {
  steps: Array<{ key: string; path: string }>;
  className?: string;
}

const ProgressBar = ({ steps, className = '' }: ProgressBarProps) => {
  const pathname = usePathname();
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const currentStepIndex = steps.findIndex((step) =>
    pathname.includes(step.key)
  );
  const targetProgress =
    currentStepIndex >= 0
      ? ((currentStepIndex + 1) / steps.length) * 100
      : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(targetProgress);
    }, 100);

    return () => clearTimeout(timer);
  }, [targetProgress]);

  return (
    <div
      className={`fixed left-1/2 top-14 z-40 w-full max-w-[640px] -translate-x-1/2 bg-white ${className}`}
    >
      <div className='relative h-1 w-full bg-line-netural'>
        <div
          className='absolute left-0 top-0 h-full rounded-full bg-brand-primary transition-all duration-700 ease-out'
          style={{ width: `${animatedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
