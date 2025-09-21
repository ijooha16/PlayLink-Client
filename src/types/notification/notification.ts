export type NotificationDataType = {
  body: string;
  created_at: string;
  is_read: boolean;
  messageid: string;
  title: string;
  type: 'received' | 'approved' | 'rejected' | 'cancel';
  match_id: number;
  user_id: number;
  user_notifications_id: number;
  target_id: number;
};
