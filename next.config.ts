import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['fakestoreapi.com'],
  },

  eslint: {
    //disable esLint
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
