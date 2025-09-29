import Header from '@/components/layout/header';

const MyNearLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='h-full w-full'>
      <Header title='내 동네 설정' backbtn />
      {children}
    </div>
  );
};

export default MyNearLayout;
