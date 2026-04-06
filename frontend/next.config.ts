import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    // Pin workspace root when multiple lockfiles exist higher in the directory tree.
    root: process.cwd(),
  },
};

export default nextConfig;
