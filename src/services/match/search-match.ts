export const searchMatch = async (query: string) => {
  const response = await fetch(`/api/match?${query}`);
  if (!response.ok) {
    throw new Error('Failed to fetch matchs');
  }
  return response.json();
};

//tanstack 없이 바로 사용
