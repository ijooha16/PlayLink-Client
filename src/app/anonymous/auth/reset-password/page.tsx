'use client';

import ResetPasswordVerification from '@/components/forms/verification/reset-password';
import { useState } from 'react';

const InfoCheck = () => {
    const [newPassword, setNewPassword] = useState(''); 
    const [userId, setUserId] = useState<number | null>(null);
    
  return (
    <>
      <ResetPasswordVerification
        onSuccess={(data) => console.log('thissssssssss', data)}
      />
    
    </>
  );
};

export default InfoCheck;
