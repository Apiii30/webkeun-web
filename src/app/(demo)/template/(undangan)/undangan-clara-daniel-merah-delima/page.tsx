import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { DemoBanner } from "@/components/demo-banner";
import { claraDaniel } from "@/undangan/contoh/pasangan";
import { LAGU } from "@/undangan/lagu";
import { TemaDelima } from "@/undangan/tema/delima";

export const metadata: Metadata = {
  title: "Template: Undangan Merah Delima",
  robots: { index: false },
};

// Demo tema Merah Delima dengan data contoh Clara & Daniel (alamat lamanya dibelokkan ke sini, lihat next.config.ts)
export default function UndanganFaraAdityaMerahDelima() {
  return (
    // --demo-h: tinggi bar demo, supaya navigasi & tombol undangan tidak tertutup
    <div style={{ "--demo-h": "3.75rem" } as CSSProperties}>
      <TemaDelima data={{ ...claraDaniel, musik: LAGU.perfect }} />
      <DemoBanner name="Undangan Merah Delima" compact />
    </div>
  );
}
