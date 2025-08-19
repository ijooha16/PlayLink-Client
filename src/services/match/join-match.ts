export const applyMatch = async ({
  join_message,
  token,
  matchId,
}: {
  join_message: string | null;
  token: string | null;
  matchId: number;
}) => {
  const response = await fetch(`/api/match/apply-match?matchId=${matchId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`!,
    },
    body: JSON.stringify({ join_message }),
  });

  if (!response.ok) {
    throw new Error('Failed to apply match');
  }
  return response.json();
};
