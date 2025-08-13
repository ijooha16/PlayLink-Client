import React from 'react';

const ChatCard = () => {
  return (
    <div className='flex gap-4 py-3'>
      <div className='h-12 w-12 rounded-full bg-gray-100' />
      <div className='flex flex-1 flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <strong>당근당근</strong>
            <div className='bg-sub01 px-1 text-xs text-primary'>태그</div>
            <div className='text-xs'>여월동</div>
          </div>
          <div className='text-xs text-gray-400'>1분 전</div>
        </div>
        <div className='text-sm'>최근 메시지</div>
      </div>
    </div>
  );
};

export default ChatCard;
