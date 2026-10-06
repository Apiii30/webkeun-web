import type { MetadataRoute } from "next";
import { SITUS } from "@/lib/seo";

// Daftar halaman yang ingin ditemukan di Google (/sitemap.xml). Halaman demo template, undangan tamu (/u/...), dan
// rekap pengantin sengaja tidak dimasukkan: semuanya bertanda noindex.
const halaman: { path: string; prioritas: number }[] = [
  { path: "/", prioritas: 1 },
  { path: "/template", prioritas: 0.9 },
  { path: "/template/undangan", prioritas: 0.9 },
  { path: "/tentang", prioritas: 0.6 },
  { path: "/kontak", prioritas: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const dibuat = new Date(); // waktu build: tiap deploy berarti isinya bisa berubah
  return halaman.map(({ path, prioritas }) => ({ url: new URL(path, SITUS).href, lastModified: dibuat, changeFrequency: "monthly", priority: prioritas }));
}
