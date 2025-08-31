export const addMatch = async ({
  formData,
  token,
}: {
  formData: FormData;
  token: string | null;
}) => {
  const response = await fetch('/api/match/add-match', {
    method: 'POST',
    headers: {
      Authorization: token!,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to add match');
  }
  return response.json();
};

export const deleteMatch = async (matchId: string, token: string | null) => {
  const response = await fetch(`/api/match/remove-match/${matchId}`, {
    method: 'DELETE',
    headers: {
      Authorization: token!,
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
  const response = await fetch(`/api/match/update-match/${matchId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token!,
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error('Failed to update match');
  }
  return response.json();
};
