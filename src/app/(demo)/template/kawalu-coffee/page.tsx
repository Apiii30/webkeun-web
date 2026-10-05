import type { Metadata } from "next";
import { Bricolage_Grotesque, Caveat, Space_Mono } from "next/font/google";
import { DemoBanner } from "@/components/demo-banner";
import { Kawalu } from "./_isi/kawalu";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], axes: ["wdth", "opsz"], variable: "--font-bricolage" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-spacemono" });

export const metadata: Metadata = {
  title: "Template: Kawalu Coffee",
  description: "Template website UMKM kedai kopi: pembuka lanskap parallax, menu & harga, pesan antar, jual biji kopi, jam buka live, dan peta.",
  robots: { index: false },
};

export default function KawaluCoffee() {
  return (
    <div
      className={`${bricolage.variable} ${caveat.variable} ${spaceMono.variable} min-h-screen bg-[#f3ead8] font-[family-name:var(--font-bricolage)] text-[#22140e] antialiased selection:bg-[#c3312b] selection:text-[#f3ead8]`}
    >
      <Kawalu />
      <DemoBanner name="Kawalu Coffee" />
    </div>
  );
}
