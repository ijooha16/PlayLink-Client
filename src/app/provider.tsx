import GlobalModal from '@/components/feedback/global-modal';
import { AuthProvider } from '@/providers/auth-provider';
import { QueryProvider } from '@/providers/query-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
        <GlobalModal />
      </AuthProvider>
    </QueryProvider>
  );
}
