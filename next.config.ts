import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shadcnstudio.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Allow serving static files from public/thumbnails
  async rewrites() {
    return [
      {
        source: '/thumbnails/:path*',
        destination: '/thumbnails/:path*',
      },
    ];
  },
};

export default nextConfig;
