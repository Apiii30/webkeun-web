import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Halaman "Contoh" sudah diganti jadi "Template"
  async redirects() {
    return [
      { source: "/contoh", destination: "/template", permanent: true },
      { source: "/contoh/:slug", destination: "/template/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
