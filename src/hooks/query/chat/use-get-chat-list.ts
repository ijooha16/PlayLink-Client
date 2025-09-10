'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchChatList } from '@/services/chat/chat-list';
import { QUERY_KEYS } from '@/shares/constant/query-key';

export const useChatList = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHAT_LOG],
    queryFn: fetchChatList,
  });
};
