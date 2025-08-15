export const getProfile = async ({ token }: { token: string | null }) => {
  const response = await fetch(`/api/profile/get-profile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get profile');
  }
  return response.json();
};

export const updateProfile = async ({
  token,
  profileData,
}: {
  token: string | null;
  profileData: Record<string, any>;
}) => {
  const response = await fetch(`/api/profile/update-profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }
  return response.json();
};
