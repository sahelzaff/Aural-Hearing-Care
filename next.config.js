/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ucarecdn.com'],
    unoptimized: true
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    // This helps avoid prerendering errors for pages that need browser APIs
    appDir: true,
  },
  // Disable static generation for pages that use browser APIs
  staticPageGenerationTimeout: 120,
  staticGeneration: {
    // Disable static generation for paths that cause errors
    excludedPaths: [
      '/_not-found',
      '/_error',
      '/404',
      '/500',
      '/login',
      '/signup',
      '/verify-email',
      '/my-info',
      '/checkout',
      '/checkout/confirmation',
      '/checkout/payment',
      '/cart',
      '/wishlist',
      '/About-us',
      '/blog',
      '/contact',
      '/services',
      '/products',
      '/online-hearing-test',
      '/'
    ]
  }
}

module.exports = nextConfig
