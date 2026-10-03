// Aset tema Putih Sakinah. Semuanya bebas dipakai komersial tanpa wajib mencantumkan kredit.
//
// Sumber:
// - taj: "The Taj Mahal, Tomb of the Emperor Shah Jehan", Thomas Sutherland setelah Charles Ramus Forrest (1824),
//     British Library, domain publik. Diolah jadi cetakan tinta emas di atas kertas putih mutiara.
// - magnolia: "Magnolia altissima", Georg Dionysius Ehret (abad ke-18), Naturalis Biodiversity Center, CC0.
// - anggrek: "Phalaenopsis amabilis dayana", The Orchid Album plate 11, John Nugent Fitch (1882), domain publik.
// - melati: "Jasminum sambac", Flora de Filipinas, Francisco Manuel Blanco (1880–1883), domain publik.
// Bunga dipotong dari kertasnya; isi kelopak yang sewarna kertas digeser ke putih.

const dir = "/undangan/sakinah/";

export const ASET = {
  taj: { src: `${dir}taj.webp`, w: 1100, h: 760 },
  magnolia: { src: `${dir}magnolia.webp`, w: 1100, h: 900 },
  anggrek: { src: `${dir}anggrek.webp`, w: 563, h: 892 },
  melati: { src: `${dir}melati.webp`, w: 549, h: 683 },
} as const;

export type NamaAset = keyof typeof ASET;

// Lengkung mihrab (ogee runcing) dalam kotak 300 × 420: bahu membulat lalu meruncing ke puncak, sisi tegak.
// Dipakai untuk lubang pintu pembuka, bingkai foto, dan jendela-jendela kisah.
export const LENGKUNG = "M0 420V176C0 104 52 56 104 34C126 25 142 14 150 0C158 14 174 25 196 34C248 56 300 104 300 176V420Z";

// Hanya puncaknya (300 × 180, sisi diperpanjang 4 satuan ke bawah), untuk kartu yang tingginya mengikuti isi
export const PUNCAK = "M0 180V176C0 104 52 56 104 34C126 25 142 14 150 0C158 14 174 25 196 34C248 56 300 104 300 176V180Z";

const svgUrl = (vb: string, d: string, ar = "") => `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='${vb}'${ar}><path d='${d}'/></svg>`)}")`;

export const MASKER_LENGKUNG = svgUrl("0 0 300 420", LENGKUNG, " preserveAspectRatio='none'");
const MASKER_PUNCAK = svgUrl("0 0 300 180", PUNCAK);

// Masker kartu berpuncak mihrab yang tingginya bebas: puncak (rasio tetap) + persegi di bawahnya. Wadah luarnya harus
// [container-type:inline-size]; `inset` = jarak lapisan ini dari tepi wadah (px), supaya garis tepi bertingkat pas.
export function maskerMihrab(inset = 0) {
  const tinggiPuncak = `calc((100cqw - ${inset * 2}px) * 0.5867)`;
  const m = `${MASKER_PUNCAK}, linear-gradient(#000, #000)`;
  const size = `100% auto, 100% calc(100% - ${tinggiPuncak})`;
  const pos = "0 0, 0 100%";
  return { maskImage: m, WebkitMaskImage: m, maskSize: size, WebkitMaskSize: size, maskPosition: pos, WebkitMaskPosition: pos, maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat" } as const;
}

export const maskerLengkung = { maskImage: MASKER_LENGKUNG, WebkitMaskImage: MASKER_LENGKUNG, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" } as const;

// Teks Arab berharakat. Ayat (teks Arab & terjemahannya) diambil dari data undangan.
export const BISMILLAH = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
// Doa Nabi ﷺ untuk pengantin (HR. Abu Dawud no. 2130, Tirmidzi no. 1091)
export const DOA_PENGANTIN = "بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ";
export const ARTI_DOA = "Semoga Allah memberkahimu, melimpahkan keberkahan atasmu, dan mengumpulkan kalian berdua dalam kebaikan.";
