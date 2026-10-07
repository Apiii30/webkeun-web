import "server-only";
import type { Metadata } from "next";
import { hargaPaket, type JenisHarga, site } from "./site";

// Alamat resmi situs yang sudah online (SITUS_URL saat build, mis. https://webkeun.id). Di komputer sendiri jatuh ke
// localhost. Dipakai untuk link gambar pratinjau, alamat kanonik, sitemap, robots, dan data terstruktur.
export const SITUS = new URL(process.env.SITUS_URL ?? "http://localhost:3000");

// Judul di hasil Google. Produk utama (undangan digital) disebut duluan, lalu jasa website.
export const judulUtama = `${site.name}: Undangan Digital Pernikahan & Jasa Pembuatan Website`;

// Bagian pratinjau link (WhatsApp, Facebook, dll.) yang sama untuk semua halaman. Gambarnya dibuat dari
// src/app/_og/opengraph-image.tsx. Undangan sungguhan memakai foto mempelai sebagai gantinya.
export const ogDasar = {
  siteName: site.name,
  locale: "id_ID",
  type: "website",
  images: [{ url: "/brand/pratinjau.png?v=2", width: 1200, height: 630, alt: "Webkeun: undangan digital pernikahan dan jasa pembuatan website" }],
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

// Daftar paket & harga sebagai data terstruktur (schema.org OfferCatalog), dari data yang sama dengan tampilan harganya.
// Paket "mulai ..." ditulis sebagai harga minimum.
export function katalogHarga(jenis: JenisHarga, url: string) {
  const { label, paket } = hargaPaket[jenis];
  return {
    "@type": "OfferCatalog",
    name: `Paket ${label}`,
    itemListElement: paket.map((p) => ({
      "@type": "Offer",
      name: `${label} ${p.nama}`,
      url,
      priceCurrency: "IDR",
      ...(p.mulai ? { priceSpecification: { "@type": "PriceSpecification", minPrice: p.nilai, priceCurrency: "IDR" } } : { price: p.nilai }),
      itemOffered: { "@type": "Service", name: `${label} ${p.nama}`, description: [p.dasar && `Semua fitur ${p.dasar}`, ...p.fitur, p.aktif && `Aktif ${p.aktif}`].filter(Boolean).join(", ") },
    })),
  };
}
