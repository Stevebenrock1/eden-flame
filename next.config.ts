import type { NextConfig } from "next";

/**
 * EDEN_API_URL points at the Eden Flame API (e.g. http://localhost:4000).
 * Browser calls to /api/* are proxied there, so the bag and session cookies are
 * first-party to the storefront domain. Leave it unset to run on the sample catalog.
 */
const apiUrl = process.env.EDEN_API_URL?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: { NEXT_PUBLIC_COMMERCE_API: apiUrl ? "1" : "" },
  images: {
    formats: ["image/avif", "image/webp"],
    // Add your image CDN here when real product photography arrives
    remotePatterns: [],
  },
  async rewrites() {
    return apiUrl ? [{ source: "/api/:path*", destination: `${apiUrl}/api/:path*` }] : [];
  },
};

export default nextConfig;
