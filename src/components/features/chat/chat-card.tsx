import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import Image from 'next/image';

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
        <div className="relative h-12 w-12">
          <Image
            src={avatarUrl}
            alt={`${nickname} 프로필`}
            fill
            className="rounded-full object-cover"
            sizes="48px"
            quality={85}
          />
        </div>
      ) : (
        <div className='h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center'>
          <span className="text-gray-400 text-sm">
            {nickname.charAt(0).toUpperCase()}
          </span>
        </div>
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
            {formatDistanceToNow(new Date(sendAt), {
              addSuffix: true,
              locale: ko
            })}
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
