'use client';

import { SignUpStep, getNextStep, getPreviousStep, getStepConfig } from '@/constant/sign-up-flow';
import { useSignUpStepStore } from '@/store/sign-up-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface UseSignUpNavigationOptions {
  currentStep: SignUpStep;
  skipValidation?: boolean;
}

export const useSignUpNavigation = ({
  currentStep,
  skipValidation = false,
}: UseSignUpNavigationOptions) => {
  const router = useRouter();
  const {
    setCurrentStep,
    canNavigateToStep,
    isStepCompleted,
  } = useSignUpStepStore();

  useEffect(() => {
    setCurrentStep(currentStep);

    if (!skipValidation && !canNavigateToStep(currentStep)) {
      const redirectStep = findValidStep();
      if (redirectStep && redirectStep !== currentStep) {
        const stepConfig = getStepConfig(redirectStep);
        // if (stepConfig) {
        //   router.push(stepConfig.path);
        // }
      }
    }
  }, [currentStep, skipValidation]);

  const findValidStep = (): SignUpStep => {
    const steps: SignUpStep[] = [
      'terms',
      'phone-check',
      'email-check',
      'welcome',
      'profile',
      'address',
      'interest',
      'sports',
    ];

    for (const step of steps) {
      if (!isStepCompleted(step)) {
        return step;
      }
    }
    return 'terms';
  };

  const goToNext = () => {
    const nextStep = getNextStep(currentStep);
    if (nextStep) {
      setCurrentStep(nextStep);
      const stepConfig = getStepConfig(nextStep);
      if (stepConfig) {
        router.push(stepConfig.path);
      }
    }
  };

  const goToPrevious = () => {
    const previousStep = getPreviousStep(currentStep);
    if (previousStep) {
      setCurrentStep(previousStep);
      const stepConfig = getStepConfig(previousStep);
      if (stepConfig) {
        router.push(stepConfig.path);
      }
    }
  };

  const goToStep = (step: SignUpStep) => {
    if (canNavigateToStep(step)) {
      setCurrentStep(step);
      const stepConfig = getStepConfig(step);
      if (stepConfig) {
        router.push(stepConfig.path);
      }
    }
  };

  const currentStepConfig = getStepConfig(currentStep);

  return {
    goToNext,
    goToPrevious,
    goToStep,
    currentStepTitle: currentStepConfig?.title || '',
    canNavigateToStep,
    isStepCompleted,
  };
};