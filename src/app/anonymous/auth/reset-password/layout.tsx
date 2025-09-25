import Header from '@/components/layout/header';
import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header title='비밀번호 재설정' backbtn />
      {children}
    </>
  );
};

export default Layout;
