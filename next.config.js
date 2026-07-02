/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow building to a separate dir (e.g. NEXT_DIST_DIR=.next-build) so a prod
  // build can run without clobbering a running `next dev` server's .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
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
