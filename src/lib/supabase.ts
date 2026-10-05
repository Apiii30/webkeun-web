import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Koneksi Supabase untuk kode server saja (server action, route handler, halaman server).
// Memakai secret key (sb_secret_...), yang melewati RLS, jadi file ini tidak boleh diimpor dari komponen klien;
// paket "server-only" menggagalkan build kalau itu terjadi.
// Isi SUPABASE_URL & SUPABASE_SECRET_KEY di .env.local (lokal) dan di Environment Variables Vercel.
// Kalau belum diisi, fungsi ini mengembalikan null dan buku tamu menampilkan pesan "belum tersambung".

let klien: SupabaseClient | null | undefined;

export function supabaseServer() {
  if (klien !== undefined) return klien;
  const url = process.env.SUPABASE_URL;
  const kunci = process.env.SUPABASE_SECRET_KEY;
  klien = url && kunci ? createClient(url, kunci, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  return klien;
}
