/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ucarecdn.com'],
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
