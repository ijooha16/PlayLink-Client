import { handleGetSessionStorage } from '@/shares/libs/utills/web-api';

export const fetchChatList = async () => {
  const token = handleGetSessionStorage();
  try {
    const res = await fetch('/api/chatlist', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();

    if (res.ok) {
      return json;
    }

    if (!res.ok) {
      console.error('services chat-list fetch error', json.message);
      throw new Error('services chat-list fetch error');
    }
  } catch (err) {
    console.error('services chat-list fetching error', err);
    // throw new Error('services chat-list fetching error');
  }
};

export const fetchChatRoom = async (id: number) => {
  const token = handleGetSessionStorage();

  try {
    const res = await fetch(`/api/chatlist/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();

    if (res.ok) {
      return json;
    }

    if (!res.ok) {
      console.error('services chat-list fetch error', json.message);
      throw new Error('services chat-list fetch error');
    }
  } catch (err) {
    console.error('services chat-list fetching error', err);
    // throw new Error('services chat-list fetching error');
  }
};
