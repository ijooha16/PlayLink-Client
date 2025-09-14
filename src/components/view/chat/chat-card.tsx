import React from 'react';
import { timeAgo } from '@/shares/libs/utills/time-ago';

type ChatCardProps = {
  roomId: string;
  nickname: string; // 닉네임
  message: string; // 최근 메시지
  sendAt: string; // ISO 문자열 (예: "2025-08-20T02:05:20.255Z")
  avatarUrl?: string | null; // 프로필 이미지
};

const ChatCard = ({
  // roomId,
  nickname,
  message,
  sendAt,
  avatarUrl,
}: ChatCardProps) => {
  return (
    <div className='flex gap-4 py-3'>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`${nickname} avatar`}
          className='h-12 w-12 rounded-full object-cover'
        />
      ) : (
        <div className='h-12 w-12 rounded-full bg-gray-100' />
      )}

      <div className='flex min-w-0 flex-1 flex-col gap-2'>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex min-w-0 items-center gap-2'>
            <strong className='truncate'>{nickname}</strong>
            {/* {tag && (
              <div className='bg-sub01 text-primary shrink-0 px-1 text-xs'>
                {tag}
              </div>
            )}
            {region && <div className='shrink-0 text-xs'>{region}</div>} */}
          </div>
          <div className='shrink-0 text-xs text-gray-400'>
            {timeAgo(sendAt)}
          </div>
        </div>
        <div className='truncate text-sm text-gray-700'>
          {message || '메시지가 없습니다'}
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
