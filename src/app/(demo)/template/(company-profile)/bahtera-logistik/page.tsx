import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { DemoBanner } from "@/components/demo-banner";
import { Bahtera } from "./_isi/bahtera";

// Saira Stencil (Google Fonts, lisensi SIL OFL), subset latin, variabel wght 100–900. Disimpan lokal karena
// next/font/google tidak punya data metrik font ini dan selalu memunculkan peringatan "Failed to find font override values".
const stensil = localFont({ src: "./_isi/saira-stencil.woff2", weight: "100 900", variable: "--font-stensil" });
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
