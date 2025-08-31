export const sendNotificationToken = async ({
  token,
  fcmToken,
}: {
  token: string | null;
  fcmToken: string | null;
}) => {
  const response = await fetch('/api/notification/send-notification-token', {
    method: 'PUT',
    headers: {
      Authorization: token!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: fcmToken }),
  });

  if (!response.ok) {
    throw new Error('Failed to send notification token');
  }
  return response.json();
};
