'use client';

import { Input } from '@/components/forms/input';
import TextArea from '@/components/forms/textarea';
import { Camera } from '@/components/shared/icons';
import Button from '@/components/ui/button';
import { PATHS } from '@/constant';
import { useAddMatchMutation } from '@/hooks/react-query/match/use-add-match-mutation';
import { validateContents, validateTitle } from '@/libs/valid/match';
import useCreateMatchStore from '@/store/use-create-match-store';
import { toast } from '@/utills/toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CreateMatchDescription = () => {
  const router = useRouter();
  const { updateDescription, getApiPayload, reset } = useCreateMatchStore();
  const { mutate: createMatch, isPending } = useAddMatchMutation();

  const [matchName, setMatchName] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [titleError, setTitleError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMatchNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMatchName(value);
    if (value.trim()) {
      const error = validateTitle(value);
      setTitleError(error);
    } else {
      setTitleError('');
    }
  };

  const handleNext = () => {
    // 제목 검증
    const titleError = validateTitle(matchName);
    if (titleError) {
      setTitleError(titleError);
      return;
    }

    // 내용 검증
    const contentsError = validateContents(description);
    if (contentsError) {
      toast.error(contentsError);
      return;
    }

    // Store에 description 저장
    updateDescription(matchName.trim(), description.trim());

    // FormData 생성
    const formData = new FormData();
    const apiPayload = getApiPayload();

    // API payload의 모든 필드를 FormData에 추가
    Object.entries(apiPayload).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    // 이미지 파일이 있으면 추가
    if (imageFile) {
      formData.append('img', imageFile);
    }

    createMatch(formData, {
      onSuccess: () => {
        toast.success('매치가 성공적으로 생성되었습니다!');
        reset();
        router.replace(PATHS.HOME);
      },
      onError: (error) => {
        console.error('매치 생성 실패:', error);
        toast.error('매치 생성에 실패했습니다. 다시 시도해주세요.');
      },
    });
  };

  return (
    <>
      <div className='flex flex-col gap-s-16 pb-[80px]'>
        <div className='relative h-[80px] w-[80px]'>
          <label
            htmlFor='match-image'
            className='flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-8 border border-line-neutral bg-white'
          >
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt='Match thumbnail'
                fill
                className='object-cover'
                unoptimized
              />
            ) : (
              <Image
                src='/images/sport-svg-icons/sport=1_Ic_Soccer.svg'
                alt='Default'
                width={40}
                height={40}
                className='object-contain'
              />
            )}
          </label>
          {/* 카메라 아이콘 - 우측 하단 border에 걸침 */}
          <div className='pointer-events-none absolute -bottom-2 -right-2 flex h-[32px] w-[32px] items-center justify-center rounded-full bg-bg-neutral'>
            <Camera size={20} className='text-icon-strong' />
          </div>
          <input
            id='match-image'
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            className='hidden'
          />
        </div>

        {/* 모임명 Input */}
        <Input
          label='모임 제목'
          value={matchName}
          onChange={handleMatchNameChange}
          placeholder='모임 제목을 입력해 주세요.'
          hasError={!!titleError}
          errorMessage={titleError}
        />

        {/* 주제 TextArea */}
        <TextArea
          label='모임 설명'
          value={description}
          onChange={(value) => setDescription(value)}
          placeholder='모임 설명을 입력해주세요.'
          maxLength={2000}
          showCharCount
        />
        <div className='flex flex-col gap-s-8 rounded-12 bg-bg-neutral p-s-20'>
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
        disabled={!matchName.trim() || !description.trim() || isPending || !!titleError}
        onClick={handleNext}
        isFloat
      >
        {isPending ? '생성 중...' : '완료'}
      </Button>
    </>
  );
};

export default CreateMatchDescription;
