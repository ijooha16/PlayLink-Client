export const addMatch = async (data:any) => {
  const response = await fetch(`/api/match/add-match`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
  });

  if (!response.ok) {
    throw new Error('Failed to add match');
  }
  return response.json();
};
