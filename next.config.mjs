/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  // reactStrictMode: false,
  experimental: {
    serverComponentsExternalPackages: [],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uphvvootokmnxkxanjcr.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
