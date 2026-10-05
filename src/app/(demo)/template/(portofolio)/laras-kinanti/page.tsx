import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import { DemoBanner } from "@/components/demo-banner";
import { Laras } from "./_isi/laras";

// Big Shoulders (Google Fonts, lisensi SIL OFL), subset latin, variabel wght 100–900 + opsz. Disimpan lokal karena
// next/font/google tidak punya data metrik font ini dan selalu memunculkan peringatan "Failed to find font override values".
const bahu = localFont({ src: "./_isi/big-shoulders.woff2", weight: "100 900", variable: "--font-bahu" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument" });
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-isans" });
const plex = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex" });

export const metadata: Metadata = {
  title: "Template: Laras Kinanti",
  description: "Template portofolio fotografer: pembuka parallax, seri foto bertumpuk, rol film horizontal, dan daftar harga.",
  robots: { index: false },
};

export default function LarasKinanti() {
  return (
    <div
      className={`${bahu.variable} ${instrument.variable} ${sans.variable} ${plex.variable} min-h-screen bg-[#ece5d8] font-[family-name:var(--font-isans)] text-[#16130f] antialiased selection:bg-[#c9361f] selection:text-[#ece5d8]`}
    >
      <Laras />
      <DemoBanner name="Laras Kinanti" />
    </div>
  );
}
