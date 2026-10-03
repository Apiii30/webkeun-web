import { Corinthia, Marcellus, Mulish, Noto_Sans_Javanese } from "next/font/google";
import type { Undangan } from "../../types";
import { Jawa } from "./shell";

// Tema "Jawa Klasik": lanskap pagi bergaya litografi tinta hijau (Gunung Sumbing & sawah terasering), gunungan wayang,
// janur kuning melengkung, batik truntum & kawung, dan bunga pengantin Jawa (melati, kantil, kenanga).
// Nyaman di HP maupun laptop. Isi undangan sepenuhnya dari data; aset & sumbernya ada di aset.ts.

const marcellus = Marcellus({ subsets: ["latin"], weight: "400", variable: "--font-marcellus" });
const corinthia = Corinthia({ subsets: ["latin"], weight: "400", variable: "--font-corinthia" });
const mulish = Mulish({ subsets: ["latin"], variable: "--font-mulish" });
// hanya untuk hiasan aksara Jawa
const aksara = Noto_Sans_Javanese({ subsets: ["javanese"], weight: "500", variable: "--font-aksara-jawa" });

// tamu: nama dari link (?to=...). Kosong berarti undangan umum.
export function TemaJawa({ data, tamu }: { data: Undangan; tamu?: string }) {
  return (
    <div className={`${marcellus.variable} ${corinthia.variable} ${mulish.variable} ${aksara.variable}`}>
      <Jawa data={data} tamu={tamu} />
    </div>
  );
}
