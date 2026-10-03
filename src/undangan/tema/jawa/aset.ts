// Aset tema Jawa Klasik. Semuanya bebas dipakai komersial tanpa wajib mencantumkan kredit.
//
// Sumber:
// - gunung: "Gezicht op de berg Sumbing op Java", litografi C.W. Mieling (mogelijk) naar F.W. Junghuhn (1853–1854),
//     Rijksmuseum / Wikimedia Commons, CC0. Dipotong (patung di latar depan dibuang), lalu diolah jadi tinta hijau
//     transparan supaya bisa ditumpuk di atas langit & kabut.
// - melati, kenanga, kantil (cempaka), soka, hanjuang: aset tema Sunda (Francisco Manuel Blanco, "Flora de Filipinas",
//     1880–1883, domain publik), warnanya diredam ke nuansa sage.
// - gunungan, janur, gapura, bukit, rumput, batik kawung & truntum: digambar sendiri di ornamen.tsx.

const dir = "/undangan/jawa/";

export const ASET = {
  gunung: { src: `${dir}gunung.webp`, w: 1790, h: 625 },
  melati: { src: `${dir}melati.webp`, w: 455, h: 629 },
  melati2: { src: `${dir}melati-2.webp`, w: 351, h: 606 },
  kenanga: { src: `${dir}kenanga.webp`, w: 600, h: 878 },
  kantil: { src: `${dir}kantil.webp`, w: 600, h: 753 },
  soka: { src: `${dir}soka.webp`, w: 600, h: 818 },
  hanjuang: { src: `${dir}hanjuang.webp`, w: 600, h: 801 },
} as const;

export type NamaAset = Exclude<keyof typeof ASET, "gunung">;

// Satu tanaman di dalam rumpun. Posisi & lebar dalam persen lebar rumpun, b = jarak dari bawah (%).
export type Kembang = { a: NamaAset; w: number; x: number; b: number; r?: number; flip?: boolean; z?: number };

// Rumpun di kaki lanskap (beranda, sampul, penutup): hanjuang tinggi di tepi, bunga di depan
export const RUMPUN_KIRI: Kembang[] = [
  { a: "hanjuang", w: 34, x: -10, b: 2, r: -8 },
  { a: "kenanga", w: 36, x: 6, b: -18, r: 6, z: 1 },
  { a: "soka", w: 30, x: -6, b: -24, r: -10, z: 2 },
  { a: "melati", w: 24, x: 22, b: -20, r: 12, z: 2 },
];
export const RUMPUN_KANAN: Kembang[] = [
  { a: "hanjuang", w: 32, x: 76, b: 0, r: 8, flip: true },
  { a: "kantil", w: 38, x: 58, b: -18, r: -6, flip: true, z: 1 },
  { a: "melati2", w: 22, x: 84, b: -18, r: 10, z: 2 },
  { a: "soka", w: 26, x: 72, b: -26, r: 12, flip: true, z: 2 },
];

// Hiasan kecil di sudut bingkai foto
export const SUDUT_KIRI: Kembang[] = [
  { a: "melati2", w: 34, x: -14, b: -8, r: -20 },
  { a: "soka", w: 36, x: 2, b: -16, r: 12, z: 1 },
];
export const SUDUT_KANAN: Kembang[] = [
  { a: "kenanga", w: 42, x: 64, b: -10, r: 16, flip: true },
  { a: "melati", w: 30, x: 76, b: -16, r: -10, z: 1 },
];

// Rumpun rendah untuk dasar kartu acara
export const RUMPUN_DASAR: Kembang[] = [
  { a: "hanjuang", w: 24, x: -6, b: -10, r: -12 },
  { a: "melati", w: 22, x: 12, b: -16, r: 6, z: 1 },
  { a: "soka", w: 26, x: 36, b: -22, z: 2 },
  { a: "kantil", w: 28, x: 58, b: -16, r: -6, flip: true, z: 1 },
  { a: "kenanga", w: 28, x: 80, b: -12, r: 12, flip: true },
];
