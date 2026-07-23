/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true' || process.env.npm_lifecycle_event === 'analyze',
  openAnalyzer: false,
});

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' }],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'podcast-website-bucket.s3.eu-north-1.amazonaws.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 's3.us-west-004.backblazeb2.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'podcasts-episodes.s3.us-west-004.backblazeb2.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'abhinav-bucket.s3.ap-south-1.amazonaws.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'f004.backblazeb2.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.ignoreWarnings = [{ module: /plyr/ }];
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
