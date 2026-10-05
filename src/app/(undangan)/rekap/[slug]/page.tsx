import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { PembuatLink } from "@/undangan/buku-tamu/pembuat-link";
import { ambilBalasan, bukaRekap } from "@/undangan/buku-tamu/rekap";
import { aturTampil } from "@/undangan/buku-tamu/rekap-aksi";

// Halaman rekap untuk pengantin: siapa saja yang hadir, ucapan tamu, unduh CSV, dan pembuat link per tamu.
// Dibuka lewat /rekap/<slug>?kunci=<kunci>; kunci dibuat saat undangan didaftarkan (supabase/daftar-undangan.sql).

export const metadata: Metadata = {
  title: { absolute: "Rekap buku tamu · Webkeun" },
  robots: { index: false, follow: false },
  // kunci ada di alamat halaman: jangan sampai ikut terkirim ke situs lain lewat Referer
  referrer: "no-referrer",
};

const waktu = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" });

export default async function RekapPage({ params, searchParams }: PageProps<"/rekap/[slug]">) {
  const { slug } = await params;
  const k = (await searchParams).kunci;
  const kunci = Array.isArray(k) ? k[0] : k;
  const akses = await bukaRekap(slug, kunci);

  if (akses === "belum") {
    return (
      <Kerangka>
        <p className="rounded-3xl bg-lilac-soft p-6 text-ink/70">
          Buku tamu belum tersambung ke database. Isi <code>SUPABASE_URL</code> dan <code>SUPABASE_SECRET_KEY</code> dulu.
        </p>
      </Kerangka>
    );
  }
  if (!akses || !kunci) notFound();

  const balasan = await ambilBalasan(slug);
  const hadir = balasan.filter((b) => b.hadir).length;
  const angka = [
    { label: "Balasan", nilai: balasan.length },
    { label: "Hadir", nilai: hadir },
    { label: "Tidak hadir", nilai: balasan.length - hadir },
  ];
  const kunciUrl = encodeURIComponent(kunci);

  return (
    <Kerangka>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold tracking-[0.14em] text-brand uppercase">Rekap buku tamu</p>
          <h1 className="mt-1 text-3xl font-bold tracking-[-0.02em] sm:text-4xl">{akses.nama}</h1>
        </div>
        <a href={`/u/${slug}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand underline underline-offset-4">
          Buka undangan
        </a>
      </div>

      <dl className="mt-6 grid grid-cols-3 gap-3">
        {angka.map((a) => (
          <div key={a.label} className="rounded-3xl bg-lilac-soft p-4 sm:p-5">
            <dt className="text-sm text-ink/60">{a.label}</dt>
            <dd className="mt-1 text-3xl font-bold tabular-nums">{a.nilai}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-10">
        <h2 className="text-xl font-bold">Buat link untuk tiap tamu</h2>
        <p className="mt-1 mb-4 text-ink/60">Nama tamu akan tertulis di undangannya. Kirim lewat WhatsApp satu per satu, atau unduh semuanya sebagai CSV.</p>
        <PembuatLink slug={slug} sudah={balasan.flatMap((b) => (b.tamu ? [b.tamu] : []))} />
      </section>

      <section className="mt-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Balasan tamu</h2>
          {balasan.length > 0 && (
            <a href={`/rekap/${slug}/csv?kunci=${kunciUrl}`} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink/85">
              Unduh CSV
            </a>
          )}
        </div>
        {balasan.length === 0 ? (
          <p className="mt-4 rounded-3xl bg-lilac-soft p-6 text-center text-ink/60">Belum ada balasan. Setelah tamu mengisi RSVP, namanya muncul di sini.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {balasan.map((b) => (
              <li key={b.id} className={`rounded-2xl p-4 ring-1 ring-ink/10 ${b.tampil ? "" : "bg-ink/[0.03] opacity-70"}`}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="font-semibold">{b.nama}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${b.hadir ? "bg-mint/25 text-[#0f7a63]" : "bg-[#fadde4] text-[#b0415b]"}`}>
                    {b.hadir ? "Hadir" : "Tidak hadir"}
                  </span>
                  {b.tamu && b.tamu.toLowerCase() !== b.nama.toLowerCase() && <span className="text-xs text-ink/50">dari link: {b.tamu}</span>}
                  <span className="ml-auto text-xs text-ink/50">{waktu.format(new Date(b.dibuat))}</span>
                </div>
                {b.ucapan && <p className="mt-2 whitespace-pre-line text-ink/75">{b.ucapan}</p>}
                <form action={aturTampil} className="mt-2">
                  <input type="hidden" name="slug" value={slug} />
                  <input type="hidden" name="kunci" value={kunci} />
                  <input type="hidden" name="id" value={b.id} />
                  <input type="hidden" name="tampil" value={b.tampil ? "0" : "1"} />
                  <button type="submit" className="text-xs font-semibold text-ink/55 underline underline-offset-2 hover:text-brand">
                    {b.tampil ? "Sembunyikan dari undangan" : "Tampilkan lagi di undangan"}
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Kerangka>
  );
}

function Kerangka({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <Image src="/brand/logo-wk.svg" alt="Webkeun" width={42} height={30} className="mb-8" />
      {children}
    </main>
  );
}
