'use client';

import ChatCard from '@/components/view/chat/chat-card';
import Link from 'next/link';
import React from 'react';
import { useChatList } from '@/hooks/react-query/chat/use-get-chat-list';
import Header from '@/components/common-components/header';

const Chat = () => {
  const { data, isLoading, error } = useChatList();

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
          <Link key={item.room_id as string} href={`/chat/${item.room_id}`}>
            <ChatCard
              roomId={item.room_id as string}
              nickname={item.nickname as string}
              message={item.message as string}
              sendAt={item.send_at as string}
              avatarUrl={item.image_url as string}
            />
          </Link>
        ))}
      </div>
    </>
  );
};

export default Chat;
