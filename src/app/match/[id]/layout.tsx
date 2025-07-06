import CommonHeader from '@/shares/common-components/common-header';

const DetailLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='h-full w-full'>
      <CommonHeader title={''} />
      {children}
    </div>
  );
};

export default DetailLayout;
