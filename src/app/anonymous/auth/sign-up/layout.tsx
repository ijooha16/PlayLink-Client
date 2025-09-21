import Header from '@/components/layout/header';

const SignUpLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Header title={'회원가입'} backbtn />
      {children}
    </>
  );
};

export default SignUpLayout;
