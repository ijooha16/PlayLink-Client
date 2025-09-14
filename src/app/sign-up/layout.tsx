import Header from '@/components/common-components/header';

const SignUpLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='h-full w-full'>
      <div className='flex'>
        <Header title={'회원가입'} backbtn={true} />
      </div>
      {children}
    </div>
  );
};

export default SignUpLayout;
