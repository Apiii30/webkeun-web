import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { DemoBanner } from "@/components/demo-banner";
import { meilinKevin } from "@/undangan/contoh/meilin-kevin";
import { LAGU } from "@/undangan/lagu";
import { TemaOriental } from "@/undangan/tema/oriental";

export const metadata: Metadata = {
  title: "Template: Undangan Oriental Peony",
  robots: { index: false },
};

// Demo tema Oriental Peony dengan data contoh Mei Lin & Kevin (alamat lamanya dibelokkan ke sini, lihat next.config.ts)
export default function UndanganFaraAdityaOrientalPeony() {
  return (
    // --demo-h: tinggi bar demo, supaya navigasi & tombol undangan tidak tertutup
    <div style={{ "--demo-h": "3.75rem" } as CSSProperties}>
      <TemaOriental data={{ ...meilinKevin, musik: LAGU.penjagaHati }} />
      <DemoBanner name="Undangan Oriental Peony" compact />
    </div>
  );
}
