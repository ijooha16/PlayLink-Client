import Header from '@/components/common/layout/header';

const SignUpLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Header title={'이메일로 시작하기'} backbtn />
      {children}
    </>
  );
};

export default SignUpLayout;
