

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
