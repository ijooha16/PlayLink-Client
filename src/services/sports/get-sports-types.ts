export const getSports = async () => {
  const response = await fetch('/api/sport/get-sports');

  if (!response.ok) {
    throw new Error('Failed to get categories');
  }
  return response.json();
};
