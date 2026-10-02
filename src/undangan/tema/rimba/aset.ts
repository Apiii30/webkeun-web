// Aset tema Rimba. Semuanya bebas dipakai komersial (domain publik / CC0), diambil dari Wikimedia Commons
// lalu diolah: lukisan diwarnai ulang hijau gelap, ilustrasi bunga dipotong dari kertasnya jadi PNG transparan.
//
// Sumber:
// - hutan:      Asher B. Durand, "A Creek in the Woods" (1865), domain publik
// - hutan-2:    Asher B. Durand, "In the Woods" (1855), The Met, domain publik
// - danau:      Ivan Shishkin, "Misty Morning" (1885), domain publik
// - hutan-hujan: Ivan Shishkin, "Rain in an Oak Forest" (1891), domain publik
// - mawar-*, amaryllis, iris, tradescantia, passiflora, fritillary:
//               Pierre-Joseph & Henry Joseph Redouté, Cleveland Museum of Art Open Access, CC0
// - awan-*:     dibuat sendiri (SVG yang dirender jadi gambar)
// - kupu-*:     ilustrasi "Birds Illustrated: Butterflies" (Nature Study Publishing Co., Chicago, 1900),
//               versi berlatar transparan di Commons, domain publik

const dir = "/undangan/rimba/";

export const ASET = {
  hutan: { src: `${dir}hutan.webp`, w: 900, h: 1118 },
  hutan2: { src: `${dir}hutan-2.webp`, w: 900, h: 1128 },
  danau: { src: `${dir}danau.webp`, w: 900, h: 667 },
  hujan: { src: `${dir}hutan-hujan.webp`, w: 1000, h: 616 },
  awan1: { src: `${dir}awan-1.webp`, w: 640, h: 280 },
  awan2: { src: `${dir}awan-2.webp`, w: 640, h: 280 },
  amaryllis: { src: `${dir}amaryllis.webp`, w: 696, h: 900 },
  fritillary: { src: `${dir}fritillary.webp`, w: 681, h: 900 },
  iris: { src: `${dir}iris.webp`, w: 452, h: 900 },
  cinnamomea: { src: `${dir}mawar-cinnamomea.webp`, w: 639, h: 900 },
  indica: { src: `${dir}mawar-indica.webp`, w: 557, h: 900 },
  pomifera: { src: `${dir}mawar-pomifera.webp`, w: 700, h: 856 },
  pompon: { src: `${dir}mawar-pompon.webp`, w: 558, h: 900 },
  provence: { src: `${dir}mawar-provence.webp`, w: 626, h: 900 },
  stelligera: { src: `${dir}mawar-stelligera.webp`, w: 486, h: 900 },
  terebenthina: { src: `${dir}mawar-terebenthina.webp`, w: 653, h: 900 },
  passiflora: { src: `${dir}passiflora.webp`, w: 700, h: 855 },
  tradescantia: { src: `${dir}tradescantia.webp`, w: 700, h: 763 },
  kupuMonarch: { src: `${dir}kupu-monarch.webp`, w: 260, h: 173 },
  kupuAntiopa: { src: `${dir}kupu-antiopa.webp`, w: 260, h: 165 },
  kupuVanessa: { src: `${dir}kupu-vanessa.webp`, w: 260, h: 169 },
  kupuSpeyeria: { src: `${dir}kupu-speyeria.webp`, w: 260, h: 177 },
} as const;

export type NamaAset = keyof typeof ASET;

// Satu tanaman di dalam rumpun. Posisi & lebar dalam persen lebar rumpun.
export type Tanaman = { a: NamaAset; w: number; x: number; b: number; r?: number; flip?: boolean };

// Rumpun lebat di dasar layar, seperti semak di tepi hutan
export const RUMPUN_BAWAH: Tanaman[] = [
  { a: "tradescantia", w: 50, x: -16, b: -8, r: -8 },
  { a: "iris", w: 22, x: 6, b: -4, r: -6 },
  { a: "pompon", w: 36, x: 10, b: -14, r: 6 },
  { a: "amaryllis", w: 36, x: 72, b: -6, r: 10, flip: true },
  { a: "terebenthina", w: 46, x: 62, b: -16, r: -4, flip: true },
  { a: "fritillary", w: 28, x: 56, b: -10, r: 8 },
  { a: "indica", w: 28, x: 30, b: -18, r: -2 },
  { a: "passiflora", w: 38, x: 38, b: -26, r: 14 },
];

// Rumpun kecil untuk sudut bingkai foto
export const RUMPUN_BINGKAI: Tanaman[] = [
  { a: "provence", w: 46, x: -10, b: -10, r: -24 },
  { a: "stelligera", w: 36, x: 70, b: 0, r: 22, flip: true },
];

// Tanaman yang menjuntai dari atas layar
export const RUMPUN_ATAS: Tanaman[] = [
  { a: "cinnamomea", w: 52, x: -18, b: 0, r: 168 },
  { a: "pomifera", w: 50, x: 66, b: 4, r: -164, flip: true },
];
