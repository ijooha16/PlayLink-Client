import Header from '@/shares/common-components/header';

export default function EmailLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header title={'이메일로 시작하기'} backbtn={true} />
      <main className="">{children}</main>
    </>
  );
}