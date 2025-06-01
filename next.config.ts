import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // ✅ Ensures Vercel recognizes the build
};

export default nextConfig;
