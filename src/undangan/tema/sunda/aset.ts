// Aset tema Art Sunda. Semuanya bebas dipakai komersial tanpa wajib mencantumkan kredit.
//
// Sumber:
// - melati, kenanga, cempaka, hanjuang, telang, soka, sapatu (kembang sapatu), bambu:
//     Francisco Manuel Blanco, "Flora de Filipinas" (1880–1883), domain publik, via Wikimedia Commons.
//     Dipotong dari kertasnya jadi gambar transparan; cap perpustakaan, nomor & teks dibuang.
// - sawah: "In het gebied rond Tjiawi (West Java) Landschap met rijstterrassen" (1949),
//     Nationaal Archief / Wikimedia Commons, CC0. Diolah jadi cetakan tinta (gaya toile).
// - desa: "West-Java. Soendanees dorp" (Nationaal Archief / Wikimedia Commons, CC0). Diolah sama seperti sawah.
// - gedung-sate: digambar sendiri (vektor) lalu diberi tekstur cetak. Foto arsip hanya dipakai sebagai acuan bentuk.
// - kujang, mega mendung, siger, kuntul: digambar sendiri di ornamen.tsx.

const dir = "/undangan/sunda/";

export const ASET = {
  gedungSate: { src: `${dir}gedung-sate.webp`, w: 1100, h: 561 },
  sawah: { src: `${dir}sawah.webp`, w: 900, h: 929 },
  desa: { src: `${dir}desa.webp`, w: 900, h: 768 },
  melati1: { src: `${dir}melati-1.webp`, w: 455, h: 629 },
  melati2: { src: `${dir}melati-2.webp`, w: 351, h: 606 },
  kenanga: { src: `${dir}kenanga.webp`, w: 615, h: 900 },
  cempaka: { src: `${dir}cempaka.webp`, w: 717, h: 900 },
  hanjuang: { src: `${dir}hanjuang.webp`, w: 674, h: 900 },
  telang: { src: `${dir}telang.webp`, w: 802, h: 900 },
  soka: { src: `${dir}soka.webp`, w: 660, h: 900 },
  sapatu: { src: `${dir}sapatu.webp`, w: 1072, h: 628 },
  bambu: { src: `${dir}bambu.webp`, w: 624, h: 1000 },
} as const;

export type NamaAset = keyof typeof ASET;

// Satu tanaman di dalam rumpun. Posisi & lebar dalam persen lebar rumpun, b = jarak dari bawah (%).
export type Kembang = { a: NamaAset; w: number; x: number; b: number; r?: number; flip?: boolean; z?: number };

// Rumpun lebat di kaki Gedung Sate: bambu & hanjuang di belakang, bunga berwarna di depan
export const RUMPUN_GEDUNG: Kembang[] = [
  { a: "bambu", w: 30, x: -8, b: 6, r: -4 },
  { a: "hanjuang", w: 26, x: 76, b: 4, r: 6, flip: true },
  { a: "telang", w: 34, x: -10, b: -16, r: 8, z: 1 },
  { a: "soka", w: 26, x: 12, b: -22, r: -6, z: 1 },
  { a: "sapatu", w: 40, x: 32, b: -12, z: 2 },
  { a: "kenanga", w: 28, x: 66, b: -20, r: 10, flip: true, z: 1 },
  { a: "melati1", w: 22, x: 84, b: -16, r: -8, z: 2 },
];

// Hiasan kecil di sudut bingkai foto
export const RUMPUN_SUDUT: Kembang[] = [
  { a: "melati2", w: 34, x: -12, b: -6, r: -18 },
  { a: "soka", w: 34, x: 4, b: -14, r: 14, z: 1 },
];
export const RUMPUN_SUDUT_KANAN: Kembang[] = [
  { a: "kenanga", w: 40, x: 64, b: -8, r: 16, flip: true },
  { a: "telang", w: 36, x: 72, b: -18, r: -10, z: 1 },
];

// Rumpun rendah untuk dasar kartu & bagian
export const RUMPUN_DASAR: Kembang[] = [
  { a: "hanjuang", w: 26, x: -6, b: -10, r: -10 },
  { a: "melati1", w: 22, x: 14, b: -14, r: 6, z: 1 },
  { a: "sapatu", w: 36, x: 32, b: -16, z: 2 },
  { a: "telang", w: 30, x: 62, b: -14, r: -6, z: 1 },
  { a: "cempaka", w: 28, x: 80, b: -12, r: 12, flip: true },
];
