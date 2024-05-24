/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: `raw.githubusercontent.com` },
      { hostname: `media.licdn.com` },
    ],
  },
};

module.exports = nextConfig;
