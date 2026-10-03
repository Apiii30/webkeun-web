import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { DemoBanner } from "@/components/demo-banner";
import { faraAditya } from "@/undangan/contoh/fara-aditya";
import { TemaJawa } from "@/undangan/tema/jawa";

export const metadata: Metadata = {
  title: "Template: Undangan Jawa Klasik",
  robots: { index: false },
};

// Demo tema Jawa Klasik dengan data contoh Fara & Aditya
export default async function UndanganFaraAdityaJawa({ searchParams }: PageProps<"/template/undangan-fara-aditya-jawa">) {
  const to = (await searchParams).to;
  const tamu = (Array.isArray(to) ? to[0] : to)?.slice(0, 60) || undefined;

  return (
    // --demo-h: tinggi bar demo, supaya navigasi & tombol undangan tidak tertutup
    <div style={{ "--demo-h": "3.75rem" } as CSSProperties}>
      <TemaJawa data={faraAditya} tamu={tamu} />
      <DemoBanner name="Undangan Jawa Klasik" compact />
    </div>
  );
}
