import { Alex_Brush, Jost, Noto_Sans_Sundanese, Rozha_One } from "next/font/google";
import type { Undangan } from "../../types";
import { Sunda } from "./shell";

// Tema "Art Sunda": kertas krem bercetak sawah, biru nila mega mendung, Gedung Sate, kujang, siger,
// dan bunga khas pengantin Sunda (melati, kenanga, cempaka) dari ilustrasi botani lama.
// Khusus tampilan HP. Isi undangan sepenuhnya dari data; aset & sumbernya ada di aset.ts.

const rozha = Rozha_One({ subsets: ["latin"], weight: "400", variable: "--font-rozha" });
const alex = Alex_Brush({ subsets: ["latin"], weight: "400", variable: "--font-alex" });
const jost = Jost({ subsets: ["latin"], variable: "--font-jost" });
// hanya untuk hiasan aksara Sunda
const aksara = Noto_Sans_Sundanese({ subsets: ["sundanese"], weight: "500", variable: "--font-aksara" });

export function TemaSunda({ data }: { data: Undangan }) {
  return (
    <div className={`${rozha.variable} ${alex.variable} ${jost.variable} ${aksara.variable}`}>
      <Sunda data={data} />
    </div>
  );
}
