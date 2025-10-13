import { UAParser } from 'ua-parser-js';
import { externalClient } from '@/libs/http';

type DeviceInfoResults = {
  deviceId: string;
  deviceType: 'computer' | 'mobile' | 'tablet' | 'unknown';
  platform: string;
  // ip: string | null;
};

/**
 * 사용자 디바이스 정보 가져오는 유틸
 */
export const getDeviceInfo = async (): Promise<DeviceInfoResults> => {
  //parser 초기화
  const parser = new UAParser();
  const result = parser.getResult();

  //deviceId <-> localstorage
  let deviceId = localStorage.getItem('deviceUUID');
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem('deviceUUID', deviceId);
  }

  //deviceType
  let deviceType: DeviceInfoResults['deviceType'] = 'unknown';
  const type = result.device.type;

  if (type === 'mobile') {
    deviceType = 'mobile';
  } else if (type === 'tablet') {
    deviceType = 'tablet';
  } else if (!type) {
    deviceType = 'computer';
  }

  //platform
  const browserName = result.browser.name || 'Unknown Browser';
  const osName = result.os.name || 'Unknown OS';
  const platform = `${browserName} on ${osName}`;

  const ip: string | null = null;
  try {
    const response = await externalClient.get(
      'https://api.ipify.org?format=json'
    );
    // const data = response.data;
    // ip = data.ip;
  } catch (error) {
    console.error('IP 주소 조회 오류 발생:', error);
  }

  return {
    deviceId,
    deviceType,
    platform,
    // ip,
  };
};
