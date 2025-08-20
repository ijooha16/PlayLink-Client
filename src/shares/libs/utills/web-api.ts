const KEY = 'PLAYLINK_AUTH';

export const handleSetSessionStorage = (value: string) => {
  sessionStorage.setItem(KEY, value);
};

export const handleRemoveSessionStorage = (key?: string | undefined) => {
  if (key) {
    sessionStorage.removeItem(key);
    return {
      status: 'success',
      message: 'remove session storage item',
    };
  }

  return {
    status: 'failed',
    message: 'failed remove session storage Item',
  };
};

export const handleGetSeesionStorage = () => {
  const value = sessionStorage.getItem(KEY);

  return value;
};
