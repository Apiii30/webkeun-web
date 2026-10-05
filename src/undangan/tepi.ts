import type { CSSProperties } from "react";

// Banyak ilustrasi bunga (hasil pindaian buku botani) terpotong lurus di tepi gambarnya: daun atau batang berhenti
// mendadak. Tepi itu dibuat memudar dengan mask supaya tidak terlihat "kepotong" di mana pun gambarnya diletakkan.
// tepi: huruf sisi yang terpotong, a = atas, b = bawah, k = kiri, n = kanan. lebar: panjang pudar (% sisi gambar).

export type Tepi = { tepi?: string; pudar?: number };

export function tepiPudar({ tepi, pudar = 16 }: Tepi): CSSProperties | undefined {
  if (!tepi) return undefined;
  const arah = (ke: string, awal: boolean, akhir: boolean) =>
    `linear-gradient(to ${ke}, ${awal ? `transparent, #000 ${pudar}%` : "#000, #000"}, ${akhir ? `#000 ${100 - pudar}%, transparent` : "#000"})`;
  const m = `${arah("right", tepi.includes("k"), tepi.includes("n"))}, ${arah("bottom", tepi.includes("a"), tepi.includes("b"))}`;
  return { maskImage: m, WebkitMaskImage: m, maskComposite: "intersect", WebkitMaskComposite: "source-in" };
}
