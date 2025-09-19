'use client';

import ChatCard from '@/components/features/chat/chat-card';
import Link from 'next/link';
import React from 'react';
import { useChatList } from '@/hooks/react-query/chat/use-get-chat-list';
import Header from '@/components/layout/header';
import { useRouter } from 'next/navigation';

const Chat = () => {
  const router = useRouter();
  const { data, isLoading, error } = useChatList();

  const handleChatClick = (roomId: string) => {
    router.push(`/chat/${roomId}`);
  };

  if (isLoading)
    return (
      <>
        <Header title='채팅' />
        <div className='p-4'>불러오는 중…</div>
      </>
    );
  if (error)
    return (
      <>
        <Header title='채팅' />
        <div className='p-4 text-red-500'>에러가 발생했어요.</div>
      </>
    );

  return (
    <>
      <Header title='채팅' />
      <div>
        {data.data.data.lastChatList.map((item: Record<string, unknown>) => (
          <div
            key={item.room_id as string}
            onClick={() => handleChatClick(item.room_id as string)}
            className="cursor-pointer"
          >
            <ChatCard
              roomId={item.room_id as string}
              nickname={item.nickname as string}
              message={item.message as string}
              sendAt={item.send_at as string}
              avatarUrl={item.image_url as string}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Chat;
