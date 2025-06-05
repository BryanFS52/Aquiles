/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.freepik.com', 'ui-avatars.com'],
    dangerouslyAllowSVG: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8081/api/:path*', // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
