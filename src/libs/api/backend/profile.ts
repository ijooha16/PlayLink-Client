import { backendClient } from '@/libs/http';

export const BackendProfileAPI = {
  /**
   * 프로필 조회
   */
  getProfile: async () => {
    const response = await backendClient.get('/playlink/profile');
    return response;
  },

  /**
   * 프로필 수정
   */
  updateProfile: async (formData: FormData) => {
    const response = await backendClient.put('/playlink/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },
};
