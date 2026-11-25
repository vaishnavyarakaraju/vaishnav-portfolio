import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Used to generate /resume.pdf on the server at build time.
  serverExternalPackages: ["@react-pdf/renderer"],
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
