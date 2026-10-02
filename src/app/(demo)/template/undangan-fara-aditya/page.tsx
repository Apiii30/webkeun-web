import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { DemoBanner } from "@/components/demo-banner";
import { faraAditya } from "@/undangan/contoh/fara-aditya";
import { TemaFloral } from "@/undangan/tema/floral";

export const metadata: Metadata = {
  title: "Template: Undangan Floral",
  robots: { index: false },
};

// Demo tema Floral: tema yang sama nanti dipakai pelanggan, cukup dengan data mereka sendiri
export default async function UndanganFaraAditya({ searchParams }: PageProps<"/template/undangan-fara-aditya">) {
  const to = (await searchParams).to;
  const tamu = (Array.isArray(to) ? to[0] : to)?.slice(0, 60) || undefined;

  return (
    // --demo-h: tinggi bar demo, supaya navigasi & tombol undangan tidak tertutup
    <div style={{ "--demo-h": "3.75rem" } as CSSProperties}>
      <TemaFloral data={faraAditya} tamu={tamu} />
      <DemoBanner name="Undangan Floral" compact />
    </div>
  );
}
