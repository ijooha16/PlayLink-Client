import Header from '@/components/layout/header';

const CreateMatchLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Header title={'매치 생성하기'} backbtn />
      {children}
    </>
  );
};

export default CreateMatchLayout;
