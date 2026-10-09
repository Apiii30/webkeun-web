import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { DemoBanner } from "@/components/demo-banner";
import { aisyahFauzan } from "@/undangan/contoh/pasangan";
import { LAGU } from "@/undangan/lagu";
import { TemaSakinah } from "@/undangan/tema/sakinah";

export const metadata: Metadata = {
  title: "Template: Undangan Putih Sakinah",
  robots: { index: false },
};

// Demo tema Putih Sakinah dengan data contoh Aisyah & Fauzan (alamat lamanya dibelokkan ke sini, lihat next.config.ts)
export default function UndanganFaraAdityaPutihSakinah() {
  return (
    // --demo-h: tinggi bar demo, supaya navigasi & tombol undangan tidak tertutup
    <div style={{ "--demo-h": "3.75rem" } as CSSProperties}>
      <TemaSakinah data={{ ...aisyahFauzan, musik: LAGU.anugerahTerindah }} />
      <DemoBanner name="Undangan Putih Sakinah" compact />
    </div>
  );
}
