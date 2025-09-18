import { apiClient } from '@/libs/api/axios';
import { API_URLS } from '@/constant/api-urls';

export const fetchChatList = async () => {
  const { data } = await apiClient.get(API_URLS.CHAT.LIST);
  return data;
};

export const fetchChatRoom = async (id: number) => {
  const { data } = await apiClient.get(API_URLS.CHAT.ROOM(id));
  return data;
};
