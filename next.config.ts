import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Note: For production Docker with smaller images, enable standalone:
  // output: "standalone",
};

export default nextConfig;
