import { BackendAuthAPI } from '@/libs/api/backend';
import { KakaoAPI } from '@/libs/api/external';
import { deleteCookie, setAuthCookie } from '@/libs/cookie-utils';
import { normalizePhone } from '@/libs/valid/auth';
import { withApiHandlerRaw } from '@/utills/api-handler';
import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { UAParser } from 'ua-parser-js';
import { z } from 'zod';

// 랜덤 전화번호 생성 (숫자만, 11자리)
const generateRandomPhone = (): string => {
  const uuid = randomUUID().replace(/-/g, '');
  // UUID에서 숫자만 추출
  const digits = uuid.replace(/\D/g, '').substring(0, 8);

  // 8자리가 안되면 랜덤 숫자로 채우기
  const paddedDigits = digits.padEnd(
    8,
    Math.random().toString().substring(2, 10)
  );

  return `010${paddedDigits.substring(0, 8)}`;
};

// 카카오 회원가입 데이터 검증 스키마
const kakaoSignupSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
  passwordCheck: z.string().min(1, '비밀번호 확인을 입력해주세요'),
  phoneNumber: z
    .string()
    .regex(/^01[016789]\d{8}$/, '올바른 전화번호 형식이 아닙니다'),
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

  try {
    // 카카오 액세스 토큰 가져오기
    const accessToken = await KakaoAPI.getAccessToken(code);

    // 카카오 사용자 정보 가져오기
    const kakaoUserInfo = await KakaoAPI.getUserInfo(accessToken);

    const email = kakaoUserInfo.kakao_account?.email || '';
    const name = kakaoUserInfo.properties?.nickname || '카카오사용자';
    const rawPhoneNumber =
      kakaoUserInfo.kakao_account?.phone_number || generateRandomPhone();
    const phoneNumber = normalizePhone(rawPhoneNumber);

    // 카카오 프로필 이미지 가져오기
    const profileImageUrl =
      kakaoUserInfo.properties?.profile_image ||
      kakaoUserInfo.properties?.thumbnail_image;
    const profileImageBlob = profileImageUrl
      ? await KakaoAPI.downloadProfileImage(profileImageUrl)
      : null;

    // 프로필 이미지를 base64로 변환 (프론트엔드 전달용)
    let profileImageBase64 = null;
    if (profileImageBlob) {
      const buffer = await profileImageBlob.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      profileImageBase64 = `data:image/jpeg;base64,${base64}`;
    }

    // OAuth state 쿠키 삭제
    let response = NextResponse.json({
      success: true,
      data: {
        email,
        name,
        phoneNumber,
        profileImage: profileImageBase64,
      },
    });

    response = deleteCookie(response, 'kakao_oauth_state');
    return response;
  } catch (error) {
    console.error('=== 카카오 OAuth 처리 실패 ===');
    console.error('Error:', error);

    return NextResponse.json(
      { error: '카카오 인증 처리에 실패했습니다.' },
      { status: 500 }
    );
  }
});
