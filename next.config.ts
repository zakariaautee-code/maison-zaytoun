import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Keep production builds deterministic for the pitch demo.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
