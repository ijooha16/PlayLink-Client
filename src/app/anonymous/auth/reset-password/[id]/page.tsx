'use client';

import { Input } from '@/components/forms/input';
import Button from '@/components/ui/button';
import { useSessionToken } from '@/hooks/auth/use-reset-token';
import { useResetPassword } from '@/hooks/react-query/auth/use-reset-password';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';

const ResetPassword = () => {
  const { id } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmValid, setIsConfirmValid] = useState(false);

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const { mutate: resetPassword } = useResetPassword();
  const { useAuth } = useSessionToken();

  useAuth(id as string);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim() || !isPasswordValid) {
      passwordRef.current?.focus();
      return;
    }

    if (!confirmPassword.trim() || !isConfirmValid) {
      confirmRef.current?.focus();
      return;
    }

    resetPassword({ user_id: Number(id), newPw: password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col gap-s-24'>
        <Input.Password
          ref={passwordRef}
          value={password}
          onChange={setPassword}
          onValidate={(isValid) => setIsPasswordValid(isValid)}
          placeholder='비밀번호를 입력해주세요'
          label='비밀번호'
          validateOnChange
          autoFocus
        />
        <Input.Password
          ref={confirmRef}
          isConfirm
          value={confirmPassword}
          onChange={setConfirmPassword}
          onValidate={(isValid) => setIsConfirmValid(isValid)}
          placeholder='비밀번호를 다시 입력해주세요'
          label='비밀번호 확인'
          confirmValue={password}
          validateOnChange
        />
      </div>
      <Button type='submit' isFloat disabled={!isPasswordValid || !isConfirmValid}>
        다음
      </Button>
    </form>
  );
};

export default ResetPassword;
