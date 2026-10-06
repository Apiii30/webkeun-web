import "server-only";
import type { Metadata } from "next";
import { site } from "./site";

// Alamat resmi situs yang sudah online (SITUS_URL saat build, mis. https://webkeun.id). Di komputer sendiri jatuh ke
// localhost. Dipakai untuk link gambar pratinjau, alamat kanonik, sitemap, robots, dan data terstruktur.
export const SITUS = new URL(process.env.SITUS_URL ?? "http://localhost:3000");

export const judulUtama = `${site.name}: Jasa Pembuatan Website UMKM, Company Profile & Portofolio`;

// Bagian pratinjau link (WhatsApp, Facebook, dll.) yang sama untuk semua halaman. Gambarnya dibuat dari
// src/app/_og/opengraph-image.tsx. Undangan sungguhan memakai foto mempelai sebagai gantinya.
export const ogDasar = {
  siteName: site.name,
  locale: "id_ID",
  type: "website",
  images: [{ url: "/brand/pratinjau.png", width: 1200, height: 630, alt: "Webkeun: jasa pembuatan website dan undangan digital" }],
};

// Metadata halaman yang ingin ditemukan di Google: judul, deskripsi, alamat kanonik (satu alamat resmi walaupun
// halamannya dibuka dengan ?kategori=, lewat www, dsb.), dan judul pratinjau saat link dibagikan.
export function halaman({ judul, deskripsi, path }: { judul?: string; deskripsi: string; path: string }): Metadata {
  return {
    ...(judul && { title: judul }),
    description: deskripsi,
    alternates: { canonical: path },
    openGraph: { ...ogDasar, title: judul ? `${judul} · ${site.name}` : judulUtama, description: deskripsi, url: path },
  };
}
