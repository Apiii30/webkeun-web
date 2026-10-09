import type { Mempelai, Undangan } from "../types";
import { faraAditya } from "./fara-aditya";

// Data contoh demo tema undangan: satu pasangan fiktif per tema, supaya tiap demo terasa milik pasangan yang berbeda.
// Nama, orang tua, dan rekening fiktif; tanggal, acara, lokasi, dan kutipan sama dengan contoh Fara & Aditya.
// Foto ada di /public/undangan/<folder>/ (diberi nama sesuai isinya: wanita, pria, sampul, cincin, ...).

const cerita: Undangan["cerita"] = [
  { tahun: "2021", judul: "Pertemuan", isi: "Dikenalkan teman kantor. Obrolan pertama soal kopi yang kemanisan, lalu nggak pernah berhenti ngobrol." },
  { tahun: "2024", judul: "Jatuh hati", isi: "Dari teman diskusi jadi teman pulang. Pelan-pelan, kami sadar sedang menulis cerita yang sama." },
  { tahun: "2026", judul: "Lamaran", isi: "Cincin dipasang dan dua keluarga bertemu. Restu itu jadi hadiah terindah sebelum hari besar kami." },
  { tahun: "2027", judul: "Hari ini", isi: "Babak baru dimulai, dan kami ingin kamu ada di halaman pertamanya." },
];

// [nama file, alt, lebar, tinggi]. Urutan dipakai tema: [1] juga tampil di kartu pasangan, [4] di tema Luxury.
type Galeri = [nama: string, alt: string, w: number, h: number];

function pasangan(p: { slug: string; folder: string; wanita: Omit<Mempelai, "foto">; pria: Omit<Mempelai, "foto">; kutipan: string; belakang: string; galeri: Galeri[] }): Undangan {
  const f = (nama: string) => `/undangan/${p.folder}/${nama}.webp`;
  return {
    ...faraAditya,
    slug: p.slug,
    wanita: { ...p.wanita, foto: f("wanita") },
    pria: { ...p.pria, foto: f("pria") },
    cerita,
    foto: { sampul: f("sampul"), kutipan: f(p.kutipan), belakang: f(p.belakang), galeri: p.galeri.map(([nama, alt, w, h]) => ({ src: f(nama), alt, w, h })) },
    amplop: [{ bank: "Bank Contoh", nomor: "8765 4321 00", atasNama: p.wanita.nama }],
  };
}

const B = 1136; // ukuran foto galeri yang paling umum: 1136 × 1408
const T = 1408;

// Art Sunda
export const sekarGalih = pasangan({
  slug: "sekar-galih",
  folder: "003",
  wanita: { nama: "Sekar Ayu Lestari", panggilan: "Sekar", keterangan: "Putri pertama dari Bapak Ujang Suherman & Ibu Euis Rohaeti" },
  pria: { nama: "Galih Permana", panggilan: "Galih", keterangan: "Putra ketiga dari Bapak Dadang Kurnia & Ibu Neneng Sumarni" },
  kutipan: "duduk",
  belakang: "duduk",
  galeri: [
    ["cincin", "Cincin di jari manis", B, T],
    ["berdua", "Berdua di bawah lentera", B, T],
    ["tangan", "Dua tangan, dua cincin", B, T],
    ["kotak-cincin", "Kotak cincin di atas kain batik", B, T],
    ["buket", "Buket melati sang mempelai", B, T],
    ["selfie", "Foto bareng di rumah panggung", B, T],
    ["senyum", "Senyum sang mempelai", B, T],
  ],
});

// Putih Sakinah
export const aisyahFauzan = pasangan({
  slug: "aisyah-fauzan",
  folder: "004",
  wanita: { nama: "Aisyah Nur Azizah", panggilan: "Aisyah", keterangan: "Putri kedua dari Bapak H. Abdul Rahman & Ibu Hj. Siti Maryam" },
  pria: { nama: "Muhammad Fauzan", panggilan: "Fauzan", keterangan: "Putra pertama dari Bapak H. Ahmad Syarif & Ibu Hj. Nurhayati" },
  kutipan: "peluk",
  belakang: "berdua",
  galeri: [
    ["cincin", "Cincin di jari manis", B, T],
    ["duduk", "Duduk berdua di pelaminan putih", B, T],
    ["tangan", "Dua tangan, dua cincin", B, T],
    ["kotak-cincin", "Kotak cincin & tasbih mutiara", B, T],
    ["buket", "Buket anggrek putih", B, T],
    ["selfie", "Foto bareng yang paling jujur", B, T],
    ["senyum", "Senyum sang mempelai", B, T],
  ],
});

// Merah Delima
export const claraDaniel = pasangan({
  slug: "clara-daniel",
  folder: "005",
  wanita: { nama: "Clara Valencia", panggilan: "Clara", keterangan: "Putri pertama dari Bapak Robert Santoso & Ibu Maria Lestari" },
  pria: { nama: "Daniel Pratama", panggilan: "Daniel", keterangan: "Putra kedua dari Bapak Yohanes Pratama & Ibu Theresia Wulan" },
  kutipan: "peluk",
  belakang: "berdua",
  galeri: [
    ["cincin", "Cincin & buah delima", B, T],
    ["duduk", "Duduk berdua di ruang lilin", B, T],
    ["tangan", "Dua tangan, dua cincin", B, T],
    ["kotak-cincin", "Kotak cincin beludru merah", B, T],
    ["buket", "Buket mawar merah", B, T],
    ["selfie", "Foto bareng di depan air terjun", B, T],
    ["senyum", "Senyum sang mempelai", B, T],
  ],
});

// Luxury
export const vaniaAdrian = pasangan({
  slug: "vania-adrian",
  folder: "006",
  wanita: { nama: "Vania Kirana", panggilan: "Vania", keterangan: "Putri tunggal dari Bapak Hendra Wijaya & Ibu Linda Kusuma" },
  pria: { nama: "Adrian Saputra", panggilan: "Adrian", keterangan: "Putra pertama dari Bapak Michael Saputra & Ibu Diana Halim" },
  kutipan: "peluk",
  belakang: "berdua",
  galeri: [
    ["cincin", "Cincin di jari manis", B, T],
    ["duduk", "Duduk berdua di sofa beludru", B, T],
    ["tangan", "Dua tangan, dua cincin", B, T],
    ["kotak-cincin", "Kotak cincin hitam bertepi emas", B, T],
    ["berdua", "Berdua di bawah lampu kristal", B, T],
    ["selfie", "Foto bareng yang paling jujur", B, T],
    ["senyum", "Senyum sang mempelai", B, T],
  ],
});

// Garden Premium
export const alyaBima = pasangan({
  slug: "alya-bima",
  folder: "007",
  wanita: { nama: "Alya Maharani", panggilan: "Alya", keterangan: "Putri kedua dari Bapak Bambang Sutrisno & Ibu Ratna Dewi" },
  pria: { nama: "Bima Pradipta", panggilan: "Bima", keterangan: "Putra pertama dari Bapak Wahyu Pradipta & Ibu Sri Rahayu" },
  kutipan: "berdua",
  belakang: "berdua",
  galeri: [
    ["cincin", "Cincin di jari manis", 928, 1152],
    ["duduk", "Duduk berdua di bangku taman", B, T],
    ["tangan", "Dua tangan, dua cincin", 928, 1152],
    ["kotak-cincin", "Kotak cincin di tepi air mancur", 928, 1152],
    ["buket", "Buket peoni & wisteria", 928, 1152],
    ["selfie", "Foto bareng di bawah wisteria", B, T],
    ["senyum", "Senyum sang mempelai", B, T],
  ],
});

// Rimba
export const senjaRaka = pasangan({
  slug: "senja-raka",
  folder: "008",
  wanita: { nama: "Senja Amelia", panggilan: "Senja", keterangan: "Putri pertama dari Bapak Teguh Santosa & Ibu Wulan Sari" },
  pria: { nama: "Raka Aditama", panggilan: "Raka", keterangan: "Putra kedua dari Bapak Irwan Aditama & Ibu Lestari Ningsih" },
  kutipan: "peluk",
  belakang: "berdua",
  galeri: [
    ["cincin", "Cincin di atas batang berlumut", 928, 1152],
    ["duduk", "Duduk berdua di tepi hutan", B, T],
    ["tangan", "Dua tangan, dua cincin", 928, 1152],
    ["kotak-cincin", "Kotak cincin di antara bunga hutan", 928, 1152],
    ["buket", "Buket bunga liar", 928, 1152],
    ["selfie", "Foto bareng di depan air terjun", B, T],
    ["senyum", "Senyum sang mempelai", B, T],
  ],
});

// Biru Porselen: Frisca & Arif. Fotonya foto lamaran mereka sendiri (sama dengan foto contoh Fara & Aditya).
export const friscaArif: Undangan = {
  ...faraAditya,
  slug: "frisca-arif",
  wanita: { ...faraAditya.wanita, nama: "Frisca Triani Ivanka", panggilan: "Frisca", keterangan: "Putri dari Bapak Agus Siswanto & Ibu (Almh.) Srie Astrie" },
  pria: { ...faraAditya.pria, nama: "Arif Rahman Fauzi", panggilan: "Arif", keterangan: "Putra dari Bapak (Alm.) Endang & Ibu Enny" },
  amplop: [{ bank: "Bank Contoh", nomor: "8765 4321 00", atasNama: "Frisca Triani Ivanka" }],
};
