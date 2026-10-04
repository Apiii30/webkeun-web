import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { DemoBanner } from "@/components/demo-banner";
import { faraAditya } from "@/undangan/contoh/fara-aditya";
import { LAGU } from "@/undangan/lagu";
import { TemaPorselen } from "@/undangan/tema/porselen";

export const metadata: Metadata = {
  title: "Template: Undangan Biru Porselen",
  robots: { index: false },
};

// Demo tema Biru Porselen dengan data contoh Fara & Aditya
export default async function UndanganFaraAdityaBiruPorselen({ searchParams }: PageProps<"/template/undangan-fara-aditya-biru-porselen">) {
  const to = (await searchParams).to;
  const tamu = (Array.isArray(to) ? to[0] : to)?.slice(0, 60) || undefined;

  return (
    // --demo-h: tinggi bar demo, supaya navigasi & tombol undangan tidak tertutup
    <div style={{ "--demo-h": "3.75rem" } as CSSProperties}>
      <TemaPorselen data={{ ...faraAditya, musik: LAGU.bermuara }} tamu={tamu} />
      <DemoBanner name="Undangan Biru Porselen" compact />
    </div>
  );
}
