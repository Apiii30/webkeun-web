import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { DemoBanner } from "@/components/demo-banner";
import { senjaRaka } from "@/undangan/contoh/pasangan";
import { LAGU } from "@/undangan/lagu";
import { TemaRimba } from "@/undangan/tema/rimba";

export const metadata: Metadata = {
  title: "Template: Undangan Rimba",
  robots: { index: false },
};

// Demo tema Rimba dengan data contoh Senja & Raka (alamat lamanya dibelokkan ke sini, lihat next.config.ts)
export default function UndanganFaraAdityaRimba() {
  return (
    // --demo-h: tinggi bar demo, supaya navigasi & tombol undangan tidak tertutup
    <div style={{ "--demo-h": "3.75rem" } as CSSProperties}>
      <TemaRimba data={{ ...senjaRaka, musik: LAGU.nantiKitaSepertiIni }} />
      <DemoBanner name="Undangan Rimba" compact />
    </div>
  );
}
