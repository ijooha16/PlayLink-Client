import CommonHeader from '@/shares/common-components/common-header';

const SignUpLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='h-full w-full'>
      <CommonHeader title={'회원가입'} />
      {children}
    </div>
  );
};

export default SignUpLayout;
