import type { Undangan } from "../types";

// Data contoh untuk demo. Nama, orang tua, tanggal, lokasi, dan rekening semuanya fiktif.
// Fotonya foto lamaran pasangan sungguhan: pastikan sudah ada izin mereka sebelum website dipublikasikan.
const f = (nama: string) => `/undangan/fara-aditya/${nama}.webp`;
const LOKASI = "Contoh Grand Ballroom, Jl. Contoh Asia Afrika No. 8, Bandung";

export const faraAditya: Undangan = {
  slug: "fara-aditya",
  wanita: {
    nama: "Fara Anindya Putri",
    panggilan: "Fara",
    keterangan: "Putri pertama dari Bapak Bambang Hidayat & Ibu Lestari",
    foto: f("wanita"),
  },
  pria: {
    nama: "Aditya Rahman",
    panggilan: "Aditya",
    keterangan: "Putra kedua dari Bapak Yusuf Hakim & Ibu Nurul Aini",
    foto: f("pria"),
  },
  mulai: "2027-03-20T08:00:00+07:00",
  selesai: "2027-03-20T14:00:00+07:00",
  tanggal: "Sabtu, 20 Maret 2027",
  kota: "Bandung",
  acara: [
    { nama: "Akad Nikah", jam: "08.00 – 10.00 WIB" },
    { nama: "Resepsi", jam: "11.00 – 14.00 WIB" },
  ],
  lokasi: {
    nama: "Contoh Grand Ballroom",
    alamat: "Jl. Contoh Asia Afrika No. 8, Bandung",
    maps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(LOKASI)}`,
  },
  pembuka:
    "Dengan memohon rahmat Tuhan Yang Maha Esa, kami mengundang kamu untuk hadir dan ikut merayakan hari pernikahan kami. Kehadiran dan doa restumu akan jadi bunga terindah di hari bahagia kami.",
  kutipan: "Dua orang, satu cerita panjang yang baru saja dimulai.",
  cerita: [
    { tahun: "2021", judul: "Pertemuan", isi: "Dikenalkan teman kantor. Obrolan pertama soal kopi yang kemanisan, lalu nggak pernah berhenti ngobrol." },
    { tahun: "2024", judul: "Jatuh hati", isi: "Dari teman diskusi jadi teman pulang. Pelan-pelan, kami sadar sedang menulis cerita yang sama." },
    { tahun: "2026", judul: "Lamaran", isi: "Cincin dipasang, dua keluarga bertemu. Semua foto di undangan ini diambil di hari itu." },
    { tahun: "2027", judul: "Hari ini", isi: "Babak baru dimulai, dan kami ingin kamu ada di halaman pertamanya." },
  ],
  foto: {
    sampul: f("sampul"),
    kutipan: f("cahaya"),
    belakang: f("buket"),
    galeri: [
      // urutan tampil di tumpukan galeri; [1] juga dipakai di kartu "Kini bersama"
      { src: f("cincin"), alt: "Cincin di jari manis", w: 1279, h: 1600 },
      { src: f("berdua"), alt: "Berdua di bawah lampu", w: 1067, h: 1600 },
      { src: f("tangan"), alt: "Dua tangan, dua cincin", w: 1279, h: 1600 },
      { src: f("kotak-cincin"), alt: "Kotak cincin", w: 1279, h: 1600 },
      { src: f("duduk"), alt: "Potret keluarga baru", w: 1280, h: 1600 },
      { src: f("selfie"), alt: "Foto bareng yang paling jujur", w: 1600, h: 1067 },
      { src: f("senyum"), alt: "Senyum sang mempelai", w: 1279, h: 1600 },
    ],
  },
  amplop: [{ bank: "Bank Contoh", nomor: "8765 4321 00", atasNama: "Fara Anindya Putri" }],
};
