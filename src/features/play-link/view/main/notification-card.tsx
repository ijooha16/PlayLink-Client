import {
  useApproveMatchMutation,
  useRejectMatchMutation,
} from '@/hooks/match/use-approve-match-mutation';
import MatchButton from '@/shares/common-components/match-button';
import { useAlertStore } from '@/shares/stores/alert-store';
import { Check, LucideEllipsisVertical, MinusCircle, UserPlus2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { NotificationDataType } from '../../types/notification/notification';

const NotificationCard = ({
  token,
  data,
  setNotificationViewOpen,
}: {
  token: string | null;
  data: NotificationDataType;
  setNotificationViewOpen: (b: boolean) => void;
}) => {
  const [openOptions, setOpenOptions] = useState(false);
  const { openAlert } = useAlertStore();
  const { mutate: approveMatch } = useApproveMatchMutation();
  const { mutate: rejectMatch } = useRejectMatchMutation();
  const router = useRouter();
  const matchId = 123; // Example matchId

  
  return (
    <div className='flex gap-4 py-4'>
      <div className='text-primary'>
        {cardIcon[data.type]}
      </div>
      <div className='flex flex-1 flex-col gap-1'>
        <div>
          <div className='flex items-center justify-between'>
            <strong>{cardTitle[data.type]}</strong>
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
          {data.title}
        </div>
        <div className='flex gap-3'>
          <MatchButton
            onClick={() => {
              approveMatch({ token, matchId: data.match_id, applicantId: data.target_id });
              openAlert(
                '매칭 수락이 완료되었어요!',
                '돌멩이님이 "조깅하실분" 채팅방에 초대되었어요.'
              );
              setNotificationViewOpen(false);
            }}
            type='수락'
          />
          <MatchButton
            type='거절'
            onClick={() =>
              rejectMatch({ token, matchId: data.match_id, applicantId: data.target_id })
            }
          />
          <MatchButton
            type='상세'
            onClick={() => router.push(`/match/${data.match_id}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;

  const cardTitle = {
    received: '매칭요청',
    approved: '매칭수락',
    rejected: '매칭거절',
    cancel: '매칭취소',
  }

  const cardIcon = {
    sent: <UserPlus2Icon className='text-primary' />,
    received: <UserPlus2Icon className='text-primary' />,
    approved:<Check className='text-primary' />,
    rejected: <MinusCircle className='text-primary' />,
    cancel: <UserPlus2Icon className='text-primary' />,
  }