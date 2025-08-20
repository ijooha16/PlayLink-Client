export const getNotification = async ({
  token,
}: {
  token: string | null;
}) => {
  const response = await fetch(`/api/notification/get-notification-list`, {
    method: 'GET',
    headers: {
      Authorization: token!,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to add match');
  }
  return response.json();
};