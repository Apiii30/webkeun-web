import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { DemoBanner } from "@/components/demo-banner";
import { vaniaAdrian } from "@/undangan/contoh/pasangan";
import { LAGU } from "@/undangan/lagu";
import { TemaLuxury } from "@/undangan/tema/luxury";

export const metadata: Metadata = {
  title: "Template: Undangan Luxury",
  robots: { index: false },
};

// Demo tema Luxury dengan data contoh Vania & Adrian (alamat lamanya dibelokkan ke sini, lihat next.config.ts)
export default function UndanganFaraAdityaLuxury() {
  return (
    // --demo-h: tinggi bar demo, supaya navigasi & tombol undangan tidak tertutup
    <div style={{ "--demo-h": "3.75rem" } as CSSProperties}>
      <TemaLuxury data={{ ...vaniaAdrian, musik: LAGU.pernikahanKita }} />
      <DemoBanner name="Undangan Luxury" compact />
    </div>
  );
}
