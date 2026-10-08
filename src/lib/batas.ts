import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";

// Pembatas jumlah kiriman per pengunjung (alamat IP), memakai Rate Limiting bawaan Cloudflare Workers
// (binding "ratelimits" di wrangler.jsonc). Hitungannya per lokasi server Cloudflare dan sengaja longgar, cukup untuk
// menahan orang iseng yang membanjiri buku tamu. Saat `npm run dev` (bukan di Cloudflare) atau kalau binding-nya
// tidak ada, semua kiriman dibolehkan.

type Pembatas = { limit(o: { key: string }): Promise<{ success: boolean }> };

export async function dalamBatas(binding: "BATAS_UCAPAN"): Promise<boolean> {
  let pembatas: Pembatas | undefined;
  try {
    pembatas = (getCloudflareContext().env as unknown as Record<string, Pembatas | undefined>)[binding];
  } catch {
    return true;
  }
  if (!pembatas) return true;
  const ip = (await headers()).get("cf-connecting-ip") ?? "tanpa-ip";
  try {
    return (await pembatas.limit({ key: ip })).success;
  } catch (e) {
    console.error("dalamBatas", binding, e);
    return true;
  }
}
