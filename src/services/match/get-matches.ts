export const getMatches = async () => {
  const response = await fetch(`/api/match`);
  if (!response.ok) {
    throw new Error('Failed to fetch matchs');
  }
  return response.json();
};
