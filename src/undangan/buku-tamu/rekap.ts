import "server-only";
import { timingSafeEqual } from "node:crypto";
import { supabaseServer } from "@/lib/supabase";

// Akses halaman rekap pengantin (/rekap/<slug>?kunci=...): dipakai halaman rekap, unduhan CSV, dan aksi sembunyikan ucapan.

export type BalasanTamu = {
  id: number;
  nama: string;
  hadir: boolean;
  ucapan: string;
  tamu: string | null;
  tampil: boolean;
  dibuat: string;
};

const SLUG = /^[a-z0-9-]{3,60}$/;

function samaPersis(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

// "belum": Supabase belum disambungkan. null: slug tidak ada atau kunci salah (diperlakukan sama, supaya
// orang luar tidak bisa menebak slug mana yang terdaftar).
export async function bukaRekap(slug: string, kunci: unknown): Promise<{ nama: string } | null | "belum"> {
  const db = supabaseServer();
  if (!db) return "belum";
  if (!SLUG.test(slug) || typeof kunci !== "string" || !kunci) return null;
  const { data, error } = await db.from("undangan").select("nama, kunci").eq("slug", slug).maybeSingle();
  if (error) {
    console.error("bukaRekap", slug, error.message);
    return null;
  }
  return data && samaPersis(data.kunci, kunci) ? { nama: data.nama } : null;
}

export async function ambilBalasan(slug: string): Promise<BalasanTamu[]> {
  const db = supabaseServer();
  if (!db) return [];
  const { data, error } = await db
    .from("rsvp")
    .select("id, nama, hadir, ucapan, tamu, tampil, dibuat")
    .eq("undangan", slug)
    .order("id", { ascending: false })
    .limit(5000);
  if (error) {
    console.error("ambilBalasan", slug, error.message);
    return [];
  }
  return data;
}
