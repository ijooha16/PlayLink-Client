/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  // reactStrictMode: false,
  experimental: {
    serverComponentsExternalPackages: [],
  },
  output: 'standalone',
};

export default nextConfig;
