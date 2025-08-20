const ChatBox = ({
  isMyChat,
  text,
  date,
  nickname,
}: {
  isMyChat: boolean;
  text: string;
  date: string;
  nickname?: string;
}) => {
  return (
    <div className={`${isMyChat ? 'justify-end' : ''} flex items-start gap-2`}>
      {!isMyChat && <div className='h-8 w-8 rounded-full bg-gray-300' />}

      <div
        className={`${
          isMyChat ? 'ml-auto max-w-72 text-right' : 'mr-auto max-w-56'
        } flex flex-col gap-1`}
      >
        {!isMyChat && nickname && (
          <strong className='pl-2 text-sm'>{nickname}</strong>
        )}

        <div className={`${isMyChat ? 'flex-col' : 'items-end'} flex gap-1`}>
          <div
            className={`${
              isMyChat ? 'bg-primary text-white' : 'bg-gray-200'
            } mt-1 break-words rounded-xl px-3 py-2 text-sm`}
          >
            {text}
          </div>

          {isMyChat ? (
            <div className='pr-2 text-xs text-gray-400'>{date}</div>
          ) : (
            <div className='pl-2 text-xs text-gray-400'>{date}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
