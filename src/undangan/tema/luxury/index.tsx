import { Bodoni_Moda, Manrope, Monsieur_La_Doulaise } from "next/font/google";
import type { Undangan } from "../../types";
import { Luxury } from "./shell";

// Tema "Luxury": gaya majalah mewah berwarna ivory, taupe, espresso & emas. Foto besar bersudut lengkung,
// label tegak raksasa, galeri carousel coverflow, dan kisah cinta berbentuk bab-bab editorial.
// Khusus tampilan HP. Isi undangan sepenuhnya dari data.

const bodoni = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-bodoni" });
const script = Monsieur_La_Doulaise({ subsets: ["latin"], weight: "400", variable: "--font-script" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

// tamu: nama dari link (?to=...). Kosong berarti undangan umum.
export function TemaLuxury({ data, tamu }: { data: Undangan; tamu?: string }) {
  return (
    <div className={`${bodoni.variable} ${script.variable} ${manrope.variable}`}>
      <Luxury data={data} tamu={tamu} />
    </div>
  );
}
