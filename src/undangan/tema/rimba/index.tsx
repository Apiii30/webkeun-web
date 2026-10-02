import { Cinzel, Cormorant_Garamond, Montserrat, Pinyon_Script } from "next/font/google";
import type { Undangan } from "../../types";
import { Rimba } from "./shell";

// Tema "Rimba": hutan berkabut dari lukisan klasik, bunga ilustrasi botani, bingkai emas.
// Khusus tampilan HP. Isi undangan sepenuhnya dari data; aset & sumbernya ada di aset.ts.

const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const script = Pinyon_Script({ subsets: ["latin"], weight: "400", variable: "--font-script" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], style: ["italic"], weight: ["400", "500"], variable: "--font-cormorant" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

// tamu: nama dari link (?to=...). Kosong berarti undangan umum.
export function TemaRimba({ data, tamu }: { data: Undangan; tamu?: string }) {
  return (
    <div className={`${cinzel.variable} ${script.variable} ${cormorant.variable} ${montserrat.variable}`}>
      <Rimba data={data} tamu={tamu} />
    </div>
  );
}
