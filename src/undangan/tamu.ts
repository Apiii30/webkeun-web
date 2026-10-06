"use client";

import { useSyncExternalStore } from "react";

// Nama tamu dari link undangan (?to=Budi). Dibaca di browser, bukan di server: dengan begitu halaman undangan dibuat
// statis sekali saat build, jadi ringan & gratis di hosting (Cloudflare), sementara tiap tamu tetap disapa namanya.
// Di HTML statis (sebelum JavaScript jalan) nilainya undefined, jadi sesaat tampil sapaan umum.
const tanpaPerubahan = () => () => {};

export function useTamu(maks = 60) {
  return useSyncExternalStore(
    tanpaPerubahan,
    () => new URLSearchParams(location.search).get("to")?.trim().slice(0, maks) || undefined,
    () => undefined,
  );
}
