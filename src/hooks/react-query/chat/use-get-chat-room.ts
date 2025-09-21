'use client';

import { QUERY_KEYS } from '@/constant/query-key';
import { fetchChatRoom } from '@/libs/api/chat/chat-list';
import { useQuery } from '@tanstack/react-query';

export const useChatRoom = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHAT_ROOM],
    queryFn: () => fetchChatRoom(id),
  });
};
