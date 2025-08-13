
'use client';

import { uploadImage } from '@/actions/upload';
import { useState } from 'react';

export default function UploadTestPage() {
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('Uploading...');

    const formData = new FormData(event.currentTarget);
    const result = await uploadImage(formData);

    if (result.status === 'success') {
      setMessage(`Success: ${result.message}`);
    } else {
      setMessage(`Error: ${result.message}`);
    }
  };

  return (
    <div>
      <h1 className='mb-4 text-2xl font-bold'>이미지 업로드 테스트</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div>
          <label
            htmlFor='imageFile'
            className='block text-sm font-medium text-gray-700'
          >
            이미지 파일 선택:
          </label>
          <input
            type='file'
            id='imageFile'
            name='imageFile'
            accept='image/*'
            required
            className='mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100'
          />
        </div>
        <div>
          <label
            htmlFor='description'
            className='block text-sm font-medium text-gray-700'
          >
            설명 (선택 사항):
          </label>
          <input
            type='text'
            id='description'
            name='description'
            className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm'
            placeholder='이미지에 대한 설명을 입력하세요'
          />
        </div>
        <button
          type='submit'
          className='w-full rounded-lg bg-blue-600 py-2 text-lg font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        >
          업로드
        </button>
      </form>
      {message && <p className='mt-4 text-center text-lg'>{message}</p>}
    </div>
  );
}
