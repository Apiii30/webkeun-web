"use client";

import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from "react";
import { ambilUcapan, kirimUcapan, type UcapanTamu } from "./aksi";

// Buku tamu (RSVP & ucapan) yang dipakai bersama semua tema.
// - Di undangan sungguhan, halaman membungkus temanya dengan <BukuTamu slug=...>: ucapan dibaca & disimpan
//   di Supabase lewat server action.
// - Di demo (/template/...), tidak ada pembungkus: tema memakai ucapan contoh dan kiriman hanya tampil sementara.

export type Surat = { id: number; name: string; hadir: boolean; message: string; waktu: string };

const Konteks = createContext<{ slug: string; tamu?: string } | null>(null);

export function BukuTamu({ slug, tamu, children }: { slug: string; tamu?: string; children: ReactNode }) {
  return <Konteks.Provider value={{ slug, tamu }}>{children}</Konteks.Provider>;
}

// "Baru saja", "5 menit lalu", "3 hari lalu", lalu tanggal
function kapan(iso: string, baruSaja: string) {
  const detik = (Date.now() - Date.parse(iso)) / 1000;
  if (detik < 60) return baruSaja;
  if (detik < 3600) return `${Math.floor(detik / 60)} menit lalu`;
  if (detik < 86400) return `${Math.floor(detik / 3600)} jam lalu`;
  if (detik < 7 * 86400) return `${Math.floor(detik / 86400)} hari lalu`;
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

const jadiSurat = (u: UcapanTamu, baruSaja: string): Surat => ({
  id: u.id,
  name: u.nama,
  hadir: u.hadir,
  message: u.ucapan,
  waktu: kapan(u.dibuat, baruSaja),
});

// contoh: ucapan contoh untuk demo. baruSaja: label waktu untuk kiriman baru (tema Sunda memakai "Nembe pisan").
// kirim() mengembalikan true kalau berhasil; kalau gagal, pesannya ada di `galat`.
export function useBukuTamu(contoh: Surat[], baruSaja = "Baru saja") {
  const k = useContext(Konteks);
  const [letters, setLetters] = useState<Surat[]>(k ? [] : contoh);
  const [mengirim, setMengirim] = useState(false);
  const [galat, setGalat] = useState("");
  const idDemo = useRef(contoh.length + 1);
  const sibuk = useRef(false); // penjaga klik ganda (state baru terbaca di render berikutnya)
  const slug = k?.slug;

  useEffect(() => {
    if (!slug) return;
    let batal = false;
    ambilUcapan(slug).then((rows) => {
      if (!batal) setLetters(rows.map((u) => jadiSurat(u, baruSaja)));
    });
    return () => {
      batal = true;
    };
  }, [slug, baruSaja]);

  async function kirim(name: string, hadir: boolean, message: string) {
    if (sibuk.current) return false;
    setGalat("");
    if (!k) {
      setLetters((l) => [{ id: idDemo.current++, name, hadir, message, waktu: baruSaja }, ...l]);
      return true;
    }
    sibuk.current = true;
    setMengirim(true);
    try {
      const hasil = await kirimUcapan(k.slug, { nama: name, hadir, ucapan: message, tamu: k.tamu });
      if (!hasil.ok) {
        setGalat(hasil.pesan);
        return false;
      }
      setLetters((l) => [jadiSurat(hasil.ucapan, baruSaja), ...l]);
      return true;
    } catch {
      setGalat("Koneksi terputus. Coba kirim lagi ya.");
      return false;
    } finally {
      sibuk.current = false;
      setMengirim(false);
    }
  }

  return { letters, kirim, mengirim, galat };
}
