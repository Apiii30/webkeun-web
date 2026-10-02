import { Figtree, Fraunces } from "next/font/google";
import type { Undangan } from "../../types";
import { Floral } from "./shell";

// Tema "Floral": bunga-bunga datar bergaya modern, khusus tampilan HP, penuh animasi scroll.
// Palet ada di warna.ts (hijau hutan, mentega, koral, biru). Isi undangan sepenuhnya dari data.

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  variable: "--font-fraunces",
});
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });

// tamu: nama dari link (?to=...). Kosong berarti undangan umum.
export function TemaFloral({ data, tamu }: { data: Undangan; tamu?: string }) {
  return (
    <div className={`${fraunces.variable} ${figtree.variable}`}>
      <Floral data={data} tamu={tamu} />
    </div>
  );
}
