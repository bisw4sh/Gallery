import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "biswashdhungana.com.np",
      },
      {
        protocol: "https",
        hostname: "wrrtcadwmufkgehggjmf.supabase.co",
      },
    ],
  },
};

export default nextConfig;
