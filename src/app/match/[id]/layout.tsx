import Header from '@/components/common-components/header';

const DetailLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='h-full w-full'>
      <Header title='' backbtn />
      {children}
    </div>
  );
};

export default DetailLayout;
