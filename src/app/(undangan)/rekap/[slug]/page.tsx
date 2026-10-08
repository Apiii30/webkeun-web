import type { Metadata } from "next";
import { RekapApp } from "@/undangan/buku-tamu/rekap-app";
import { notFound } from "next/navigation";
import { ambilBalasan, ambilDaftarTamu, bukaRekap } from "@/undangan/buku-tamu/rekap";

// Halaman rekap untuk pengantin: kirim undangan ke tiap tamu lewat WhatsApp (daftar tamu tersimpan di database),
// pantau kehadiran, kelola ucapan, dan unduh CSV. Isinya di src/undangan/buku-tamu/rekap-app.tsx.
// Dibuka lewat /rekap/<slug>?kunci=<kunci>; kunci dibuat saat undangan didaftarkan (supabase/daftar-undangan.sql).

export const metadata: Metadata = {
  title: { absolute: "Rekap undangan · Webkeun" },
  robots: { index: false, follow: false },
  // kunci ada di alamat halaman: jangan sampai ikut terkirim ke situs lain lewat Referer
  referrer: "no-referrer",
};

export default async function RekapPage({ params, searchParams }: PageProps<"/rekap/[slug]">) {
  const { slug } = await params;
  const k = (await searchParams).kunci;
  const kunci = Array.isArray(k) ? k[0] : k;
  const akses = await bukaRekap(slug, kunci);

  if (akses === "belum") {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
        <p className="rounded-3xl bg-lilac-soft p-6 text-ink/70">
          Buku tamu belum tersambung ke database. Isi <code>SUPABASE_URL</code> dan <code>SUPABASE_SECRET_KEY</code> dulu.
        </p>
      </main>
    );
  }
  if (!akses || !kunci) notFound();

  const [balasan, daftar] = await Promise.all([ambilBalasan(slug), ambilDaftarTamu(slug)]);

  return (
    <RekapApp
      slug={slug}
      kunci={kunci}
      nama={akses.nama}
      tamuAwal={typeof daftar === "string" ? daftar : daftar.tamu}
      pesanAwal={typeof daftar === "string" ? null : daftar.pesan}
      balasanAwal={balasan}
    />
  );
}
