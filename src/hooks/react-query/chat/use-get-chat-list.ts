'use client';

import { QUERY_KEYS } from '@/constant/query-key';
import { fetchChatList } from '@/libs/api/frontend/chat/chat-list';
import { useQuery } from '@tanstack/react-query';

export const useChatList = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHAT_LOG],
    queryFn: fetchChatList,
  });
};
