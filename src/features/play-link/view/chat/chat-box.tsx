const ChatBox = ({ isMyChat }: { isMyChat: boolean }) => {
  return (
    <div className={`${isMyChat ? 'justify-end' : ''} flex items-start gap-2`}>
      {!isMyChat && <div className='h-12 w-12 rounded-full bg-gray-200' />}
      <div
        className={`${isMyChat ? 'ml-auto max-w-72 text-right' : 'mr-auto max-w-56'} `}
      >
        {!isMyChat && <strong className='pl-2'>nickname</strong>}
        <div
          className={`${isMyChat ? 'bg-primary text-white' : 'bg-gray-200'} rounded-xl px-3 py-2 text-sm`}
        >
          ChatBox Cha
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
