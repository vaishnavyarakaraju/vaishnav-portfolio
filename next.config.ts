import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  // The admin panel is a static page in public/admin.
  async redirects() {
    return [{ source: "/admin", destination: "/admin/index.html", permanent: false }];
  },
};

export default nextConfig;
