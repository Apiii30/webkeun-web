// Aset tema Garden Premium. Semuanya bebas dipakai komersial tanpa wajib mencantumkan kredit.
//
// Sumber:
// - lembah: "Arcadisch landschap met bergen en een rivier" (1697–1744), naar Gaspard Dughet (Poussin),
//     Rijksmuseum / Wikimedia Commons, CC0. Diolah jadi cetakan dua warna (tinta teal di atas kertas).
// - palem: "Palmboom" (ca. 1820–1835), Rijksmuseum, CC0. Diolah sama.
// - air-mancur: "Tuinvaas en fontein", Johann Jacob Schübler (na 1724), Rijksmuseum, CC0. Dipotong & diolah sama.
// - merak-dahan ("Twee pauwen op boomtak"), merak-sakura ("Pauw in kersenboom"), wisteria ("Vliegenvanger bij
//     wisteria"): cetakan kayu Ohara Koson (1900–1930), Rijksmuseum, CC0. Dipotong dari kertasnya.
// - peony: Paeonia suffruticosa, Curtis's Botanical Magazine (1809), domain publik.
// - peony-merah: Paeonia peregrina, Curtis's Botanical Magazine (1918), domain publik.
// - gapura-taman: digambar sendiri (vektor) lalu diberi tekstur cetak.

const dir = "/undangan/garden/";

export const ASET = {
  lembah: { src: `${dir}lembah.webp`, w: 1200, h: 1495 },
  gapura: { src: `${dir}gapura-taman.webp`, w: 1000, h: 1500 },
  airMancur: { src: `${dir}air-mancur.webp`, w: 600, h: 1007 },
  palem: { src: `${dir}palem.webp`, w: 600, h: 902 },
  merakDahan: { src: `${dir}merak-dahan.webp`, w: 744, h: 1300 },
  merakSakura: { src: `${dir}merak-sakura.webp`, w: 678, h: 1200 },
  peony: { src: `${dir}peony.webp`, w: 900, h: 719 },
  peonyMerah: { src: `${dir}peony-merah.webp`, w: 800, h: 921 },
  wisteria: { src: `${dir}wisteria.webp`, w: 303, h: 1200 },
} as const;

export type NamaAset = keyof typeof ASET;

// Warna tema
export const W = {
  teal: "#2f5563",
  tealTua: "#24434e",
  tinta: "#34596a",
  kabut: "#eef1ec",
  kertas: "#e7ece8",
  emas: "#b9975b",
  emasMuda: "#dcc58f",
} as const;
