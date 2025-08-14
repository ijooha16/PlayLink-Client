export const getMatchDetail = async (matchId: string) => {
  const response = await fetch(`/api/match/:${matchId}/detail`);
  if (!response.ok) {
    throw new Error('Failed to fetch matchs');
  }
  return response.json();
};
