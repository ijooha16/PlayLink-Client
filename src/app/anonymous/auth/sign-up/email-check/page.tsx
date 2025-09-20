'use client';

import EmailVerification from '@/components/forms/verification/email';
import AuthLayoutContainer from '@/components/layout/auth-layout';
import { useSignUpNavigation } from '@/hooks/use-sign-up-navigation';
import { useSignUpStepStore } from '@/store/sign-up-store';

const EmailCheck = () => {
  const { data, updateStep } = useSignUpStepStore();
  const { goToNext, currentStepTitle } = useSignUpNavigation({
    currentStep: 'email-check',
  });

  return (
    <AuthLayoutContainer title={currentStepTitle}>
      <EmailVerification
        initialEmail={data.email}
        phoneNumber={data.phone}
        onSuccess={(emailData) => {
          updateStep(emailData);
          goToNext();
        }}
      />
    </AuthLayoutContainer>
  );
};

export default EmailCheck;