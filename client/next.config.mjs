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
  async redirects() {
    return [
      {
        source: "/tjp-punjab-pk-portal",
        destination: "/admin/login",
        permanent: true,
      },
      {
        source: "/tjp-admin-dashboard",
        destination: "/admin",
        permanent: true,
      },
    ];
  },
  /* config options here */
  // Nonce-based CSP on membership/admin requires complete request-time rendering.
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
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
