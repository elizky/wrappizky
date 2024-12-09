import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  publicRuntimeConfig: {
    staticFolder: '/data',
  },
};

export default nextConfig;
