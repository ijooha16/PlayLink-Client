export const getProfile = async (token: string | null) => {
  const response = await fetch('/api/profile/get-profile', {
    method: 'GET',
    headers: {
      Authorization: token!,
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
  profileData: FormData;
}) => {
  const response = await fetch('/api/profile/update-profile', {
    method: 'PUT',
    headers: {
      Authorization: token!,
    },
    body: profileData,
  });

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }
  return response.json();
};
