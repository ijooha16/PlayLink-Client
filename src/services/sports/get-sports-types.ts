export const getCategories = async() => {
 const response = await fetch(`/api/profile/get-profile`);

  if (!response.ok) {
    throw new Error('Failed to get categories');
  }
  return response.json();
}
