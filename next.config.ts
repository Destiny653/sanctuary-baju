import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Existing generated/types files fail prettier in CI; keep builds focused on compile.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow first Next cutover to ship while tightening types page-by-page.
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
