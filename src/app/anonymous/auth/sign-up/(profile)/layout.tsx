'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const ProgressBar = () => {
  const pathname = usePathname();
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const steps = [
    { key: 'profile', path: '/anonymous/auth/sign-up/profile' },
    { key: 'address', path: '/anonymous/auth/sign-up/address' },
    { key: 'interest', path: '/anonymous/auth/sign-up/interest' },
    { key: 'sports', path: '/anonymous/auth/sign-up/sports' },
    { key: 'complete', path: '/anonymous/auth/sign-up/complete' },
  ];

  const currentStepIndex = steps.findIndex(step => pathname.includes(step.key));
  const targetProgress = currentStepIndex >= 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(targetProgress);
    }, 100);

    return () => clearTimeout(timer);
  }, [targetProgress]);

  return (
    <div className="fixed left-1/2 top-14 z-40 w-full max-w-[640px] -translate-x-1/2 bg-white">
      {/* Progress Bar */}
      <div className="relative w-full h-1 bg-line-netural">
        <div
          className="absolute top-0 left-0 h-full bg-brand-primary rounded-full transition-all duration-700 ease-out"
          style={{ width: `${animatedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default function ProcessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ProgressBar />
        {children}
    </div>
  );
}