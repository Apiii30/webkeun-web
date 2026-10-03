"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const subscribe = () => () => {};

/**
 * Render isi ke #fr-lapis (di akar tema, di luar elemen yang dianimasikan). Wajib untuk overlay `position: fixed`
 * (modal, lightbox): jika ada leluhur yang memakai transform (animasi scroll), fixed akan menempel ke leluhur itu,
 * bukan ke layar. Bukan langsung ke <body> supaya variabel font tema tetap berlaku.
 */
export function Portal({ children }: { children: React.ReactNode }) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const el = mounted ? (document.getElementById("fr-lapis") ?? document.body) : null;
  return el ? createPortal(children, el) : null;
}
