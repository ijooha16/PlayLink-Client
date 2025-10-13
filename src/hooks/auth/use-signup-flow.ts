'use client';

import { PATHS } from '@/constant';

type SignUpStep = 'terms' | 'phone-check' | 'email-check' | 'welcome' | 'profile' | 'address' | 'interest' | 'sports';

const FLOW_ORDER: SignUpStep[] = ['terms', 'phone-check', 'email-check', 'welcome', 'profile', 'address', 'interest', 'sports'];

const PATH_TO_STEP: Record<string, SignUpStep> = {
  [PATHS.AUTH.TERMS]: 'terms',
  [PATHS.AUTH.PHONE_CHECK]: 'phone-check',
  [PATHS.AUTH.EMAIL_CHECK]: 'email-check',
  [PATHS.AUTH.WELCOME]: 'welcome',
  [PATHS.AUTH.PROFILE]: 'profile',
  [PATHS.AUTH.ADDRESS]: 'address',
  [PATHS.AUTH.INTEREST]: 'interest',
  [PATHS.AUTH.SPORTS]: 'sports',
};

const getStepIndex = (step: SignUpStep): number => FLOW_ORDER.indexOf(step);

export const checkSignUpAccess = (pathname: string): boolean => {
  const currentStep = PATH_TO_STEP[pathname];
  if (!currentStep) return true;

  const completedStep = sessionStorage.getItem('signup-step');
  const currentIndex = getStepIndex(currentStep);
  const completedIndex = completedStep ? getStepIndex(completedStep as SignUpStep) : -1;

  return currentIndex <= completedIndex + 1;
};

export const completeStep = (step: SignUpStep) => {
  sessionStorage.setItem('signup-step', step);
};

export const clearFlow = () => {
  sessionStorage.removeItem('signup-step');
};
