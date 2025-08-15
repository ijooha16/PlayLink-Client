export const getMatches = async () => {
  const response = await fetch(`/api/match`);
  if (!response.ok) {
    throw new Error('Failed to fetch matchs');
  }
  return response.json();
};

export const getMatchDetail = async (matchId: string) => {
  const response = await fetch(`/api/match/get-match-detail/${matchId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch matchs');
  }
  return response.json();
};

export const searchMatch = async (query: string) => {
  const response = await fetch(`/api/match/search-match/${query}`);
  if (!response.ok) {
    throw new Error('Failed to fetch matchs');
  }
  return response.json();
};

//tanstack 없이 바로 사용
