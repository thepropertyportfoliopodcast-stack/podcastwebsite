/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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

module.exports = nextConfig;