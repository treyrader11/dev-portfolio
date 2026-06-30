/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: `raw.githubusercontent.com` },
      { hostname: `media.licdn.com` },
      { hostname: `lh3.googleusercontent.com` },
      { hostname: `res.cloudinary.com` },
    ],
  },
};

module.exports = nextConfig;
