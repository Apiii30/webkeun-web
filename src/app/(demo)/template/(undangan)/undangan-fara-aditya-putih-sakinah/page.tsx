import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { DemoBanner } from "@/components/demo-banner";
import { faraAditya } from "@/undangan/contoh/fara-aditya";
import { LAGU } from "@/undangan/lagu";
import { TemaSakinah } from "@/undangan/tema/sakinah";

export const metadata: Metadata = {
  title: "Template: Undangan Putih Sakinah",
  robots: { index: false },
};

// Demo tema Putih Sakinah dengan data contoh Fara & Aditya
export default function UndanganFaraAdityaPutihSakinah() {
  return (
    // --demo-h: tinggi bar demo, supaya navigasi & tombol undangan tidak tertutup
    <div style={{ "--demo-h": "3.75rem" } as CSSProperties}>
      <TemaSakinah data={{ ...faraAditya, musik: LAGU.anugerahTerindah }} />
      <DemoBanner name="Undangan Putih Sakinah" compact />
    </div>
  );
}
