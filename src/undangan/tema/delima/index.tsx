import { Allura, Crimson_Pro, Prata } from "next/font/google";
import type { Undangan } from "../../types";
import { Delima } from "./shell";

// Tema "Merah Delima": merah marun & blush bergaya cetakan tembaga (toile), dengan mawar Redouté, delima, dan merak
// putih. Dibuka seperti video pembuka referensinya: gerbang besi tempa di dalam bingkai cermin bergelombang berayun
// membuka, lalu kamera menembus bingkai ke lembah air terjun. Galeri tumpukan foto yang bisa digeser, kisah cinta
// berupa surat bersegel lilin yang terbuka saat digulir, parallax penuh. Khusus tampilan HP. Isi sepenuhnya dari data.

const allura = Allura({ subsets: ["latin"], weight: "400", variable: "--font-allura" });
const prata = Prata({ subsets: ["latin"], weight: "400", variable: "--font-prata" });
const crimson = Crimson_Pro({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-crimson" });

export function TemaDelima({ data }: { data: Undangan }) {
  return (
    <div className={`${allura.variable} ${prata.variable} ${crimson.variable}`}>
      <Delima data={data} />
    </div>
  );
}
