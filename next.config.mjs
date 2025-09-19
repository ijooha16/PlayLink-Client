/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  // reactStrictMode: false,
  serverExternalPackages: [],

  images: {
    // 외부 이미지 도메인 설정
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uphvvootokmnxkxanjcr.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    
    // 반응형 이미지 크기 설정 (디바이스별)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // 추가 이미지 크기 설정 (아이콘, 썸네일 등)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // 이미지 포맷 최적화 (WebP, AVIF 우선)
    formats: ['image/webp', 'image/avif'],
    
    // 이미지 최적화 비활성화 여부 (개발 환경에서만)
    unoptimized: process.env.NODE_ENV === 'development',
    
    // 이미지 로더 설정
    loader: 'default',
    
    // 이미지 최소 캐시 시간 (초)
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30일
    
    // SVG 파일 허용 설정 (보안 강화)
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    // 추가 보안 설정
    domains: [], // 사용하지 않는 domains 설정 제거
    path: '/_next/image', // 이미지 최적화 경로
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;
