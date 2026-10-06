import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { DemoBanner } from "@/components/demo-banner";
import { TemaFrisca } from "@/undangan/tema/frisca";

export const metadata: Metadata = {
  title: "Template: Undangan Frisca & Arif",
  robots: { index: false },
};

// Demo undangan Frisca & Arif (undangan pertama yang dibuat), memakai datanya sendiri
export default function UndanganFriscaArif() {
  return (
    // --demo-h: tinggi bar demo, supaya navigasi & tombol undangan tidak tertutup
    <div style={{ "--demo-h": "3.75rem" } as CSSProperties}>
      <TemaFrisca />
      <DemoBanner name="Undangan Frisca & Arif" compact />
    </div>
  );
}
