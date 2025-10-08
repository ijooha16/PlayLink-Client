import { API_URLS } from '@/constant/api-urls';
import { apiClient } from '@/libs/http';

export type CheckNicknameResponse = {
  status: 'success' | 'error';
  errCode?: number | null;
  message?: string;
  data?: {
    isDuplicate?: number;
  } | null;
};

export const checkNicknameDuplicate = async (
  nickname: string
): Promise<CheckNicknameResponse> => {
  const { data } = await apiClient.post<CheckNicknameResponse>(
    API_URLS.AUTH.CHECK_NICKNAME,
    { nickname }
  );
  return data;
};
