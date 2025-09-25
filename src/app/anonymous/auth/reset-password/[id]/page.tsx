'use client';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useInputHandlers } from '@/hooks/common/use-input-handlers';
import { useResetPassword } from '@/hooks/react-query/auth/use-reset-password';
import { useParams } from 'next/navigation';

const ResetPassword = () => {
  const params = useParams();
  const { id } = params;
  const { mutate: resetPassword } = useResetPassword();

  const {
    values,
    errors: localErrors,
    handlers,
  } = useInputHandlers(
    {
      password: '',
      confirmPassword: '',
    },
    {
      password: { type: 'password' },
      confirmPassword: { type: 'confirmPassword' },
    }
  );

  const displayErrors = {
    password: localErrors.password,
    confirmPassword: localErrors.confirmPassword,
  };

  return (
    <>
      <div className='flex flex-col gap-s-24'>
        <Input
          label='비밀번호'
          type='password'
          placeholder='비밀번호를 입력해주세요'
          value={values.password}
          onChange={handlers.password}
          hasError={!!displayErrors.password}
          errorMessage={displayErrors.password || ''}
          helperText={
            !values.password ? '영문, 숫자, 특수문자 조합 8~16자' : ''
          }
          showCancelToggle={!!values.password}
          showPasswordToggle
        />
        <Input
          label='비밀번호 확인'
          type='password'
          placeholder='비밀번호를 다시 입력해주세요'
          value={values.confirmPassword}
          onChange={handlers.confirmPassword}
          hasError={!!displayErrors.confirmPassword}
          errorMessage={displayErrors.confirmPassword || ''}
          showCancelToggle={!!values.confirmPassword}
          showPasswordToggle
        />
      </div>
      <Button
        isFloat
        disabled={
          !values.password ||
          !values.confirmPassword ||
          !!displayErrors.password ||
          !!displayErrors.confirmPassword
        }
        onClick={() => {
          resetPassword({ user_id: Number(id), newPw: values.password });
        }}
      >
        다음
      </Button>
    </>
  );
};

export default ResetPassword;
