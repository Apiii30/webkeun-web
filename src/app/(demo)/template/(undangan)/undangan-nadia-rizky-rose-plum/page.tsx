import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { DemoBanner } from "@/components/demo-banner";
import { TemaFrisca } from "@/undangan/tema/frisca";

export const metadata: Metadata = {
  title: "Template: Undangan Rose Plum",
  robots: { index: false },
};

// Demo tema Rose Plum dengan data contoh Nadia & Rizky (src/undangan/tema/frisca/data.ts); alamat lamanya dibelokkan ke sini (next.config.ts)
export default function UndanganFriscaArif() {
  return (
    // --demo-h: tinggi bar demo, supaya navigasi & tombol undangan tidak tertutup
    <div style={{ "--demo-h": "3.75rem" } as CSSProperties}>
      <TemaFrisca />
      <DemoBanner name="Undangan Rose Plum" compact />
    </div>
  );
}
