const ChatBox = ({ isMyChat }: { isMyChat: boolean }) => {
  return (
    <div className={`${isMyChat ? 'justify-end' : ''} flex items-start gap-1`}>
      {!isMyChat && <div className='h-12 w-12 rounded-full bg-gray-200' />}
      <div
        className={`${isMyChat ? 'ml-auto max-w-72 text-right' : 'mr-auto max-w-56'} flex flex-col gap-1`}
      >
        {!isMyChat && <strong className='pl-2'>nickname</strong>}
        <div className={`${isMyChat ? 'flex-col' : 'items-end'} flex gap-1`}>
          <div
            className={`${isMyChat ? 'bg-primary text-white' : 'bg-gray-200'} mt-1 rounded-xl px-3 py-2 text-sm`}
          >
            ChatBox Cha
          </div>
          {isMyChat ? (
            <div className={`pr-2 text-sm`}>date</div>
          ) : (
            <div className={`pl-2 text-xs text-gray-400`}>date</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
