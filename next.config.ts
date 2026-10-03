import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Supaya website bisa dicoba dari HP lewat WiFi yang sama (mis. http://192.168.1.7:3000) saat `npm run dev`.
  // Tanpa ini Next memblokir file JavaScript untuk alamat selain localhost, jadi tombol & animasi tidak jalan.
  // Hanya berlaku di mode dev.
  allowedDevOrigins: ["192.168.*.*"],
  // 85 dipakai undangan Frisca & Arif untuk foto sampul & layar penuh (sama dengan proyek aslinya)
  images: {
    qualities: [75, 85],
  },
  // Halaman "Contoh" sudah diganti jadi "Template"
  async redirects() {
    return [
      { source: "/contoh", destination: "/template", permanent: true },
      { source: "/contoh/:slug", destination: "/template/:slug", permanent: true },
      // Tema Floral sudah dihapus, alamat lamanya diarahkan ke tema Rimba
      { source: "/template/undangan-fara-aditya", destination: "/template/undangan-fara-aditya-rimba", permanent: false },
      // Tema Jawa Klasik sudah dihapus, diganti undangan Frisca & Arif
      { source: "/template/undangan-fara-aditya-jawa", destination: "/template/undangan-frisca-arif", permanent: false },
    ];
  },
};

export default nextConfig;
