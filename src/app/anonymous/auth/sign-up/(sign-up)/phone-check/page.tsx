'use client';

import PhoneVerification from '@/components/forms/verification/phone';
import useSignUpStore from '@/store/use-sign-up-store';
import { useRouter } from 'next/navigation';

const PhoneCheck = () => {
  const { signUp, updateSignUp } = useSignUpStore();
  const router = useRouter();

  return (
    <>
      <PhoneVerification
        context="sign-up"
        initialPhone={signUp.phoneNumber}
        onSuccess={(phoneNumber) => {
          updateSignUp('phoneNumber', phoneNumber)
          router.replace('/anonymous/auth/sign-up/email-check');
        }}
      />
    </>
  );
};

export default PhoneCheck;