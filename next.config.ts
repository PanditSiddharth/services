import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // allow images from any domain
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
