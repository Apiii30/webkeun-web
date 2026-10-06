import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { DemoBanner } from "@/components/demo-banner";
import { faraAditya } from "@/undangan/contoh/fara-aditya";
import { LAGU } from "@/undangan/lagu";
import { TemaGarden } from "@/undangan/tema/garden";

export const metadata: Metadata = {
  title: "Template: Undangan Garden Premium",
  robots: { index: false },
};

// Demo tema Garden Premium dengan data contoh Fara & Aditya
export default function UndanganFaraAdityaGardenPremium() {
  return (
    // --demo-h: tinggi bar demo, supaya navigasi & tombol undangan tidak tertutup
    <div style={{ "--demo-h": "3.75rem" } as CSSProperties}>
      <TemaGarden data={{ ...faraAditya, musik: LAGU.theWayYouLookAtMe }} />
      <DemoBanner name="Undangan Garden Premium" compact />
    </div>
  );
}
