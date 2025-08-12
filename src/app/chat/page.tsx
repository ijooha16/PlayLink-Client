

import ChatCard from '@/features/play-link/view/chat/chat-card';
import Header from '@/shares/common-components/header';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

const Chat = () => {


  return (
    <>
      <Header title='채팅' />
      <div>
        <Link href={`/chat/1`}>
          <ChatCard />
        </Link>
        <ChatCard />
        <ChatCard />
        <ChatCard />
        <ChatCard />
      </div>
    </>
  );
};

export default Chat;
