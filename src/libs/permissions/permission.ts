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
  },

  geolocation: (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('브라우저에서 위치 권한을 허용해주세요.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error('위치 권한이 거부되었습니다.'));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error('위치 정보를 사용할 수 없습니다.'));
              break;
            case error.TIMEOUT:
              reject(new Error('위치 요청 시간이 초과되었습니다.'));
              break;
            default:
              reject(new Error('현재 위치를 가져오지 못했어요.'));
              break;
          }
        }
      );
    });
  }
};