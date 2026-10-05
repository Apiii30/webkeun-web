// Aset tema Merah Delima. Semuanya bebas dipakai komersial tanpa wajib mencantumkan kredit.
//
// Sumber:
// - air-terjun: "Première Chûte du Staubbach", C. Wolf & J.R. Schellenberg (ca. 1780), Rijksmuseum, CC0.
//     Diolah jadi cetakan tinta merah anggur di atas kertas blush.
// - gunung: "Waterval van Gavarnie" (ca. 1800–1850), Rijksmuseum, CC0. Diolah jadi tinta krem-zaitun pucat.
// - reruntuhan: "Ruïne van kasteel Bourscheid" (1830–1850), Rijksmuseum, CC0. kastil: "Landschap met een ruïne"
//     (1600–1700), Rijksmuseum, CC0. Keduanya diolah jadi tinta mawar pudar untuk latar.
// - merak: "Witte pauw op tak", Theo van Hoytema (1911), Rijksmuseum, CC0. Dipotong dari latarnya & diwarnai krem-blush.
// - mawar-tua: Rosa gallica purpuro-violacea magna; mawar-pink: Rosa gallica pontiana; mawar-besar: Rosa gallica
//     flore giganteo. Pierre-Joseph Redouté, Les Roses (1817–1824), domain publik.
// - delima: Punica granatum, Köhler's Medizinal-Pflanzen (1887), domain publik.

import type { Tepi } from "../../tepi";

const dir = "/undangan/delima/";

// tepi: sisi gambar yang terpotong lurus (dipudarkan, lihat ../../tepi.ts)

export const ASET = {
  airTerjun: { src: `${dir}air-terjun.webp`, w: 900, h: 1105 },
  gunung: { src: `${dir}gunung.webp`, w: 1300, h: 596 },
  reruntuhan: { src: `${dir}reruntuhan.webp`, w: 700, h: 972 },
  kastil: { src: `${dir}kastil.webp`, w: 800, h: 638 },
  merak: { src: `${dir}merak-putih.webp`, w: 736, h: 900 },
  mawarTua: { src: `${dir}mawar-tua.webp`, w: 573, h: 900, tepi: "kb", pudar: 14 },
  mawarPink: { src: `${dir}mawar-pink.webp`, w: 709, h: 900, tepi: "nb", pudar: 14 },
  mawarBesar: { src: `${dir}mawar-besar.webp`, w: 597, h: 900, tepi: "b", pudar: 14 },
  delima: { src: `${dir}delima.webp`, w: 784, h: 900, tepi: "nb", pudar: 12 },
} satisfies Record<string, { src: string; w: number; h: number } & Tepi>;

export type NamaAset = keyof typeof ASET;

// Bingkai cermin bergelombang (cartouche) dalam kotak 300 × 420: puncak & kaki bergerigi tiga lengkung, sisi melengkung
// ke dalam. Dipakai untuk lubang gerbang pembuka dan bingkai foto penutup.
export const BINGKAI =
  "M150 4C168 4 176 20 188 24C204 30 214 18 230 24C250 32 252 50 268 56C288 64 292 80 290 100C270 160 270 260 290 320C292 340 288 356 268 364C252 370 250 388 230 396C214 402 204 390 188 396C176 400 168 416 150 416C132 416 124 400 112 396C96 390 86 402 70 396C50 388 48 370 32 364C12 356 8 340 10 320C30 260 30 160 10 100C8 80 12 64 32 56C48 50 50 32 70 24C86 18 96 30 112 24C124 20 132 4 150 4Z";

export const MASKER_BINGKAI = `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 420'><path d='${BINGKAI}'/></svg>`)}")`;
