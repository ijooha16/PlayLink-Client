'use client';

import { Input } from '@/components/forms/input';
import TextArea from '@/components/forms/textarea';
import { Camera } from '@/components/shared/icons';
import Button from '@/components/ui/button';
import { PATHS } from '@/constant';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CreateMatchDescription = () => {
  const router = useRouter();
  const [matchName, setMatchName] = useState('');
  const [description, setDescription] = useState('');

  const handleNext = () => {
    if (!matchName.trim() || !description.trim()) return;
    // TODO: Store에 저장 및 API 호출
    router.replace(PATHS.HOME);
  };

  return (
    <>
      <div className='flex flex-col gap-s-16 pb-[80px]'>
        <div className='border-line-neutral relative flex h-[80px] w-[80px] items-center justify-center rounded-8 border'>
          <Image
            src='/images/sport-svg-icons/sport=1_Ic_Soccer.svg'
            alt='Soccer'
            width={40}
            height={40}
            className='object-contain'
          />
          {/* 카메라 아이콘 - 우측 하단 border에 걸침 */}
          <div className='bg-bg-neutral absolute -bottom-2 -right-2 flex h-[32px] w-[32px] items-center justify-center rounded-full'>
            <Camera size={20} className='text-icon-strong' />
          </div>
        </div>

        {/* 모임명 Input */}
        <Input
          label='모임명'
          value={matchName}
          onChange={(e) => setMatchName(e.target.value)}
          placeholder='이름을 입력해 주세요. (5글자 이상)'
        />

        {/* 주제 TextArea */}
        <TextArea
          label='주제'
          value={description}
          onChange={(value) => setDescription(value)}
          placeholder='메시지를 입력해 주세요.'
          maxLength={2000}
          showCharCount
        />
        <div className='bg-bg-neutral flex flex-col gap-s-8 rounded-12 p-s-20'>
          <p className='text-body-02 font-semibold text-text-strong'>
            모임설명 작성 Tip
          </p>
          <p className='font-regular text-body-02 text-text-alternative'>
            - 호스트를 간단히 소개해보세요.
            <br className='mb-s-4' />
            - 어떤 활동을 하는 모임인지 알려주세요.
            <br className='mb-s-4' />
            - 모임의 목적이나 분위기를 알려주세요.
            <br className='mb-s-4' />
            (예: 실력향상, 친목)
            <br className='mb-s-4' />
            - 예상 비용, 사전 준비등이 있으면 알려주세요.
            <br className='mb-s-4' />
          </p>
        </div>
      </div>

      <Button
        variant='default'
        disabled={!matchName.trim() || !description.trim()}
        onClick={handleNext}
        isFloat
      >
        완료
      </Button>
    </>
  );
};

export default CreateMatchDescription;
