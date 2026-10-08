import type { NextConfig } from "next";

const situs = process.env.SITUS_URL ? new URL(process.env.SITUS_URL) : null;

// Situs bisa dibuka lewat beberapa alamat (www.webkeun.id, webkeun.<akun>.workers.dev). Semuanya diarahkan permanen ke
// alamat resmi, supaya Google hanya mengenal satu alamat dan link lama (termasuk ?to= & ?kunci=) tetap jalan.
// Halaman depan punya aturan sendiri: di Cloudflare (OpenNext), "/:path*" yang kosong tidak terisi, jadi www.webkeun.id/
// sempat diarahkan ke webkeun.id/:path* (404).
const hostLain = situs ? [`www.${situs.host}`, ...(situs.host.endsWith(".workers.dev") ? [] : [".*\\.workers\\.dev"])] : [];
const keAlamatResmi = situs
  ? hostLain.flatMap((host) => [
      { source: "/", has: [{ type: "host" as const, value: host }], destination: `${situs.origin}/`, permanent: true },
      { source: "/:path+", has: [{ type: "host" as const, value: host }], destination: `${situs.origin}/:path+`, permanent: true },
    ])
  : [];

if (process.env.NODE_ENV === "production" && !process.env.SITUS_URL) {
  console.warn("⚠ SITUS_URL belum diisi (.env.production): gambar pratinjau link di WhatsApp akan mengarah ke localhost.");
}

// Header keamanan untuk semua halaman:
// - frame-ancestors / X-Frame-Options: halaman tidak bisa dibingkai (iframe) di website lain, untuk mencegah pengunjung
//   ditipu mengeklik tombol yang disamarkan (clickjacking)
// - nosniff: browser tidak menebak-nebak jenis file, jadi file biasa tidak bisa dijalankan sebagai script
// - base-uri, form-action, object-src: menutup beberapa celah sisipan kode yang umum
// - Permissions-Policy: kamera, mikrofon, dan lokasi tidak dipakai, jadi dimatikan
// CSP sengaja tidak membatasi script: halaman statis memakai script inline milik Next, dan membatasinya perlu nonce yang
// membuat semua halaman jadi dinamis (lebih berat di paket gratis Cloudflare).
const headerKeamanan = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  // Supaya website bisa dicoba dari HP lewat WiFi yang sama (mis. http://192.168.1.7:3000) saat `npm run dev`.
  // Tanpa ini Next memblokir file JavaScript untuk alamat selain localhost, jadi tombol & animasi tidak jalan.
  // Hanya berlaku di mode dev.
  allowedDevOrigins: ["192.168.*.*"],
  // 85 dipakai undangan Frisca & Arif untuk foto sampul & layar penuh (sama dengan proyek aslinya)
  images: {
    qualities: [75, 85],
  },
  async headers() {
    return [{ source: "/(.*)", headers: headerKeamanan }];
  },
  // Halaman "Contoh" sudah diganti jadi "Template"
  async redirects() {
    return [
      ...keAlamatResmi,
      // Undangan punya halaman sendiri; link lama /template?kategori=undangan diarahkan ke sana
      { source: "/template", has: [{ type: "query", key: "kategori", value: "undangan" }], destination: "/template/undangan", permanent: false },
      { source: "/contoh", destination: "/template", permanent: true },
      { source: "/contoh/:slug", destination: "/template/:slug", permanent: true },
      // Tema Floral sudah dihapus, alamat lamanya diarahkan ke tema Rimba
      { source: "/template/undangan-fara-aditya", destination: "/template/undangan-fara-aditya-rimba", permanent: false },
      // Tema Jawa Klasik sudah dihapus, diganti undangan Frisca & Arif
      { source: "/template/undangan-fara-aditya-jawa", destination: "/template/undangan-frisca-arif", permanent: false },
      // Portofolio Nadia Putri sudah diganti template Laras Kinanti
      { source: "/template/nadia-putri", destination: "/template/laras-kinanti", permanent: false },
      // Kopi Senja sudah diganti template Kawalu Coffee
      { source: "/template/kopi-senja", destination: "/template/kawalu-coffee", permanent: false },
      // Arunika Konstruksi sudah diganti template Bahtera Lintas Nusantara
      { source: "/template/arunika-konstruksi", destination: "/template/bahtera-logistik", permanent: false },
    ];
  },
};

export default nextConfig;
