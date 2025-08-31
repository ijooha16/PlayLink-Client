import Header from '@/shares/common-components/header';

const CreateMatchLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='h-full w-full'>
      <Header title={'매치 생성하기'} backbtn />
      {children}
    </div>
  );
};

export default CreateMatchLayout;
