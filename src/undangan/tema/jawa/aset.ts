// Aset tema Jawa Klasik. Semuanya bebas dipakai komersial tanpa wajib mencantumkan kredit.
//
// Sumber:
// - gunung: "Gezicht op de berg Sumbing op Java", litografi C.W. Mieling (mogelijk) naar F.W. Junghuhn (1853–1854),
//     Rijksmuseum / Wikimedia Commons, CC0. Diolah jadi tinta hijau transparan.
// - wayang: "Kop van een wajangpop" (sebelum 1942), Rijksmuseum / Wikimedia Commons, CC0. Dipotong dari kertasnya.
// - mawar-1, mawar-2: Pierre-Joseph Redouté, "Les Roses", Cleveland Museum of Art Open Access, CC0 (sama dengan tema Rimba).
// - teratai, telang, melati-putih, pohon (bambu diwarnai plum): Francisco Manuel Blanco, "Flora de Filipinas"
//     (1880–1883), domain publik (sama dengan tema Sunda).
// - kabut-desa: "West-Java. Soendanees dorp", Nationaal Archief / Wikimedia Commons, CC0, diwarnai mauve.
// - gapura (beserta potongan atas/tiang/kaki), janur, joglo: digambar sendiri (vektor) lalu diberi tekstur cetak.
// - kupu-1, kupu-2: "Birds Illustrated: Butterflies" (Nature Study Publishing Co., Chicago, 1900), domain publik
//     (sama dengan tema Rimba).

const dir = "/undangan/jawa/";

export const ASET = {
  gapura: { src: `${dir}gapura.webp`, w: 900, h: 1500 },
  gapuraAtas: { src: `${dir}gapura-atas.webp`, w: 900, h: 624 },
  gapuraKaki: { src: `${dir}gapura-kaki.webp`, w: 900, h: 284 },
  janur: { src: `${dir}janur.webp`, w: 400, h: 1025 },
  joglo: { src: `${dir}joglo.webp`, w: 900, h: 520 },
  wayang: { src: `${dir}wayang.webp`, w: 808, h: 800 },
  gunung: { src: `${dir}gunung.webp`, w: 1790, h: 625 },
  kabut: { src: `${dir}kabut-desa.webp`, w: 900, h: 768 },
  pohon: { src: `${dir}pohon.webp`, w: 624, h: 1000 },
  mawar1: { src: `${dir}mawar-1.webp`, w: 626, h: 900 },
  mawar2: { src: `${dir}mawar-2.webp`, w: 558, h: 900 },
  teratai: { src: `${dir}teratai.webp`, w: 833, h: 800 },
  telang: { src: `${dir}telang.webp`, w: 802, h: 900 },
  melati: { src: `${dir}melati-putih.webp`, w: 455, h: 629 },
  kupu1: { src: `${dir}kupu-1.webp`, w: 260, h: 169 },
  kupu2: { src: `${dir}kupu-2.webp`, w: 260, h: 173 },
} as const;

export type NamaAset = keyof typeof ASET;

// Satu bunga dalam rumpun sudut. x, b = posisi dari kiri & bawah (% lebar rumpun), w = lebar (%), r = miring.
// d = jeda tumbuh (detik), seperti urutan bertahap di referensi.
export type Kembang = { a: NamaAset; w: number; x: number; b: number; r?: number; flip?: boolean; z?: number; d?: number };

// Rumpun bunga di sudut kiri bawah (kanan dicerminkan)
export const SUDUT_BAWAH: Kembang[] = [
  { a: "telang", w: 70, x: -26, b: 6, r: -10, d: 0 },
  { a: "mawar1", w: 56, x: 6, b: -14, r: 8, z: 1, d: 0.25 },
  { a: "teratai", w: 74, x: -30, b: -30, r: -4, z: 2, d: 0.45 },
  { a: "mawar2", w: 46, x: 34, b: -24, r: 14, z: 2, d: 0.65 },
  { a: "melati", w: 34, x: 56, b: -16, r: -8, z: 3, d: 0.85 },
];

// Rumpun kecil di sudut atas (bunga menjuntai dari atas)
export const SUDUT_ATAS: Kembang[] = [
  { a: "mawar2", w: 62, x: -18, b: 10, r: 170, d: 0 },
  { a: "telang", w: 70, x: -26, b: 30, r: 160, z: 1, d: 0.3 },
  { a: "mawar1", w: 50, x: 16, b: 34, r: -170, z: 2, d: 0.6 },
];

// Hiasan bingkai foto: bunga kecil di dua sudut bawah bingkai, condong ke luar supaya fotonya tetap terlihat
export const BINGKAI_KIRI: Kembang[] = [
  { a: "mawar1", w: 24, x: -4, b: -10, r: -18, d: 0.2 },
  { a: "melati", w: 17, x: 9, b: -14, r: 12, z: 1, d: 0.5 },
];
export const BINGKAI_KANAN: Kembang[] = [
  { a: "teratai", w: 28, x: 76, b: -14, r: 12, d: 0.3 },
  { a: "mawar2", w: 18, x: 86, b: -6, r: -12, z: 1, d: 0.6 },
];

// Rumpun di tepi kiri (kanan dicerminkan): bunga merunduk ke dalam dari pinggir layar, tetap di dalam layar.
// Dipakai untuk menyambung dua bagian dan menghias sisi pilar gapura.
export const SISI: Kembang[] = [
  { a: "telang", w: 62, x: 0, b: 40, r: 16, d: 0 },
  { a: "mawar2", w: 44, x: 30, b: 52, r: 22, z: 1, d: 0.2 },
  { a: "mawar1", w: 52, x: 0, b: 4, r: 10, z: 1, d: 0.35 },
  { a: "melati", w: 34, x: 44, b: 24, r: 26, z: 2, d: 0.55 },
];

// Versi dengan teratai, untuk variasi
export const SISI_TERATAI: Kembang[] = [
  { a: "teratai", w: 70, x: 0, b: 18, r: 12, d: 0 },
  { a: "mawar1", w: 46, x: 30, b: 50, r: 24, z: 1, d: 0.25 },
  { a: "melati", w: 34, x: 46, b: 10, r: 26, z: 2, d: 0.5 },
];

// Bunga kecil di dua sudut bawah kartu acara (tidak menutupi alamat & tombol)
export const KARTU_KIRI: Kembang[] = [
  { a: "mawar1", w: 44, x: 0, b: -8, r: -8, d: 0 },
  { a: "telang", w: 40, x: 36, b: -22, r: 18, d: 0.2 },
  { a: "melati", w: 30, x: 28, b: -12, r: 12, z: 1, d: 0.4 },
];
export const KARTU_KANAN: Kembang[] = [
  { a: "teratai", w: 52, x: 0, b: -12, r: -6, d: 0.1 },
  { a: "mawar2", w: 32, x: 40, b: -10, r: 14, z: 1, d: 0.35 },
];
