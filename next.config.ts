import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: process.cwd(), // Explicitly set the workspace root to current directory
  },
};

export default nextConfig;
