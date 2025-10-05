'use client';

import Button from '@/components/ui/button';
import { PATHS } from '@/constant';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CreateMatchDescription = () => {
  const router = useRouter();
  const [description, setDescription] = useState('');

  const handleNext = () => {
    if (!description.trim()) return;
    // TODO: Store에 저장 및 API 호출
    router.replace(PATHS.HOME);
  };

  return (
    <>
      <div className='flex flex-col gap-s-16 pb-[80px]'>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className='h-[200px] w-full resize-none rounded-lg border border-border-netural bg-white px-4 py-3 text-body-m text-text-strong placeholder-text-alternative focus:border-brand-primary focus:outline-none'
          placeholder='이 모임을 어떻게 즐기고자 하는지 설명해주세요.&#10;모임에 대해 궁금해하는 사람들을 위해 자세히 소개해주세요.'
        />
        <p className='text-body-s text-text-alternative'>
          {description.length} / 500자
        </p>
      </div>

      <Button
        variant='default'
        disabled={!description.trim()}
        onClick={handleNext}
        isFloat
      >
        완료
      </Button>
    </>
  );
};

export default CreateMatchDescription;
