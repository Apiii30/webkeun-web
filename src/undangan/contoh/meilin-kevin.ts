import type { Undangan } from "../types";
import { faraAditya } from "./fara-aditya";

// Data contoh untuk demo Oriental Peony. Nama, orang tua, dan rekening fiktif; tanggal, acara, lokasi, dan kutipan
// sama dengan data contoh Fara & Aditya. Foto ada di /public/undangan/001.
const f = (nama: string) => `/undangan/001/${nama}.webp`;

export const meilinKevin: Undangan = {
  ...faraAditya,
  slug: "meilin-kevin",
  wanita: {
    nama: "Mei Lin Wijaya",
    panggilan: "Mei Lin",
    keterangan: "Putri pertama dari Bapak Hartono Wijaya & Ibu Lily Tan",
    foto: f("wanita"),
  },
  pria: {
    nama: "Kevin Halim",
    panggilan: "Kevin",
    keterangan: "Putra kedua dari Bapak Surya Halim & Ibu Grace Lim",
    foto: f("pria"),
  },
  cerita: [
    { tahun: "2021", judul: "Pertemuan", isi: "Dikenalkan teman kantor. Obrolan pertama soal kopi yang kemanisan, lalu nggak pernah berhenti ngobrol." },
    { tahun: "2024", judul: "Jatuh hati", isi: "Dari teman diskusi jadi teman pulang. Pelan-pelan, kami sadar sedang menulis cerita yang sama." },
    { tahun: "2026", judul: "Lamaran", isi: "Cincin dipasang, dua keluarga bertemu, dan benang merah itu akhirnya terikat." },
    { tahun: "2027", judul: "Hari ini", isi: "Babak baru dimulai, dan kami ingin kamu ada di halaman pertamanya." },
  ],
  foto: {
    sampul: f("sampul"),
    kutipan: f("cahaya"),
    belakang: f("buket"),
    galeri: [
      // urutan tampil di galeri; [1] juga dipakai di kartu "Kini bersama"
      { src: f("cincin"), alt: "Cincin di jari manis", w: 1136, h: 1408 },
      { src: f("lampion"), alt: "Berdua di bawah lampion merah", w: 1136, h: 1408 },
      { src: f("tangan"), alt: "Dua tangan, dua cincin", w: 1136, h: 1408 },
      { src: f("kotak-cincin"), alt: "Kotak cincin di atas kain bersulam peoni", w: 1136, h: 1408 },
      { src: f("duduk"), alt: "Duduk berdua di depan lukisan gunung", w: 1136, h: 1408 },
      { src: f("selfie"), alt: "Foto bareng di taman peoni", w: 1136, h: 1408 },
      { src: f("senyum"), alt: "Senyum sang mempelai", w: 1136, h: 1408 },
    ],
  },
  amplop: [{ bank: "Bank Contoh", nomor: "8765 4321 00", atasNama: "Mei Lin Wijaya" }],
};
