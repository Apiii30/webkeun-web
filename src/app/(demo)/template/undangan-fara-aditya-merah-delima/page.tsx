import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { DemoBanner } from "@/components/demo-banner";
import { faraAditya } from "@/undangan/contoh/fara-aditya";
import { TemaDelima } from "@/undangan/tema/delima";

export const metadata: Metadata = {
  title: "Template: Undangan Merah Delima",
  robots: { index: false },
};

// Demo tema Merah Delima dengan data contoh Fara & Aditya
export default async function UndanganFaraAdityaMerahDelima({ searchParams }: PageProps<"/template/undangan-fara-aditya-merah-delima">) {
  const to = (await searchParams).to;
  const tamu = (Array.isArray(to) ? to[0] : to)?.slice(0, 60) || undefined;

  return (
    // --demo-h: tinggi bar demo, supaya navigasi & tombol undangan tidak tertutup
    <div style={{ "--demo-h": "3.75rem" } as CSSProperties}>
      <TemaDelima data={faraAditya} tamu={tamu} />
      <DemoBanner name="Undangan Merah Delima" compact />
    </div>
  );
}
