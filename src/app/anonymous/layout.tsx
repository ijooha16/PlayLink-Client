import { ReactNode } from 'react';

export default function AnonymousLayout({
  children,
}: {
  children: ReactNode;
}) {
  // 비인증 사용자용 공통 UI
  return (
    <div className="anonymous-layout">
      {/* 예: 로그인/회원가입 공통 헤더 */}
      {children}
    </div>
  );
}