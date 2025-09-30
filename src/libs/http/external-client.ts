import axios from 'axios';

/**
 * 외부 API 클라이언트 (Kakao, IP lookup 등 third-party APIs)
 */
export const externalClient = axios.create({
  timeout: 10000,
});

export default externalClient;
