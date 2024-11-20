/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ucarecdn.com'],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  experimental: {
    turbotrace: {
      logLevel: 'error'
    }
  },
  output: 'standalone',
}

module.exports = nextConfig
