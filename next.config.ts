import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.devtunnels.ms', 'chbnh3n3-3000.asse.devtunnels.ms'],
    },
  },
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
