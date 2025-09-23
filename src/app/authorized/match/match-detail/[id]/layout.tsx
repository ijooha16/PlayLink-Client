import Header from '@/components/layout/header';

const DetailLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Header title='' backbtn transparent />
      {children}
    </>
  );
};

export default DetailLayout;
