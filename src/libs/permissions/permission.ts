export const requestPermissions = {
  notification: async (): Promise<string | null> => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('알림 권한이 거부됨');
        return null;
      }
      return permission;
    } catch (err) {
      console.error('알림 권한 요청 실패:', err);
      return null;
    }
  }
};