import MatchButton from '@/shares/common-components/match-button';
import { useAlertStore } from '@/shares/stores/alert-store';
import { LucideEllipsisVertical, UserPlus2Icon } from 'lucide-react';
import React, { useState } from 'react';

const NotificationCard = ({
  setNotificationViewOpen,
}: {
  setNotificationViewOpen: (b: boolean) => void;
}) => {
  const [openOptions, setOpenOptions] = useState(false);
  const { openAlert } = useAlertStore();

  return (
    <div className='flex gap-4 py-4'>
      <div className='text-primary'>
        <UserPlus2Icon />
      </div>
      <div className='flex flex-1 flex-col gap-1'>
        <div>
          <div className='flex items-center justify-between'>
            <strong>매칭요청</strong>
            <div className='flex items-center gap-3 text-xs text-gray-400'>
              <div>2일 전</div>
              <LucideEllipsisVertical
                size={14}
                onClick={() => setOpenOptions(!openOptions)}
              />
              {openOptions && (
                <div className='absolute mt-16 w-14 rounded-lg border-gray-100 bg-white px-3 py-2 text-black shadow-md'>
                  삭제
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='pb-4 pt-2 text-sm'>
          돌멩이님이 '조깅하실분'에 매칭을 요청했어요!
        </div>
        <div className='flex gap-3'>
          <MatchButton
            onClick={() => {
              openAlert(
                '매칭 수락이 완료되었어요!',
                '돌멩이님이 "조깅하실분" 채팅방에 초대되었어요.'
              );
              setNotificationViewOpen(false);
            }}
            type='수락'
          />
          <MatchButton type='거절' />
          <MatchButton type='상세' />
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
