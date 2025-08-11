import React from 'react';

const ChatCard = () => {
  return (
    <div className='flex gap-4 py-3'>
      <div className='h-12 w-12 rounded-full bg-gray-100' />
      <div className='flex flex-1 flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <div className='flex gap-2'>
            <div>당근당근</div>
            <div>태그</div>
            <div>동</div>
          </div>
          <div>1분전</div>
        </div>
        <div>최근 메시지</div>
      </div>
    </div>
  );
};

export default ChatCard;
