import type { CSSProperties } from "react";

// Palet tema Floral: hijau hutan + bunga-bunga cerah (mentega, koral, biru), sengaja tidak pink.
// Dipakai langsung di SVG bunga, dan dipasang sebagai CSS variable untuk kelas Tailwind (mis. bg-(--hijau)).
export const W = {
  kertas: "#f8f2e4",
  krem: "#efe4c8",
  hijau: "#1d3f30",
  hijauTua: "#122a1f",
  daun: "#7ea676",
  mentega: "#f5c85a",
  koral: "#ef7a58",
  biru: "#6d8ee0",
} as const;

// Butiran halus seperti kertas cat air; ditumpuk di atas warna latar supaya tidak terasa polos
const NOISE_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .35 0 0 0 0 .28 0 0 0 0 .18 .28 0 0 0 -.07'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>";
export const NOISE = `url("data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}")`;

// Sapuan warna lembut (terang di satu sudut, lebih pekat di sudut lain) pengganti warna polos
const WASH = {
  mentega: "radial-gradient(130% 90% at 15% 0%, #fdedc0 0%, #f5d27a 50%, #e9b44c 100%)",
  koral: "radial-gradient(130% 90% at 15% 0%, #fddccb 0%, #f3a688 50%, #e47f5c 100%)",
  biru: "radial-gradient(130% 90% at 15% 0%, #e4e9fd 0%, #abbbf0 50%, #7f97e0 100%)",
  daun: "radial-gradient(130% 90% at 15% 0%, #e2ecd9 0%, #abc59c 50%, #84a97a 100%)",
};
export type Wash = keyof typeof WASH;
export const kertasWarna = (k: Wash): CSSProperties => ({ backgroundImage: `${NOISE}, ${WASH[k]}` });

export const cssVars = {
  "--noise": NOISE,
  "--kertas": W.kertas,
  "--krem": W.krem,
  "--hijau": W.hijau,
  "--hijau-tua": W.hijauTua,
  "--daun": W.daun,
  "--mentega": W.mentega,
  "--koral": W.koral,
  "--biru": W.biru,
} as CSSProperties;
