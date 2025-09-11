'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchChatRoom } from '@/services/chat/chat-list';
import { QUERY_KEYS } from '@/shares/constant/query-key';

export const useChatRoom = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHAT_ROOM],
    queryFn: () => fetchChatRoom(id),
  });
};
