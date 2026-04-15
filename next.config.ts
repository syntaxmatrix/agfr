import type { NextConfig } from "next";

const backendUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL;

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;