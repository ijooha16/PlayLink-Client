'use server';

type HandleSignUpTestVariable = {
  payload: {
    name: string;
    nickname: string;
    email: string;
    password: string;
    passwordCheck: string;
    phoneNumber: string;
    platform: string;
    ip: string;
    device_id: string;
    device_type: string;
    prefer_sports: Number[];
  };
};

export async function handleSignupTest({ payload }: HandleSignUpTestVariable) {
  // 실제 백엔드 URL은 환경 변수로 관리하는 것이 좋습니다.
  // 예: process.env.DB_URL
  const backendApiUrl = `${process.env.NEXT_PUBLIC_DB_URL}/playlink/signup`; // 실제 백엔드 URL로 변경 필요

  try {
    const req = await fetch(backendApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
    const res = await req.json();
    console.log('API Signup Response from Server Action:', res);
    return res; // 클라이언트로 결과 반환
  } catch (error) {
    console.error('Error calling backend from Server Action:', error);
    return { status: 'error', message: 'Failed to connect to backend.' };
  }
}
