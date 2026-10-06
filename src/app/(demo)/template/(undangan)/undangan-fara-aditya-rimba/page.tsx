import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { DemoBanner } from "@/components/demo-banner";
import { faraAditya } from "@/undangan/contoh/fara-aditya";
import { LAGU } from "@/undangan/lagu";
import { TemaRimba } from "@/undangan/tema/rimba";

export const metadata: Metadata = {
  title: "Template: Undangan Rimba",
  robots: { index: false },
};

// Demo tema Rimba dengan data contoh Fara & Aditya
export default function UndanganFaraAdityaRimba() {
  return (
    // --demo-h: tinggi bar demo, supaya navigasi & tombol undangan tidak tertutup
    <div style={{ "--demo-h": "3.75rem" } as CSSProperties}>
      <TemaRimba data={{ ...faraAditya, musik: LAGU.nantiKitaSepertiIni }} />
      <DemoBanner name="Undangan Rimba" compact />
    </div>
  );
}
