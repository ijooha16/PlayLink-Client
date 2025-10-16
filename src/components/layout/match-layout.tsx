'use client';

import { PATHS } from '@/constant';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const CREATE_MATCH_FLOW: Array<{
  key: string;
  path: string;
  title: string;
  content?: string;
}> = [
  {
    key: 'type',
    path: PATHS.MATCH.CREATE_MATCH + '/type',
    title: '어떤 모임을 만들까요?',
  },
  {
    key: 'sports',
    path: PATHS.MATCH.CREATE_MATCH + '/sports',
    title: '운동 종목을 선택해주세요',
  },
  {
    key: 'create',
    path: PATHS.MATCH.CREATE_MATCH + '/create',
    title: '원하는 모임을 알려주세요',
  },
  {
    key: 'description',
    path: PATHS.MATCH.CREATE_MATCH + '/description',
    title: '모임을 소개해주세요',
  },
];

interface MatchLayoutContainerProps {
  children: ReactNode;
  flowType?: 'create-match';
  title?: string;
  content?: string | null;
}

const MatchLayoutContainer = ({
  children,
  flowType,
  title: propTitle,
  content: propContent,
}: MatchLayoutContainerProps) => {
  const pathname = usePathname();

  let title = propTitle || '';
  let content = propContent || '';

  if (flowType === 'create-match' && !propTitle && !propContent) {
    const currentStep = CREATE_MATCH_FLOW.find(
      (step) => step.path === pathname
    );
    title = currentStep?.title || '';
    content = currentStep?.content || '';
  }

  return (
    <div className='flex flex-col'>
      <h1 className='whitespace-pre-line text-[20px] font-semibold'>{title}</h1>
      {content && (
        <p className='font-regular text-text-neutral whitespace-pre-line pt-s-4 text-body-02'>
          {content}
        </p>
      )}
      <div className='mt-s-24'>{children}</div>
    </div>
  );
};

export default MatchLayoutContainer;
