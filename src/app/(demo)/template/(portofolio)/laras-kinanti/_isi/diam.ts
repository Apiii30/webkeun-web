"use client";

import { useSyncExternalStore } from "react";

// true kalau pengunjung memilih "kurangi gerakan". Saat hydrate memakai nilai server (false) dulu, lalu
// menyesuaikan, jadi HTML server & klien tetap cocok (useReducedMotion bawaan motion langsung membaca
// matchMedia di render pertama dan bikin hydration mismatch).
const kueri = "(prefers-reduced-motion: reduce)";
const ikut = (cb: () => void) => {
  const mq = matchMedia(kueri);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
export function useDiam() {
  return useSyncExternalStore(ikut, () => matchMedia(kueri).matches, () => false);
}
