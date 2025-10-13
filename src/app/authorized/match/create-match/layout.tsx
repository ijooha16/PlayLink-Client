import Header from '@/components/layout/header';
import MatchLayoutContainer from '@/components/layout/match-layout';
import ProgressBar from '@/components/ui/progress-bar';
import { PATHS } from '@/constant';

const CreateMatchLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const steps = [
    { key: 'type', path: PATHS.MATCH.CREATE_MATCH + '/type' },
    { key: 'sports', path: PATHS.MATCH.CREATE_MATCH + '/sports' },
    { key: 'create', path: PATHS.MATCH.CREATE_MATCH + '/create' },
    { key: 'description', path: PATHS.MATCH.CREATE_MATCH + '/description' },
  ];

  return (
    <>
      <Header title={'모임 만들기'} backbtn />
      <ProgressBar steps={steps} />
      <MatchLayoutContainer flowType='create-match'>
        {children}
      </MatchLayoutContainer>
    </>
  );
};

export default CreateMatchLayout;
