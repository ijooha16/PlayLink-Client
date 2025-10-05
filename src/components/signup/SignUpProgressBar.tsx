'use client';

import ProgressBar from '@/components/ui/progress-bar';
import { PATHS } from '@/constant';

const SignUpProgressBar = () => {
  const profileSteps = [
    { key: 'profile', path: PATHS.AUTH.PROFILE },
    { key: 'address', path: PATHS.AUTH.ADDRESS },
    { key: 'interest', path: PATHS.AUTH.INTEREST },
    { key: 'sports', path: PATHS.AUTH.SPORTS },
  ];

  return <ProgressBar steps={profileSteps} />;
};

export default SignUpProgressBar;
