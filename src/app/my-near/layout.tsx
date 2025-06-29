import CommonHeader from '@/shares/common-components/common-header';

const MyNearLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='h-full w-full'>
      <CommonHeader title={'내 동네 설정'} />
      {children}
    </div>
  );
};

export default MyNearLayout;
