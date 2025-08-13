'use client';

import ChatBox from '@/features/play-link/view/chat/chat-box';
import { Plus, Send } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const ChatRoom = () => {
  const params = useParams();
  const { id } = params;

  return (
    <div>
      <div className='flex flex-col gap-4'>
        <ChatBox isMyChat />
        <ChatBox isMyChat={false} />
        <div className='flex items-center justify-between gap-3 py-2'>
          <span className='h-[1px] w-full bg-gray-200' />
          <span className='whitespace-nowrap text-xs'>2025년 12월 4일</span>
          <span className='h-[1px] w-full bg-gray-200' />
        </div>
      </div>
      <div className='h-20' />
      <div className='fixed bottom-0 left-0 flex h-20 w-full items-center justify-between gap-4 border-t bg-white p-4'>
        <Plus />
        <input
          type='text'
          placeholder='메시지를 입력하세요...'
          className='flex-1 rounded-full border border-gray-300 px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <Send />
      </div>
    </div>
  );
};

export default ChatRoom;
