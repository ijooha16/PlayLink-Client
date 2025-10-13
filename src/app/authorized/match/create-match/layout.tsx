'use client';

import Header from '@/components/layout/header';
import MatchLayoutContainer from '@/components/layout/match-layout';
import ProgressBar from '@/components/ui/progress-bar';
import { PATHS } from '@/constant';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

const CreateMatchLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const pathname = usePathname();

  const steps = [
    { key: 'type', path: PATHS.MATCH.CREATE_MATCH + '/type' },
    { key: 'sports', path: PATHS.MATCH.CREATE_MATCH + '/sports' },
    { key: 'create', path: PATHS.MATCH.CREATE_MATCH + '/create' },
    { key: 'description', path: PATHS.MATCH.CREATE_MATCH + '/description' },
  ];

  const currentIndex = steps.findIndex((step) =>
    pathname.startsWith(step.path)
  );

  // 이전 스텝 계산
  const prevStep = currentIndex > 0 ? steps[currentIndex - 1].path : PATHS.HOME;

  const handleBack = () => {
    router.push(prevStep);
  };

  return (
    <>
      <Header title={'모임 만들기'} backbtn onBack={handleBack} />
      <ProgressBar steps={steps} />
      <MatchLayoutContainer flowType='create-match'>
        {children}
      </MatchLayoutContainer>
    </>
  );
};

export default CreateMatchLayout;
