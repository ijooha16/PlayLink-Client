'use client';

import EmailVerification from '@/components/forms/verification/email';
import { useSignUp, useSignin } from '@/hooks/react-query/auth/use-signin';
import useSignUpStore from '@/store/use-sign-up-store';
import { getDeviceInfo } from '@/utills/get-device-info';
import { useRouter } from 'next/navigation';
const EmailCheck = () => {
  const router = useRouter();
  const { signUp: signUpData, resetSignUp, updateSignUp } = useSignUpStore();
  const { mutate: signIn } = useSignin({
    onSuccess: () => {
      router.replace('/anonymous/auth/sign-up/welcome');
      resetSignUp();
    },
  });

  const { mutate: signUp } = useSignUp({
    onSuccess: async () => {
      const deviceInfo = await getDeviceInfo();
      console.log('signUpData', signUpData);
      signIn({
        email: signUpData.emailCheck.email,
        password: signUpData.emailCheck.password,
        device_id: deviceInfo.deviceId,
      });
    },
  });



  return (
    <>
      <EmailVerification
        initialEmail={signUpData.emailCheck.email}
        phoneNumber={signUpData.phoneNumber}
        onSuccess={async (emailData) => {
          const deviceInfo = await getDeviceInfo();
          signUp({
            email: emailData.email,
            password: emailData.password,
            passwordCheck: emailData.confirmPassword,
            device_id: deviceInfo.deviceId,
            device_type: deviceInfo.deviceType as string,
            platform: deviceInfo.platform as string,
            name: "익명",
            phoneNumber: signUpData.phoneNumber || '',
            account_type: '0'
          });
          updateSignUp('emailCheck', {
            email: emailData.email,
            password: emailData.password,
            passwordCheck: emailData.confirmPassword,
          });
        }}
      />
    </>
  );
};

export default EmailCheck;