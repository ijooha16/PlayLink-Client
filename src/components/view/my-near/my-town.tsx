'use client';

import { useAlertStore } from '@/shares/stores/alert-store';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

type MyTownProps = { myList: string[] };

const MyTown = ({ myList }: MyTownProps) => {
  const openAlert = useAlertStore((state) => state.openAlert);
  const router = useRouter();
  
  switch (myList?.length) {
    case 0:
      return (
        <div className='mt-2 flex flex-nowrap gap-4'>
          <button
            onClick={() => {
              openAlert(
                '동네 설정이 완료 되었습니다.',
                '강남구 위주로 매칭을 찾아볼게요!'
              );
              router.replace('/');
            }}
            className='flex h-12 w-full place-items-center justify-center gap-2 rounded-lg bg-gray-200'
          >
            <PlusIcon /> 동네 추가하기
          </button>
        </div>
      );

    case 1:
      return <div>1개</div>;

    case 2:
      return <div>2개</div>;
    default:
      return <div>에러</div>;
  }
};

export default MyTown;
