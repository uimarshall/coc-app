import type { NextConfig } from "next";

/**
 * Next.js configuration file.
 * @see https://nextjs.org/docs/app/api-reference/config/next-config-js
 */
const nextConfig: NextConfig = {
  // Enable React strict mode for catching potential issues early
  reactStrictMode: true,

  // Output as a standalone build for optimal Docker deployment
  // This copies only the necessary files for production, making the image smaller
  output: "standalone",

  images: {
    // Allow images from external sources (e.g., Cloudflare Images, Unsplash)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cloudflare.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
