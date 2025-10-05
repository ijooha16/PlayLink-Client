import { apiClient } from '@/libs/http';
import { useAuthStore } from '@/store/auth-store';

/**
 * Profile API 모듈
 * 프로필 관련 API 요청을 관리합니다.
 */
export const Profile = {
  /**
   * 사용자 프로필 정보를 조회합니다.
   */
  Get: async () => {
    const token = useAuthStore.getState().token;
    const { data } = await apiClient.get('/api/profile', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return data;
  },

  /**
   * 사용자 프로필 정보를 업데이트합니다.
   * @param formData FormData 형태의 프로필 업데이트 데이터
   */
  Post: async (formData: FormData) => {
    const token = useAuthStore.getState().token;

    const { data } = await apiClient.post('/api/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    return data;
  },
};
