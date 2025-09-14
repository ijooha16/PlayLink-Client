import { apiClient } from '@/services/axios';

export const fetchChatList = async () => {
  const { data } = await apiClient.get('/api/chatlist');
  return data;
};

export const fetchChatRoom = async (id: number) => {
  const { data } = await apiClient.get(`/api/chatlist/${id}`);
  return data;
};
