"use server";

import { supabaseServer } from "@/lib/supabase";
import { rapikanNama, rapikanWa } from "./nomor";
import { bukaRekap, type TamuUndangan } from "./rekap";

// Aksi halaman rekap pengantin. Semuanya memeriksa kunci rekap dulu, jadi hanya pemegang link rekap yang bisa
// mengubah data. Dipanggil dari komponen klien rekap; tampilannya diperbarui di browser tanpa memuat ulang halaman.

type Hasil<T> = { ok: true; data: T } | { ok: false; pesan: string };

const GAGAL = "Gagal menyimpan. Periksa koneksi internet, lalu coba lagi.";
const MAKS_TAMU = 2000;
const KOLOM = "id, nama, wa, terkirim";

async function izin(slug: string, kunci: string) {
  const akses = await bukaRekap(slug, kunci);
  return akses && akses !== "belum" ? supabaseServer() : null;
}

// Pengantin menyembunyikan / menampilkan lagi satu ucapan di undangan (misalnya ucapan iseng).
// Ucapan yang disembunyikan tetap tercatat di rekap & CSV.
export async function ubahTampil(slug: string, kunci: string, id: number, tampil: boolean): Promise<boolean> {
  const db = await izin(slug, kunci);
  if (!db || !Number.isSafeInteger(id)) return false;
  const { error } = await db.from("rsvp").update({ tampil: !!tampil }).eq("undangan", slug).eq("id", id);
  if (error) console.error("ubahTampil", slug, id, error.message);
  return !error;
}

// Tambah satu atau banyak tamu sekaligus. Nama yang sudah ada (huruf besar-kecil sama) dilewati.
export async function tambahTamu(slug: string, kunci: string, baris: { nama: string; wa: string }[]): Promise<Hasil<{ baru: TamuUndangan[]; dilewati: number }>> {
  const db = await izin(slug, kunci);
  if (!db) return { ok: false, pesan: "Akses rekap tidak valid. Buka lagi link rekap dari Webkeun." };
  if (!Array.isArray(baris) || !baris.length) return { ok: false, pesan: "Belum ada nama tamu." };

  const unik = new Map<string, { undangan: string; nama: string; wa: string }>();
  for (const b of baris.slice(0, MAKS_TAMU)) {
    const nama = rapikanNama(String(b?.nama ?? ""));
    if (nama && !unik.has(nama.toLowerCase())) unik.set(nama.toLowerCase(), { undangan: slug, nama, wa: rapikanWa(String(b?.wa ?? "")) ?? "" });
  }
  if (!unik.size) return { ok: false, pesan: "Belum ada nama tamu." };

  const { count } = await db.from("tamu").select("id", { count: "exact", head: true }).eq("undangan", slug);
  if ((count ?? 0) + unik.size > MAKS_TAMU) return { ok: false, pesan: `Maksimal ${MAKS_TAMU} tamu per undangan.` };

  const { data, error } = await db
    .from("tamu")
    .upsert([...unik.values()], { onConflict: "undangan,nama_kecil", ignoreDuplicates: true })
    .select(KOLOM);
  if (error) {
    console.error("tambahTamu", slug, error.message);
    return { ok: false, pesan: GAGAL };
  }
  return { ok: true, data: { baru: data, dilewati: unik.size - data.length } };
}

export async function ubahTamu(slug: string, kunci: string, id: number, isi: { nama: string; wa: string }): Promise<Hasil<TamuUndangan>> {
  const db = await izin(slug, kunci);
  if (!db || !Number.isSafeInteger(id)) return { ok: false, pesan: GAGAL };
  const nama = rapikanNama(String(isi?.nama ?? ""));
  const wa = rapikanWa(String(isi?.wa ?? ""));
  if (!nama) return { ok: false, pesan: "Nama tamu tidak boleh kosong." };
  if (wa === null) return { ok: false, pesan: "Nomor WhatsApp-nya kurang tepat. Contoh: 0812 3456 7890" };

  const { data, error } = await db.from("tamu").update({ nama, wa }).eq("undangan", slug).eq("id", id).select(KOLOM).single();
  if (error) {
    if (error.code === "23505") return { ok: false, pesan: `"${nama}" sudah ada di daftar.` };
    console.error("ubahTamu", slug, id, error.message);
    return { ok: false, pesan: GAGAL };
  }
  return { ok: true, data };
}

export async function hapusTamu(slug: string, kunci: string, id: number): Promise<boolean> {
  const db = await izin(slug, kunci);
  if (!db || !Number.isSafeInteger(id)) return false;
  const { error } = await db.from("tamu").delete().eq("undangan", slug).eq("id", id);
  if (error) console.error("hapusTamu", slug, id, error.message);
  return !error;
}

// Dipanggil saat tombol kirim WhatsApp ditekan (terkirim = sekarang), atau saat pengantin menandai ulang statusnya.
export async function tandaiTerkirim(slug: string, kunci: string, id: number, terkirim: boolean): Promise<Hasil<string | null>> {
  const db = await izin(slug, kunci);
  if (!db || !Number.isSafeInteger(id)) return { ok: false, pesan: GAGAL };
  const waktu = terkirim ? new Date().toISOString() : null;
  const { error } = await db.from("tamu").update({ terkirim: waktu }).eq("undangan", slug).eq("id", id);
  if (error) {
    console.error("tandaiTerkirim", slug, id, error.message);
    return { ok: false, pesan: GAGAL };
  }
  return { ok: true, data: waktu };
}

// Teks pesan WhatsApp milik pengantin; null = kembali ke teks bawaan
export async function simpanPesan(slug: string, kunci: string, pesan: string | null): Promise<boolean> {
  const db = await izin(slug, kunci);
  if (!db) return false;
  const teks = pesan === null ? null : String(pesan).slice(0, 2000);
  const { error } = await db.from("undangan").update({ pesan: teks }).eq("slug", slug);
  if (error) console.error("simpanPesan", slug, error.message);
  return !error;
}
