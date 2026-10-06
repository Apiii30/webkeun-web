import type { MetadataRoute } from "next";
import { SITUS } from "@/lib/seo";

// /robots.txt. Rekap pengantin (/rekap/...) tidak dijelajahi sama sekali. Undangan tamu (/u/...) sengaja TIDAK dilarang
// di sini: sebagian aplikasi chat (Telegram, X) mematuhi robots.txt saat membuat pratinjau link, jadi foto mempelainya
// bisa hilang. Undangan tetap tidak masuk Google karena halamannya bertanda noindex.
// Aturan bot AI ditambahkan Cloudflare di atas isi ini (Bot Preference Sync).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/rekap/" },
    sitemap: new URL("/sitemap.xml", SITUS).href,
  };
}
