import Header from '@/components/common/header';
import { EllipsisVertical } from 'lucide-react';

const CreateChatRoomLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='h-full w-full'>
      <Header title={'채팅룸'} backbtn>
        <EllipsisVertical />
      </Header>
      {children}
    </div>
  );
};

export default CreateChatRoomLayout;
