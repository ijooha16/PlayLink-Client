import ChatCard from '@/features/play-link/view/chat/chat-card';
import Header from '@/shares/common-components/header';
import React from 'react';

const Chat = () => {
  return (
    <>
      <Header title='채팅' backbtn={true}/>
      <div>
        <ChatCard/>
        <ChatCard/>
        <ChatCard/>
        <ChatCard/>
        <ChatCard/>
      </div>
    </>
  );
};

export default Chat;
