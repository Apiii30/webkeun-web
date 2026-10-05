import type { Metadata } from "next";
import { faraAditya } from "@/undangan/contoh/fara-aditya";
import { BukuTamu } from "@/undangan/buku-tamu";
import { LAGU } from "@/undangan/lagu";
import { TemaRimba } from "@/undangan/tema/rimba";

// Undangan sungguhan (bukan demo): RSVP & ucapan tamu tersimpan di Supabase.
// Alamatnya /u/<slug>?to=<nama tamu>; link per tamu dibuat di /rekap/<slug>?kunci=...
//
// Membuat undangan baru: salin folder ini ke /u/<slug-baru>, ganti data & tema, lalu daftarkan slug-nya
// di Supabase (supabase/daftar-undangan.sql). Tanpa didaftarkan, ucapan tamu ditolak.
//
// Sementara ini: uji coba buku tamu dengan data contoh Fara & Aditya dan tema Rimba.

const SLUG = "uji-coba";
const data = { ...faraAditya, musik: LAGU.nantiKitaSepertiIni };
const pasangan = `${data.wanita.panggilan} & ${data.pria.panggilan}`;

export const metadata: Metadata = {
  title: { absolute: `The Wedding of ${pasangan}` },
  description: `${data.tanggal} · ${data.kota}. Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir di hari bahagia kami.`,
  openGraph: { title: `The Wedding of ${pasangan}`, description: `${data.tanggal} · ${data.kota}`, images: [data.foto.sampul] },
  // undangan pribadi: jangan muncul di Google
  robots: { index: false, follow: false },
};

export default async function UndanganUjiCoba({ searchParams }: PageProps<"/u/uji-coba">) {
  const to = (await searchParams).to;
  const tamu = (Array.isArray(to) ? to[0] : to)?.trim().slice(0, 60) || undefined;

  return (
    <BukuTamu slug={SLUG} tamu={tamu}>
      <TemaRimba data={data} tamu={tamu} />
    </BukuTamu>
  );
}
