import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    esmExternals: true, // Enable ESM for dependencies

  },
  
};


export default nextConfig;
