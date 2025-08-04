
'use server';

const payload = {
  name: 1,
  email: 2,
  password: 1234,
  phoneNumber: 1011001,
  address: 1,
  platform: 3,
  reg_ip: 4,
  reg_device: 5,
};

export async function handleSignupTest() {
  // 실제 백엔드 URL은 환경 변수로 관리하는 것이 좋습니다.
  // 예: process.env.DB_URL
  const backendApiUrl = 'YOUR_BACKEND_API_BASE_URL/playlink/match'; // 실제 백엔드 URL로 변경 필요

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
