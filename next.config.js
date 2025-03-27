/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['localhost', 'test.api.auralhearingcare.com', 'api.auralhearingcare.com'],
    deviceSizes: [640, 768, 1024, 1280, 1536],
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Configure Netlify output
  distDir: '.next'
};

module.exports = nextConfig;
