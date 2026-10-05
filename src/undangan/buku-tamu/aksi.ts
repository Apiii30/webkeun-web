"use server";

import { supabaseServer } from "@/lib/supabase";

// Server action buku tamu: dipanggil dari form RSVP di undangan sungguhan (/u/<slug>).
// Server action bisa dipanggil siapa saja yang tahu alamatnya, jadi semua isian divalidasi ulang di sini
// (database juga punya batasan yang sama sebagai lapis kedua).

export type UcapanTamu = { id: number; nama: string; hadir: boolean; ucapan: string; dibuat: string };
export type HasilKirim = { ok: true; ucapan: UcapanTamu } | { ok: false; pesan: string };

const SLUG = /^[a-z0-9-]{3,60}$/;
const BATAS = 300; // ucapan terbaru yang ditampilkan di undangan
const BELUM = "Buku tamu belum tersambung. Coba lagi nanti ya.";

const rapikan = (s: unknown, maks: number) => (typeof s === "string" ? s.replace(/\s+/g, " ").trim().slice(0, maks) : "");
// pola ilike yang mencocokkan teks persis: \ % _ di-escape. Tanda * tidak bisa di-escape (PostgREST selalu
// membacanya sebagai wildcard), jadi dibuang dari nama sejak awal.
const persis = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);

export async function ambilUcapan(slug: string): Promise<UcapanTamu[]> {
  const db = supabaseServer();
  if (!db || !SLUG.test(slug)) return [];
  const { data, error } = await db
    .from("rsvp")
    .select("id, nama, hadir, ucapan, dibuat")
    .eq("undangan", slug)
    .eq("tampil", true)
    .order("id", { ascending: false })
    .limit(BATAS);
  if (error) {
    console.error("ambilUcapan", slug, error.message);
    return [];
  }
  return data;
}

export async function kirimUcapan(slug: string, isi: { nama: unknown; hadir: unknown; ucapan: unknown; tamu?: unknown }): Promise<HasilKirim> {
  const db = supabaseServer();
  if (!db) return { ok: false, pesan: BELUM };
  if (!SLUG.test(slug)) return { ok: false, pesan: "Undangan tidak ditemukan." };

  const nama = rapikan(isi.nama, 80).replace(/\*/g, "").trim();
  // ucapan boleh beberapa baris, jadi cukup dipangkas (spasi di dalamnya tidak dirapikan)
  const ucapan = typeof isi.ucapan === "string" ? isi.ucapan.trim().slice(0, 600) : "";
  const tamu = rapikan(isi.tamu, 80) || null;
  if (!nama) return { ok: false, pesan: "Nama belum diisi." };
  if (!ucapan) return { ok: false, pesan: "Tulis ucapan & doa dulu ya." };
  if (typeof isi.hadir !== "boolean") return { ok: false, pesan: "Pilih hadir atau tidak hadir dulu." };

  // satu nama satu ucapan per undangan (huruf besar-kecil dianggap sama)
  const { count, error: galatCek } = await db
    .from("rsvp")
    .select("id", { count: "exact", head: true })
    .eq("undangan", slug)
    .ilike("nama", persis(nama));
  if (galatCek) {
    console.error("kirimUcapan cek", slug, galatCek.message);
    return { ok: false, pesan: "Ucapan gagal terkirim. Coba lagi ya." };
  }
  if (count) return { ok: false, pesan: `Ucapan atas nama ${nama} sudah pernah terkirim. Terima kasih!` };

  const { data, error } = await db
    .from("rsvp")
    .insert({ undangan: slug, nama, hadir: isi.hadir, ucapan, tamu })
    .select("id, nama, hadir, ucapan, dibuat")
    .single();
  if (error) {
    console.error("kirimUcapan", slug, error.code, error.message);
    // 23503: slug belum terdaftar di tabel undangan
    return { ok: false, pesan: error.code === "23503" ? "Undangan tidak ditemukan." : "Ucapan gagal terkirim. Coba lagi ya." };
  }
  return { ok: true, ucapan: data };
}
