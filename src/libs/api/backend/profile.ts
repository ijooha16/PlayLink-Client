import { backendClient } from '@/libs/http';

export const BackendProfileAPI = {
  /**
   * 프로필 조회
   */
  getProfile: async (token?: string) => {
    const response = await backendClient.get('/playlink/profile', {
      headers: {
        ...(token && { Authorization: token }),
      },
    });
    return response;
  },

  /**
   * 프로필 수정
   */
  updateProfile: async (formData: FormData, token?: string) => {
    const response = await backendClient.put('/playlink/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token && { Authorization: token }),
      },
    });
    return response;
  },
};
