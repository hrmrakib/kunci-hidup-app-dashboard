import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "10.10.12.111",
      },
      {
        protocol: "https",
        hostname: "api.example.com",
      },
    ],
  },
};

export default nextConfig;
