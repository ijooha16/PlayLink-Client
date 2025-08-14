export const addMatch = async ({
  formData,
  token,
}: {
  formData: FormData;
  token: string | null;
}) => {
  const response = await fetch(`/api/match/add-match`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to add match');
  }
  return response.json();
};

export const deleteMatch = async (matchId: string, token: string | null) => {
  const response = await fetch(`/api/match/:${matchId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete match');
  }
  return response.json();
};

export const updateMatch = async ({
  matchId,
  formData,
  token,
}: {
  matchId: string;
  formData: FormData;
  token: string | null;
}) => {
  const response = await fetch(`/api/match/:${matchId}/modify`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to update match');
  }
  return response.json();
};
