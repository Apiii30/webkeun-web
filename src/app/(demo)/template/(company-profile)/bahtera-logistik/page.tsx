import type { Metadata } from "next";
import { Archivo, JetBrains_Mono, Saira_Stencil } from "next/font/google";
import { DemoBanner } from "@/components/demo-banner";
import { Bahtera } from "./_isi/bahtera";

const stensil = Saira_Stencil({ subsets: ["latin"], variable: "--font-stensil" });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Template: Bahtera Lintas Nusantara",
  description: "Template company profile perusahaan logistik: pintu kontainer yang terbuka, peta rute, layanan bertumpuk, armada, lacak kiriman, dan form penawaran.",
  robots: { index: false },
};

export default function BahteraLogistik() {
  return (
    <div
      className={`${stensil.variable} ${archivo.variable} ${jetbrains.variable} min-h-screen bg-[#eeeae1] font-[family-name:var(--font-archivo)] text-[#10213a] antialiased selection:bg-[#f2b33d] selection:text-[#10213a]`}
    >
      <Bahtera />
      <DemoBanner name="Bahtera Lintas Nusantara" />
    </div>
  );
}
