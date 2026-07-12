import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF first (30% smaller than WebP), fallback to WebP
    formats: ["image/avif", "image/webp"],
    // Restrict device sizes to common breakpoints (smaller bundle of generated sizes)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    // Cache optimised images for 1 year
    minimumCacheTTL: 31536000,
    // Allow Vercel Blob images (uploaded via /admin)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  // Compress all responses
  compress: true,
  // Set production-grade response headers
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Staging (kok.staging.ophirdigital.com, branch domain on the
        // `staging` git branch) must never be indexed — it duplicates the
        // live site. Host-matched so kokkitchens.com is untouched.
        source: "/:path*",
        has: [{ type: "host", value: "(.*\\.)?staging\\.ophirdigital\\.com" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
    ];
  },
};

export default nextConfig;
