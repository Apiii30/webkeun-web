import { ambilBalasan, bukaRekap } from "@/undangan/buku-tamu/rekap";

// Unduh semua balasan tamu sebagai CSV (bisa dibuka di Excel / Google Sheets).

// Sel yang diawali = + - @ bisa dijalankan sebagai rumus oleh Excel, jadi diberi tanda kutip satu di depannya
const sel = (v: string) => {
  const aman = /^[=+\-@]/.test(v) ? `'${v}` : v;
  return `"${aman.replace(/"/g, '""')}"`;
};

export async function GET(req: Request, { params }: RouteContext<"/rekap/[slug]/csv">) {
  const { slug } = await params;
  const akses = await bukaRekap(slug, new URL(req.url).searchParams.get("kunci"));
  if (!akses || akses === "belum") return new Response("Tidak ditemukan", { status: 404 });

  const rows = await ambilBalasan(slug);
  const waktu = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" });
  const baris = [
    ["Waktu (WIB)", "Nama", "Kehadiran", "Ucapan", "Nama di link undangan", "Tampil di undangan"],
    ...rows.map((r) => [waktu.format(new Date(r.dibuat)), r.nama, r.hadir ? "Hadir" : "Tidak hadir", r.ucapan, r.tamu ?? "", r.tampil ? "Ya" : "Disembunyikan"]),
  ];
  // BOM di depan supaya Excel membaca huruf non-latin dengan benar
  const isi = "﻿" + baris.map((b) => b.map(sel).join(",")).join("\r\n");

  return new Response(isi, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="buku-tamu-${slug}.csv"`,
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}
