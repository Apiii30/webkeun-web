// Aset tema Oriental Peony. Semuanya bebas dipakai komersial tanpa wajib mencantumkan kredit.
//
// Sumber:
// - gunung-*: "Seribu Li Sungai dan Gunung" (千里江山圖), Wang Ximeng (1113), Museum Istana Beijing, domain publik.
//     Dipotong per punggung gunung dari langit sutranya, lalu dicerahkan.
// - peoni-merah-muda: Tree Peony, "Favourite Flowers of Garden and Greenhouse", Edward Step (1896), domain publik.
// - peoni-salem: Paeonia × suffruticosa, Paxton's Flower Garden, L. Constans (1853), domain publik.
// - teratai: Nelumbo nucifera, Flora de Filipinas, Francisco Manuel Blanco (1880–1883), domain publik.
// - teratai-besar: Nelumbo nucifera, The American Flora vol. 4, D. W. Moody (1855), domain publik.
// - bambu: lukisan tinta bambu (anonim), The Metropolitan Museum of Art, CC0. Goresannya diangkat dari sutra & diwarnai giok.
// - 囍 (shuangxi): "Double happiness.svg", Conrad Cheung, Wikimedia Commons, domain publik.

import type { Tepi } from "../../tepi";

const dir = "/undangan/oriental/";

// tepi: sisi gambar yang terpotong lurus (dipudarkan, lihat ../../tepi.ts)

export const ASET = {
  gunungJauh: { src: `${dir}gunung-jauh.webp`, w: 1400, h: 578 },
  gunungPuncak: { src: `${dir}gunung-puncak.webp`, w: 1200, h: 753 },
  gunungTebing: { src: `${dir}gunung-tebing.webp`, w: 1100, h: 838 },
  peoniMerahMuda: { src: `${dir}peoni-merah-muda.webp`, w: 578, h: 900, tepi: "knb", pudar: 13 },
  peoniSalem: { src: `${dir}peoni-salem.webp`, w: 735, h: 900, tepi: "knb", pudar: 13 },
  teratai: { src: `${dir}teratai.webp`, w: 805, h: 900, tepi: "knb", pudar: 16 },
  terataiBesar: { src: `${dir}teratai-besar.webp`, w: 645, h: 900, tepi: "b", pudar: 14 },
  bambu: { src: `${dir}bambu.webp`, w: 1300, h: 745, tepi: "akn", pudar: 8 },
} satisfies Record<string, { src: string; w: number; h: number } & Tepi>;

export type NamaAset = keyof typeof ASET;

// 囍 dalam kotak 186 × 186, digambar sebagai garis setebal 16
export const SHUANGXI = "m51,0V43m84,0V0M17,25h68m16,0h68m13,26H4m21,25h51v25H25zm0,76h51v25H25zm85 0h51v25h-51zm0-76h51v25H110zm25,33v42m-84,0V109M1,126.5H185z";
