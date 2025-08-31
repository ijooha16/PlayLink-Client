'use client';

import ChatCard from '@/features/play-link/view/chat/chat-card';
import Header from '@/shares/common-components/header';
import Link from 'next/link';
import React from 'react';
import { useChatList } from '@/hooks/chat/use-get-chat-list';

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
        {data.data.data.lastChatList.map((item: any) => (
          <Link key={item.room_id} href={`/chat/${item.room_id}`}>
            <ChatCard
              roomId={item.room_id}
              nickname={item.nickname}
              message={item.message}
              sendAt={item.send_at}
              avatarUrl={item.image_url}
            />
          </Link>
        ))}
      </div>
    </>
  );
};

export default Chat;
