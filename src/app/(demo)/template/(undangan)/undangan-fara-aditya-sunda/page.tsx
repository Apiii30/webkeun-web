import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { DemoBanner } from "@/components/demo-banner";
import { faraAditya } from "@/undangan/contoh/fara-aditya";
import { LAGU } from "@/undangan/lagu";
import { TemaSunda } from "@/undangan/tema/sunda";

export const metadata: Metadata = {
  title: "Template: Undangan Art Sunda",
  robots: { index: false },
};

// Demo tema Art Sunda dengan data contoh Fara & Aditya
export default function UndanganFaraAdityaSunda() {
  return (
    // --demo-h: tinggi bar demo, supaya navigasi & tombol undangan tidak tertutup
    <div style={{ "--demo-h": "3.75rem" } as CSSProperties}>
      <TemaSunda data={{ ...faraAditya, musik: LAGU.hinggaTuaBersama }} />
      <DemoBanner name="Undangan Art Sunda" compact />
    </div>
  );
}
