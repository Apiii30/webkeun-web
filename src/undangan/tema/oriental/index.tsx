import { Mrs_Saint_Delafield, Shippori_Mincho, Yuji_Syuku } from "next/font/google";
import type { Undangan } from "../../types";
import { Oriental } from "./shell";

// Tema "Oriental Peony": nuansa pernikahan Tionghoa merah pernis, emas, dan giok, dengan lanskap lukisan biru-hijau
// Wang Ximeng, gerbang paifang, peoni, teratai, bambu tinta, bangau, lentera merah, dan 囍. Dibuka dengan animasi ±10
// detik: kamera menembus jendela bulan sampul, mundur melewati pegunungan berlapis, mendekati gerbang paifang yang naik,
// lalu mundur lagi memperlihatkan kolam teratai, bambu, bingkai kayu merah, dan foto mempelai di gerbang bulan. Galeri
// roda jendela bulan, love story "benang merah takdir" dengan kipas lipat berisi foto, hitung mundur dalam lentera,
// angpao digital.
// Khusus tampilan HP.

const delafield = Mrs_Saint_Delafield({ subsets: ["latin"], weight: "400", variable: "--font-delafield" });
const yuji = Yuji_Syuku({ subsets: ["latin"], weight: "400", variable: "--font-yuji" });
const mincho = Shippori_Mincho({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mincho" });

// tamu: nama dari link (?to=...). Kosong berarti undangan umum.
export function TemaOriental({ data, tamu }: { data: Undangan; tamu?: string }) {
  return (
    <div className={`${delafield.variable} ${yuji.variable} ${mincho.variable}`}>
      <Oriental data={data} tamu={tamu} />
    </div>
  );
}
