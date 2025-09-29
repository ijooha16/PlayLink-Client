'use client';

import { Input } from '@/components/forms/input';
import Button from '@/components/ui/button';
import { PATHS } from '@/constant';
import { useResetPassword } from '@/hooks/react-query/auth/use-reset-password';
import { useSessionToken } from '@/hooks/auth/use-reset-token';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const ResetPassword = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

  const { mutate: resetPassword } = useResetPassword();
  const { useAuth } = useSessionToken();

  useAuth(id as string);

  useEffect(() => {
    setIsAuthorized(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 첫 번째 비밀번호가 비어있으면 첫 번째 필드로 포커스
    if (!password.trim()) {
      passwordInputRef.current?.focus();
      return;
    }
    if (!isPasswordValid) {
      passwordInputRef.current?.focus();
      return;
    }

    // 확인 비밀번호가 비어있으면 확인 필드로 포커스
    if (!confirmPassword.trim()) {
      confirmPasswordInputRef.current?.focus();
      return;
    }
    if (!isConfirmPasswordValid) {
      confirmPasswordInputRef.current?.focus();
      return;
    }

    // 모든 필드가 유효하면 비밀번호 재설정
    resetPassword({ user_id: Number(id), newPw: password });
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
  };

  // 인증되지 않은 접근이면 아무것도 렌더링하지 않음
  if (!isAuthorized) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col gap-s-24'>
        <Input.Password
          ref={passwordInputRef}
          value={password}
          onChange={handlePasswordChange}
          onValidate={(isValid) => setIsPasswordValid(isValid)}
          placeholder='비밀번호를 입력해주세요'
          label='비밀번호'
          validateOnChange
          autoFocus
        />
        <Input.Password
          ref={confirmPasswordInputRef}
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          onValidate={(isValid) => setIsConfirmPasswordValid(isValid)}
          placeholder='비밀번호를 다시 입력해주세요'
          label='비밀번호 확인'
          confirmValue={password}
          validateOnChange
        />
      </div>
      <Button
        type="submit"
        isFloat
      >
        다음
      </Button>
    </form>
  );
};

export default ResetPassword;
