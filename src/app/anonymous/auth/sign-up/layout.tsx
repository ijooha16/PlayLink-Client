import AuthLayoutContainer from '@/components/layout/auth-layout';
import Header from '@/components/layout/header';

const SignUpLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
  <Header title={'회원가입'} backbtn />
  <AuthLayoutContainer flowType="signup">
    {children}
  </AuthLayoutContainer>
    </>
  );
};

export default SignUpLayout;
