import type { NextConfig } from "next";

/**
 * EDEN_API_URL points at the Eden Flame API (e.g. http://localhost:4000).
 * Browser calls to /api/* are proxied there, so the bag and session cookies are
 * first-party to the storefront domain. Leave it unset to run on the sample catalog.
 *
 * SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_TOKEN run the shop on Shopify instead
 * (see src/lib/commerce/shopify.ts and README "Running on Shopify").
 */
const shopify = Boolean(process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_TOKEN);
// Shopify takes over from the Eden Flame API when both are set.
const apiUrl = shopify ? undefined : process.env.EDEN_API_URL?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: { NEXT_PUBLIC_COMMERCE_API: apiUrl ? "1" : "", NEXT_PUBLIC_COMMERCE_SHOPIFY: shopify ? "1" : "" },
  images: {
    formats: ["image/avif", "image/webp"],
    // Add your image CDN here when real product photography arrives
    remotePatterns: [
      { protocol: "https", hostname: "media.lovehoneyassets.com" },
      // Product photos uploaded to Shopify
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
  },
  async rewrites() {
    return apiUrl ? [{ source: "/api/:path*", destination: `${apiUrl}/api/:path*` }] : [];
  },
};

export default nextConfig;
