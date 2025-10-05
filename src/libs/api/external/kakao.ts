import { externalClient } from '@/libs/http';

const KAKAO_CLIENT_ID = process.env.KAKAO_OAUTH_REST_API_KEY!;
const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET!;
const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI!;

interface KakaoTokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  refresh_token_expires_in: number;
}

interface KakaoAccount {
  email?: string;
  phone_number?: string;
}

interface KakaoProperties {
  nickname?: string;
  profile_image?: string;
  thumbnail_image?: string;
}

interface KakaoUserInfo {
  id: number;
  kakao_account?: KakaoAccount;
  properties?: KakaoProperties;
}

export const KakaoAPI = {
  /**
   * 카카오 인가 코드를 액세스 토큰으로 교환
   */
  getAccessToken: async (code: string): Promise<string> => {
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: KAKAO_CLIENT_ID,
      redirect_uri: KAKAO_REDIRECT_URI,
      code: code,
    });

    if (KAKAO_CLIENT_SECRET) {
      tokenParams.append('client_secret', KAKAO_CLIENT_SECRET);
    }

    const { data } = await externalClient.post<KakaoTokenResponse>(
      'https://kauth.kakao.com/oauth/token',
      tokenParams,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return data.access_token;
  },

  /**
   * 카카오 사용자 정보 가져오기
   */
  getUserInfo: async (accessToken: string): Promise<KakaoUserInfo> => {
    const { data } = await externalClient.get<KakaoUserInfo>(
      'https://kapi.kakao.com/v2/user/me',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return data;
  },

  /**
   * 카카오 프로필 이미지 다운로드
   */
  downloadProfileImage: async (imageUrl: string): Promise<Blob | null> => {
    try {
      const response = await fetch(imageUrl);
      if (response.ok) {
        return await response.blob();
      }
      return null;
    } catch (error) {
      console.error('프로필 이미지 다운로드 실패:', error);
      return null;
    }
  },
};
