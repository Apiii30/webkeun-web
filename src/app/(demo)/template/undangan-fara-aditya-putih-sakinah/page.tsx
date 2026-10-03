import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { DemoBanner } from "@/components/demo-banner";
import { faraAditya } from "@/undangan/contoh/fara-aditya";
import { TemaSakinah } from "@/undangan/tema/sakinah";

export const metadata: Metadata = {
  title: "Template: Undangan Putih Sakinah",
  robots: { index: false },
};

// Demo tema Putih Sakinah dengan data contoh Fara & Aditya
export default async function UndanganFaraAdityaPutihSakinah({ searchParams }: PageProps<"/template/undangan-fara-aditya-putih-sakinah">) {
  const to = (await searchParams).to;
  const tamu = (Array.isArray(to) ? to[0] : to)?.slice(0, 60) || undefined;

  return (
    // --demo-h: tinggi bar demo, supaya navigasi & tombol undangan tidak tertutup
    <div style={{ "--demo-h": "3.75rem" } as CSSProperties}>
      <TemaSakinah data={faraAditya} tamu={tamu} />
      <DemoBanner name="Undangan Putih Sakinah" compact />
    </div>
  );
}
