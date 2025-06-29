import CommonHeader from '@/shares/common-components/common-header';

const CreateMatchLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='h-full w-full'>
      <CommonHeader title={'매치 생성하기'} />
      {children}
    </div>
  );
};

export default CreateMatchLayout;
