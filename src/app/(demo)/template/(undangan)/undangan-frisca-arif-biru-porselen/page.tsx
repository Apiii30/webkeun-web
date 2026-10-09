import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { DemoBanner } from "@/components/demo-banner";
import { friscaArif } from "@/undangan/contoh/pasangan";
import { LAGU } from "@/undangan/lagu";
import { TemaPorselen } from "@/undangan/tema/porselen";

export const metadata: Metadata = {
  title: "Template: Undangan Biru Porselen",
  robots: { index: false },
};

// Demo tema Biru Porselen dengan data Frisca & Arif (alamat lamanya dibelokkan ke sini, lihat next.config.ts)
export default function UndanganFaraAdityaBiruPorselen() {
  return (
    // --demo-h: tinggi bar demo, supaya navigasi & tombol undangan tidak tertutup
    <div style={{ "--demo-h": "3.75rem" } as CSSProperties}>
      <TemaPorselen data={{ ...friscaArif, musik: LAGU.bermuara }} />
      <DemoBanner name="Undangan Biru Porselen" compact />
    </div>
  );
}
