// Aset tema Biru Porselen. Semuanya bebas dipakai komersial tanpa wajib mencantumkan kredit.
//
// Sumber:
// - air-terjun: "Waterval bij Tivoli" (1829), Rijksmuseum / Wikimedia Commons, CC0. Diolah jadi cetakan tinta kobalt.
// - gunung-biru: "Landschap met vier bergen", Karel Dujardin (1659), Rijksmuseum, CC0. Diolah jadi tinta biru transparan.
// - perahu: dari "Zeilschepen en sloepen op kalme zee" (1600–1700), Rijksmuseum, CC0. Dipotong & diolah sama.
// - pohon-emas: "Overhangende boom" (1630), Rijksmuseum, CC0. Diolah jadi tinta emas transparan.
// - hortensia: Hydrangea macrophylla "Otaksa", Siebold & Zuccarini, Flora Japonica (1870), domain publik.
// - peony-porselen, peony-biru: Paeonia suffruticosa, Curtis's Botanical Magazine (1809), domain publik,
//     diwarnai ulang biru-putih seperti lukisan porselen.

import type { Tepi } from "../../tepi";

const dir = "/undangan/porselen/";

// tepi: sisi gambar yang terpotong lurus (dipudarkan, lihat ../../tepi.ts)
export const ASET = {
  airTerjun: { src: `${dir}air-terjun.webp`, w: 1200, h: 740 },
  gunung: { src: `${dir}gunung-biru.webp`, w: 1200, h: 526 },
  perahu: { src: `${dir}perahu.webp`, w: 300, h: 538 },
  pohonEmas: { src: `${dir}pohon-emas.webp`, w: 900, h: 805, tepi: "aknb", pudar: 22 },
  hortensia: { src: `${dir}hortensia.webp`, w: 700, h: 872, tepi: "b", pudar: 14 },
  peony: { src: `${dir}peony-porselen.webp`, w: 900, h: 719, tepi: "knb", pudar: 14 },
  peonyBiru: { src: `${dir}peony-biru.webp`, w: 900, h: 719, tepi: "knb", pudar: 14 },
} satisfies Record<string, { src: string; w: number; h: number } & Tepi>;

export type NamaAset = keyof typeof ASET;

// Bentuk jendela gunungan (kayon) dalam kotak 300 × 420: puncak meruncing, sisi menggembung, kaki bertingkat
export const GUNUNGAN =
  "M150 4C168 38 196 70 228 104C262 140 290 190 292 248C294 300 282 338 270 362L280 382L266 416H34L20 382L30 362C18 338 6 300 8 248C10 190 38 140 72 104C104 70 132 38 150 4Z";

export const MASKER_GUNUNGAN = `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 420'><path d='${GUNUNGAN}'/></svg>`)}")`;
