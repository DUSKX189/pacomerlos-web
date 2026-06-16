import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.23'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.pacomerlos.com',
        pathname: '/assets/**',
      },
    ],
  },
};

export default nextConfig;
