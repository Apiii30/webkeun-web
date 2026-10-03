import { Gilda_Display, Imperial_Script, Lora } from "next/font/google";
import type { Undangan } from "../../types";
import { Porselen } from "./shell";

// Tema "Biru Porselen": biru kobalt & putih gading seperti lukisan porselen, dengan sentuhan batik kawung &
// gunungan. Dibuka dengan animasi jendela gunungan: pintu batik membuka, rimbun emas tersibak, lalu kamera menembus
// jendela ke danau & air terjun. Galeri carousel cincin 3D, kisah cinta berupa perjalanan horizontal, parallax penuh.
// Khusus tampilan HP. Isi undangan sepenuhnya dari data.

const naskah = Imperial_Script({ subsets: ["latin"], weight: "400", variable: "--font-naskah" });
const gilda = Gilda_Display({ subsets: ["latin"], weight: "400", variable: "--font-gilda" });
const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-lora" });

// tamu: nama dari link (?to=...). Kosong berarti undangan umum.
export function TemaPorselen({ data, tamu }: { data: Undangan; tamu?: string }) {
  return (
    <div className={`${naskah.variable} ${gilda.variable} ${lora.variable}`}>
      <Porselen data={data} tamu={tamu} />
    </div>
  );
}
