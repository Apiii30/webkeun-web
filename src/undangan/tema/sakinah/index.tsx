import { Amiri_Quran, Corinthia, EB_Garamond, Marcellus } from "next/font/google";
import type { Undangan } from "../../types";
import { Sakinah } from "./shell";

// Tema "Putih Sakinah": nuansa Islami putih mutiara, emas, dan hijau zamrud. Dibuka dengan pintu mihrab berkisi
// bintang delapan di dinding marmer: kamera mundur sementara lentera kuningan turun, untaian melati terurai, dan
// kaligrafi Bismillah muncul; pintu berayun membuka (3D) lalu kamera menembus lengkung ke Taj Mahal saat fajar. Tiap
// lapisan punya kedalaman sendiri (parallax 3D). Galeri jendela mihrab dengan foto ber-parallax, perjalanan cinta
// berupa jendela berpintu yang terbuka saat digulir, ayat & doa dalam teks Arab, parallax penuh. Khusus tampilan HP.

const corinthia = Corinthia({ subsets: ["latin"], weight: "700", variable: "--font-corinthia" });
const marcellus = Marcellus({ subsets: ["latin"], weight: "400", variable: "--font-marcellus" });
const garamond = EB_Garamond({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-garamond" });
const amiri = Amiri_Quran({ subsets: ["arabic"], weight: "400", variable: "--font-amiri" });

export function TemaSakinah({ data }: { data: Undangan }) {
  return (
    <div className={`${corinthia.variable} ${marcellus.variable} ${garamond.variable} ${amiri.variable}`}>
      <Sakinah data={data} />
    </div>
  );
}
