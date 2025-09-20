import Header from "@/components/layout/header";

const FindIdLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Header title='아이디 찾기' backbtn />
      {children}
    </>
  );
};

export default FindIdLayout;
