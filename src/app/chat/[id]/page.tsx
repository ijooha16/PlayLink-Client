'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { Plus, Send } from 'lucide-react';

import ChatBox from '@/features/play-link/view/chat/chat-box';
import { useChatRoom } from '@/hooks/react-query/chat/use-get-chat-room';
import { handleGetSessionStorage } from '@/shares/libs/utills/web-api';

type ChatMessage = {
  id: string;
  text: string;
  isMyChat: boolean;
  nickname?: string;
  createdAt: string;
};

export default function ChatRoom() {
  const params = useParams<{ id: string }>();
  const roomId = Number(params?.id);

  const { data, isLoading, error } = useChatRoom(roomId);

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const env_api = process.env.NEXT_PUBLIC_SOCKET_URL!;

  const token = handleGetSessionStorage();

  useEffect(() => {
    if (!data) return;
    // console.log(data.data.data.chattingData);

    const mapped: ChatMessage[] = data.data.data.chattingData.map(
      (row: Record<string, unknown>, i: number) => ({
        id: `${roomId}-${row.send_at}-${i}`,
        text: row.message ?? '',
        isMyChat: !!row.itsme,
        nickname: row.itsme ? undefined : (row.nickname ?? '상대'),
        createdAt: new Date(
          (row.send_at as string) ?? Date.now()
        ).toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      })
    );
    setMessages(mapped);
  }, [data, roomId]);

  useEffect(() => {
    if (!env_api || !roomId || !token) return;

    const socket = io(env_api, {
      transports: ['websocket'],
      auth: { token }, // 서버가 읽는 키가 'token'이라고 가정
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('joinRoom', { roomId });
    });

    const onReceive = (payload: Record<string, unknown>) => {
      const createdAt = new Date(
        (payload?.send_at as string) ??
          (payload?.createdAt as string) ??
          Date.now()
      ).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID?.() ?? String(Date.now()),
          text: (payload?.message as string) ?? '',
          isMyChat: !!payload?.itsme, // ✅ itsme 반영
          nickname: payload?.itsme
            ? undefined
            : ((payload?.nickname as string) ?? '상대'),
          createdAt,
        },
      ]);
    };

    socket.on('receiveMessage', onReceive);

    socket.on('disconnect', (reason) => {
      console.warn('⚠️ 연결 끊김:', reason);
    });

    return () => {
      socket.off('receiveMessage', onReceive);
      socket.disconnect();
    };
  }, [env_api, roomId, token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || !socketRef.current) return;

    socketRef.current.emit('sendMsg', { roomId, message: text });

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID?.() ?? String(Date.now()),
        text,
        isMyChat: true,
        createdAt: new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
    setInput('');
  };

  const [isComposing, setIsComposing] = useState(false);
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (isComposing || e.nativeEvent?.isComposing) return;
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) return <div className='p-4'>불러오는 중…</div>;
  if (error) return <div className='p-4 text-red-500'>채팅 내역 로드 에러</div>;

  return (
    <div>
      <div className='flex flex-col gap-4 pb-4'>
        {messages.map((m) => (
          <ChatBox
            key={m.id}
            isMyChat={m.isMyChat}
            text={m.text}
            date={m.createdAt}
            nickname={m.nickname}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className='fixed bottom-0 left-1/2 flex h-20 w-full max-w-[640px] -translate-x-1/2 items-center justify-between gap-4 border-t bg-white p-4'>
        <Plus />
        <form
          className='flex w-full items-center gap-2'
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type='text'
            placeholder='메시지를 입력하세요...'
            className='flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
          />
          <button
            aria-label='send'
            className='rounded-full p-2 hover:bg-gray-100 active:scale-95'
            type='submit'
          >
            <Send />
          </button>
        </form>
      </div>
    </div>
  );
}
