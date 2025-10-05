import { KakaoAPI } from '@/libs/api/external';
import { BackendAuthAPI } from '@/libs/api/backend';
import { normalizePhone } from '@/libs/valid/auth';
import { setAuthCookie, deleteCookie } from '@/libs/cookie-utils';
import { withApiHandlerRaw } from '@/utills/api-handler';
import { NextResponse } from 'next/server';
import { UAParser } from 'ua-parser-js';
import { z } from 'zod';
import { randomUUID } from 'crypto';

// 랜덤 전화번호 생성 (숫자만, 11자리)
const generateRandomPhone = (): string => {
  const uuid = randomUUID().replace(/-/g, '');
  // UUID에서 숫자만 추출
  const digits = uuid.replace(/\D/g, '').substring(0, 8);

  // 8자리가 안되면 랜덤 숫자로 채우기
  const paddedDigits = digits.padEnd(8, Math.random().toString().substring(2, 10));

  return `010${paddedDigits.substring(0, 8)}`;
};

// 카카오 회원가입 데이터 검증 스키마
const kakaoSignupSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
  passwordCheck: z.string().min(1, '비밀번호 확인을 입력해주세요'),
  phoneNumber: z.string().regex(/^01[016789]\d{8}$/, '올바른 전화번호 형식이 아닙니다'),
  platform: z.string().min(1, '플랫폼 정보가 필요합니다'),
  device_id: z.string().min(1, '디바이스 ID가 필요합니다'),
  device_type: z.enum(['computer', 'mobile', 'tablet', 'unknown']),
  account_type: z.string(),
});

// 서버사이드에서 디바이스 정보 가져오기
const getDeviceInfoServer = (userAgent: string) => {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  let deviceType: 'computer' | 'mobile' | 'tablet' | 'unknown' = 'unknown';
  const type = result.device.type;

  if (type === 'mobile') {
    deviceType = 'mobile';
  } else if (type === 'tablet') {
    deviceType = 'tablet';
  } else if (!type) {
    deviceType = 'computer';
  }

  const browserName = result.browser.name || 'Unknown Browser';
  const osName = result.os.name || 'Unknown OS';
  const platform = `${browserName} on ${osName}`;

  // 서버사이드이므로 임시 deviceId 생성
  const deviceId = `kakao-${deviceType}-${Date.now()}`;

  return {
    deviceId,
    deviceType,
    platform,
  };
};

export const POST = withApiHandlerRaw(async (request) => {
  const body = await request.json();
  const { code, state } = body;

  if (!code) {
    console.error('인가 코드가 없습니다');
    return NextResponse.json(
      { error: '인가 코드가 없습니다.' },
      { status: 400 }
    );
  }

  // OAuth state 검증 (CSRF 방지)
  const savedState = request.cookies.get('kakao_oauth_state')?.value;
  if (!savedState || savedState !== state) {
    console.error('OAuth state 불일치');
    return NextResponse.json(
      { error: 'OAuth state 검증 실패' },
      { status: 400 }
    );
  }

  // 카카오 액세스 토큰 가져오기
  const accessToken = await KakaoAPI.getAccessToken(code);

  // 카카오 사용자 정보 가져오기
  const kakaoUserInfo = await KakaoAPI.getUserInfo(accessToken);

  // 디바이스 정보 가져오기
  const userAgent = request.headers.get('user-agent') || '';
  const deviceInfo = getDeviceInfoServer(userAgent);

  // FormData 생성 (signup route 재사용)
  const formData = new FormData();

  const email = kakaoUserInfo.kakao_account?.email || '';
  const name = kakaoUserInfo.properties?.nickname || '카카오사용자';
  const rawPhoneNumber = kakaoUserInfo.kakao_account?.phone_number || generateRandomPhone();
  const phoneNumber = normalizePhone(rawPhoneNumber); // 숫자만 추출

  // 카카오 프로필 이미지 가져오기
  const profileImageUrl = kakaoUserInfo.properties?.profile_image || kakaoUserInfo.properties?.thumbnail_image;
  const profileImageBlob = profileImageUrl
    ? await KakaoAPI.downloadProfileImage(profileImageUrl)
    : null;

  if (profileImageBlob) {
    console.log('카카오 프로필 이미지 다운로드 성공');
  }

  // 회원가입 데이터 검증
  const signupData = {
    name,
    email,
    password: '1q2w3e4r!',
    passwordCheck: '1q2w3e4r!',
    phoneNumber,
    platform: deviceInfo.platform,
    device_id: deviceInfo.deviceId,
    device_type: deviceInfo.deviceType,
    account_type: '1',
  };

  const validation = kakaoSignupSchema.safeParse(signupData);
  if (!validation.success) {
    console.error('카카오 회원가입 데이터 검증 실패:', validation.error.errors);
    return NextResponse.json(
      { error: validation.error.errors[0].message },
      { status: 400 }
    );
  }

  // 필수 필드
  formData.append('name', name);
  formData.append('email', email);
  formData.append('password', '1q2w3e4r!');
  formData.append('passwordCheck', '1q2w3e4r!');
  formData.append('phoneNumber', phoneNumber);
  formData.append('platform', deviceInfo.platform);
  formData.append('device_id', deviceInfo.deviceId);
  formData.append('device_type', deviceInfo.deviceType);
  formData.append('account_type', '1'); // 1: 카카오

  // 프로필 이미지 추가 (있는 경우)
  if (profileImageBlob) {
    formData.append('profileImg', profileImageBlob, 'profile.jpg');
  }

  // 로그인 페이로드
  const loginPayload = {
    email,
    password: '1q2w3e4r!',
    device_id: deviceInfo.deviceId,
  };

  try {
    // 1. 먼저 로그인 시도
    console.log('=== 카카오 로그인 시도 ===');
    const loginResponse = await BackendAuthAPI.login(loginPayload);

    console.log('로그인 성공:', loginResponse.data);

    // 로그인 성공 시 토큰과 쿠키 설정
    const accessToken = loginResponse.headers.authorization;
    let response = NextResponse.json({
      success: true,
      data: loginResponse.data,
    });

    if (accessToken) {
      response = setAuthCookie(response, accessToken, {
        maxAge: 60 * 60 * 24 * 7, // 7일
      });
    }

    // OAuth state 쿠키 삭제
    response = deleteCookie(response, 'kakao_oauth_state');

    return response;
  } catch (loginError) {
    console.log('로그인 실패, 회원가입 시도');

    // 2. 로그인 실패 시 회원가입 시도
    console.log('=== Kakao Signup FormData ===');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    console.log('============================');

    try {
      const { data } = await BackendAuthAPI.signup(formData);

      console.log('회원가입 성공, 자동 로그인 진행');

      // 3. 회원가입 성공 후 자동 로그인
      const loginResponse = await BackendAuthAPI.login(loginPayload);

      const accessToken = loginResponse.headers.authorization;
      let response = NextResponse.json({
        success: true,
        data: loginResponse.data,
      });

      if (accessToken) {
        response = setAuthCookie(response, accessToken, {
          maxAge: 60 * 60 * 24 * 7, // 7일
        });
      }

      // OAuth state 쿠키 삭제
      response = deleteCookie(response, 'kakao_oauth_state');

      return response;
    } catch (signupError) {
      console.error('=== Kakao Signup Error ===');
      if (signupError instanceof Error) {
        console.error('Error Message:', signupError.message);
      }
      if (typeof signupError === 'object' && signupError !== null && 'response' in signupError) {
        const axiosError = signupError as {
          response?: { status?: number; statusText?: string; data?: unknown };
        };
        console.error('Status:', axiosError.response?.status);
        console.error('Error Data:', JSON.stringify(axiosError.response?.data, null, 2));
      }
      console.error('========================');

      return NextResponse.json(
        { error: '카카오 회원가입에 실패했습니다.' },
        { status: 500 }
      );
    }
  }
});
