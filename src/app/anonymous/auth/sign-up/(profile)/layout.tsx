import SignUpProgressBar from '@/components/signup/SignUpProgressBar';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SignUpProgressBar />
      {children}
    </div>
  );
}