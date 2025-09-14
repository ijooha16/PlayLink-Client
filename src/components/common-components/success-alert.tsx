'use client';

import '@/styles/check.css';
import { useAlertStore } from '@/stores/alert-store';

const SuccessAlert = () => {
  const title = useAlertStore((state) => state.title);
  const content = useAlertStore((state) => state.content);

  return (
    <div className='fixed left-0 top-0 z-[9999] flex h-dvh w-dvw flex-col place-content-center bg-gradient-to-br from-blue-500 to-blue-700 text-white'>
      <div className=''>
        <svg
          className='checkmark'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 52 52'
        >
          <circle
            className='checkmark__circle'
            cx='26'
            cy='26'
            r='25'
            fill='none'
          />
          <path
            className='checkmark__check'
            fill='none'
            d='M14.1 27.2l7.1 7.2 16.7-16.8'
          />
        </svg>
        <div className='mx-auto flex flex-col justify-center break-keep text-center'>
          <h1 className='text-xl font-bold'>{title}</h1>
          <span className='text-md mt-6 font-medium'>{content}</span>
        </div>
      </div>
    </div>
  );
};

export default SuccessAlert;
