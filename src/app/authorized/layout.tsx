import { ReactNode } from 'react';

export default function AuthorizedLayout({
  children,
}: {
  children: ReactNode;
}) {
  // 인증된 사용자용 공통 UI (헤더, 네비게이션 등)
  return (
    <div className="authorized-layout">
      {/* 예: 공통 헤더, 하단 네비게이션 */}
      {children}
    </div>
  );
}