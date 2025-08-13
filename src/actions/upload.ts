
'use server';

import { NextResponse } from 'next/server';

export async function uploadImage(formData: FormData) {
  const file = formData.get('imageFile') as File | null;
  const description = formData.get('description') as string | null;

  if (!file) {
    return { status: 'error', message: 'No file uploaded.' };
  }

  // 파일 정보 로깅 (서버 콘솔에 출력됨)
  console.log('Received file:', file.name, file.type, file.size);
  console.log('Description:', description);

  // 실제 백엔드에 파일을 전송하는 로직 (예시)
  // const backendApiUrl = 'YOUR_BACKEND_API_BASE_URL/upload';
  // const response = await fetch(backendApiUrl, {
  //   method: 'POST',
  //   body: formData, // FormData를 그대로 전달
  // });

  // if (!response.ok) {
  //   const errorData = await response.json();
  //   return { status: 'error', message: errorData.message || 'Backend upload failed.' };
  // }

  // const result = await response.json();
  // return { status: 'success', data: result };

  // 현재는 파일 처리 없이 성공 응답만 반환
  return { status: 'success', message: `File ${file.name} uploaded successfully!` };
}
