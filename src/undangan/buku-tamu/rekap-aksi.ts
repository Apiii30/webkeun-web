"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase";
import { bukaRekap } from "./rekap";

// Pengantin menyembunyikan / menampilkan lagi satu ucapan di undangan (misalnya ucapan iseng).
// Ucapan yang disembunyikan tetap tercatat di rekap & CSV.
export async function aturTampil(form: FormData) {
  const slug = String(form.get("slug") ?? "");
  const id = Number(form.get("id"));
  const tampil = form.get("tampil") === "1";
  if (!Number.isSafeInteger(id)) return;
  const akses = await bukaRekap(slug, form.get("kunci"));
  if (!akses || akses === "belum") return;

  const db = supabaseServer();
  const { error } = await db!.from("rsvp").update({ tampil }).eq("undangan", slug).eq("id", id);
  if (error) console.error("aturTampil", slug, id, error.message);
  revalidatePath(`/rekap/${slug}`);
}
