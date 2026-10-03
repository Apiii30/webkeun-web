// Bentuk data satu undangan. Tema hanya mengatur tampilan; semua isi (nama, tanggal, foto, rekening)
// datang dari data ini, jadi satu tema bisa dipakai untuk banyak pasangan.

export type Mempelai = {
  nama: string;
  panggilan: string;
  keterangan: string; // mis. "Putri pertama dari Bapak ... & Ibu ..."
  foto: string;
};

export type Foto = { src: string; alt: string; w: number; h: number };

export type Undangan = {
  slug: string;
  wanita: Mempelai;
  pria: Mempelai;
  mulai: string; // ISO, dipakai untuk hitung mundur & kalender
  selesai: string; // ISO
  tanggal: string; // teks tampil, mis. "Sabtu, 20 Maret 2027"
  kota: string;
  acara: { nama: string; jam: string }[];
  lokasi: { nama: string; alamat: string; maps: string };
  pembuka: string;
  kutipan: string;
  // opsional, dipakai tema yang menampilkan ayat & salam pembuka/penutup (mis. Rimba)
  ayat?: { teks: string; sumber: string; arab?: string }; // arab: teks ayat aslinya (opsional, mis. tema Sakinah)
  salam?: { buka: string; tutup: string };
  cerita: { tahun: string; judul: string; isi: string }[];
  foto: { sampul: string; kutipan: string; belakang: string; galeri: Foto[] };
  amplop: { bank: string; nomor: string; atasNama: string }[];
};
