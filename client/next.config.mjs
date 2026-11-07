/** @type {import('next').NextConfig} */
import { fileURLToPath } from "node:url";
const nextConfig = {
  outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_INTERNAL_URL || "http://127.0.0.1:5027"}/api/:path*`,
      },
    ];
  },
  /* config options here */
  // Nonce-based CSP on membership and the portal requires complete request-time rendering.
  cacheComponents: false,
  partialPrefetching: false,
  async headers() {
    return [
      {
        // These are the existing, unversioned public assets; allow prompt revalidation.
        source: "/:asset(next|vercel|window|globe|file).svg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=60",
          },
        ],
      },
    ];
  },
  turbopack: {
    root: fileURLToPath(new URL(".", import.meta.url)),
  },
};

export default nextConfig;
