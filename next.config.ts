// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@balkangraph/orgchart.js'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '**',
      },
    ],
  },
  swcMinify: true,
};

module.exports = nextConfig;
