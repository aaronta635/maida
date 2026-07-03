import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/staff.html', destination: '/staff', permanent: true },
      { source: '/crm/maida-sale-tinhgia.html', destination: '/crm/sale', permanent: true },
      { source: '/crm/maida-capture.html', destination: '/crm/capture', permanent: true },
    ];
  },
};

export default nextConfig;
