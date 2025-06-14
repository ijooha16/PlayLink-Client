import Header from '@/features/play-link/view/sign-up/header';

const SignUpLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='h-full w-full'>
      <Header />
      {children}
    </div>
  );
};

export default SignUpLayout;
