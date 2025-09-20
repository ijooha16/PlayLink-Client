'use client';

import PhoneVerification from '@/components/forms/verification/phone';
import AuthLayoutContainer from '@/components/layout/auth-layout';
import { useSignUpNavigation } from '@/hooks/use-sign-up-navigation';
import { useSignUpStepStore } from '@/store/sign-up-store';

const PhoneCheck = () => {
  const { data, updateStep } = useSignUpStepStore();
  const { goToNext, currentStepTitle } = useSignUpNavigation({
    currentStep: 'phone-check',
  });

  return (
    <AuthLayoutContainer title={currentStepTitle}>
      <PhoneVerification
        context="sign-up"
        initialPhone={data.phone}
        onSuccess={(phoneNumber) => {
          updateStep({ phone: phoneNumber, phoneVerified: true });
          goToNext();
        }}
      />
    </AuthLayoutContainer>
  );
};

export default PhoneCheck;