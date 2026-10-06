import { Cormorant_Garamond, Italiana, Jost } from "next/font/google";
import type { Undangan } from "../../types";
import { Garden } from "./shell";

// Tema "Garden Premium": taman bergaya cetakan toile teal dengan gapura bertiang, air mancur, merak, peony
// & wisteria. Dibuka dengan animasi "kamera mundur" berlapis dari balik bunga sampai seluruh gapura terlihat.
// Khusus tampilan HP. Isi undangan sepenuhnya dari data.

const italiana = Italiana({ subsets: ["latin"], weight: "400", variable: "--font-italiana" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"], variable: "--font-cormorant" });
const jost = Jost({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-jost" });

export function TemaGarden({ data }: { data: Undangan }) {
  return (
    <div className={`${italiana.variable} ${cormorant.variable} ${jost.variable}`}>
      <Garden data={data} />
    </div>
  );
}
