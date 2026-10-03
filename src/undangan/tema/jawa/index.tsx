import { Alice, Cinzel, Kaushan_Script } from "next/font/google";
import type { Undangan } from "../../types";
import { Jawa } from "./shell";

// Tema "Jawa Klasik": gapura berukir, janur kuning menjuntai, gunung berkabut, rumah joglo, kepala wayang,
// dan bunga cat air bernuansa merah muda-plum. Ornamen tumbuh dari sudutnya saat terlihat.
// Khusus tampilan HP. Isi undangan sepenuhnya dari data; aset & sumbernya ada di aset.ts.

const kaushan = Kaushan_Script({ subsets: ["latin"], weight: "400", variable: "--font-kaushan" });
const alice = Alice({ subsets: ["latin"], weight: "400", variable: "--font-alice" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });

// tamu: nama dari link (?to=...). Kosong berarti undangan umum.
export function TemaJawa({ data, tamu }: { data: Undangan; tamu?: string }) {
  return (
    <div className={`${kaushan.variable} ${alice.variable} ${cinzel.variable}`}>
      <Jawa data={data} tamu={tamu} />
    </div>
  );
}
