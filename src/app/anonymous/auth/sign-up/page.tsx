import { PATHS } from '@/constant/paths';
import { redirect } from 'next/navigation';

const SignUp = () => {
  redirect(PATHS.AUTH.SIGN_UP + '/terms');
};

export default SignUp;
