// Isi template Website UMKM "Kawalu Coffee" (kedai kopi fiktif di Serang, Banten).
// Semua foto dari Unsplash (Unsplash License: bebas dipakai, termasuk komersial). Fotografernya tercatat di bawah.
// Disimpan sebagai webp maks 1600px di /public/umkm/kawalu.

const UKURAN = {
  "biji-sangrai": [1600, 1060], // Milo Miloezger (unsplash.com/photos/rKYRJu0n06Y)
  "biji-tangan": [1600, 1068], // Joshua Newton (unsplash.com/photos/XpyD7z6AP4g)
  ceri: [1600, 1067], // Sara Hobbs (unsplash.com/photos/dWUOvA4I6IE)
  "ceri-tegak": [1067, 1600], // Sara Hobbs (unsplash.com/photos/btMVU6KudWo)
  "es-kopi-susu": [1064, 1600], // pariwat pannium (unsplash.com/photos/rzX8bOle9xs)
  "es-kopi-susu-2": [1067, 1600], // Eiliv Aceron (unsplash.com/photos/ZuHjaQcYhDY)
  espresso: [1067, 1600], // Benjamin Salvatore (unsplash.com/photos/Y3pv7KRDUIw)
  gorengan: [1069, 1600], // Galih Setyo Putro (unsplash.com/photos/xlqVqN6NaZA)
  "gula-aren": [1067, 1600], // John Cutting (unsplash.com/photos/XN2_aR61c3k)
  jemur: [1314, 1600], // Trevin Jensen (unsplash.com/photos/s-PiaFydfRU)
  "jemur-ceri": [1600, 1067], // Dimitry B (unsplash.com/photos/i9Hgm8Cf-20)
  "kedai-halaman": [1198, 1600], // Ikram AbdulJabbar (unsplash.com/photos/4-0iTx70QKw)
  "kedai-malam": [1600, 900], // Arbi Rohman (unsplash.com/photos/Qbemhz83eC8)
  "kedai-meja": [1600, 1200], // Haydn Golden (unsplash.com/photos/kr1OiK6KYfI)
  "kedai-tanaman": [1067, 1600], // Duong Ngan (unsplash.com/photos/61yti0twbv8)
  latte: [1067, 1600], // Nathan Dumlao (unsplash.com/photos/cEJwMalRit8)
  ngobrol: [1600, 900], // Vitaly Gariev (unsplash.com/photos/sLNAqSLPTq8)
  petik: [1200, 1600], // Muh Mulyadi (unsplash.com/photos/9pJuqItnyUs)
  pisang: [1200, 1600], // Bimo Agmi (unsplash.com/photos/4oGKCdrBDzE)
  roti: [1200, 1600], // Arfiana Maulina (unsplash.com/photos/fgw_y8hYBm8)
  "ruang-dalam": [1067, 1600], // Geraldine Lewa (unsplash.com/photos/rqnyNgJz-RA)
  sangrai: [1066, 1600], // Nathan Dumlao (unsplash.com/photos/0vB20AT_39o)
  seduh: [1067, 1600], // Rizky Subagja (unsplash.com/photos/MiRKFDQ-QJ4)
  "sudut-jendela": [1280, 1600], // Bagir Bahana (unsplash.com/photos/kjUVQuC0Wjo)
  tubruk: [1067, 1600], // achmad adi wiratama (unsplash.com/photos/hr8KLonYLiI)
  v60: [900, 1600], // Clint Bustrillos (unsplash.com/photos/NlUK8DIAknk)
} as const;

export type Foto = { src: string; w: number; h: number; alt: string };
const foto = (nama: keyof typeof UKURAN, alt: string): Foto => ({
  src: `/umkm/kawalu/${nama}.webp`,
  w: UKURAN[nama][0],
  h: UKURAN[nama][1],
  alt,
});

export const kedai = {
  nama: "Kawalu Coffee",
  alamat: "Jl. Kawalu Raya No. 21, Cipocok Jaya, Kota Serang, Banten",
  peta: "https://www.google.com/maps/search/?api=1&query=Cipocok+Jaya+Kota+Serang+Banten",
  petaSemat: "https://www.google.com/maps?q=Cipocok+Jaya,+Kota+Serang,+Banten&z=14&output=embed",
  wa: "6281200000000",
  instagram: "kawalu.coffee",
  sejak: 2021,
};

export const waPesan = (teks: string) => `https://wa.me/${kedai.wa}?text=${encodeURIComponent(teks)}`;

// Jam buka per hari (0 = Minggu). [buka, tutup] dalam menit sejak 00.00; 24.00 = 1440.
export const jam: { hari: string; buka: number; tutup: number; catatan?: string }[] = [
  { hari: "Minggu", buka: 7 * 60, tutup: 24 * 60 },
  { hari: "Senin", buka: 7 * 60, tutup: 23 * 60 },
  { hari: "Selasa", buka: 7 * 60, tutup: 23 * 60 },
  { hari: "Rabu", buka: 7 * 60, tutup: 23 * 60 },
  { hari: "Kamis", buka: 7 * 60, tutup: 23 * 60 },
  { hari: "Jumat", buka: 13 * 60, tutup: 23 * 60, catatan: "buka selepas Jumatan" },
  { hari: "Sabtu", buka: 7 * 60, tutup: 24 * 60 },
];

// Dari ceri ke cangkir
export const langkah = [
  {
    judul: "Dipetik merah",
    isi: "Petani mitra kami di lereng Gunung Karang cuma memetik ceri yang sudah merah penuh. Lebih lama, tapi manisnya kerasa sampai cangkir.",
    angka: ["1.100", "mdpl"],
    ket: "Lereng Gunung Karang, Pandeglang",
    f: foto("petik", "Petani memegang keranjang ceri kopi merah"),
  },
  {
    judul: "Dijemur pelan",
    isi: "Ceri dijemur utuh di atas para-para bambu, dibolak-balik tiap pagi sampai kering. Dari sinilah rasa buahnya datang.",
    angka: ["21", "hari"],
    ket: "Proses natural di para-para",
    f: foto("jemur-ceri", "Ceri kopi dijemur di para-para"),
  },
  {
    judul: "Disangrai tiap Senin",
    isi: "Kami sangrai sendiri di belakang kedai, sedikit-sedikit, supaya biji yang sampai ke cangkirmu selalu umur seminggu.",
    angka: ["205", "°C"],
    ket: "11 menit · 5 kg per sangrai",
    f: foto("sangrai", "Biji kopi keluar dari mesin sangrai"),
  },
  {
    judul: "Diseduh di depanmu",
    isi: "Mau manual brew atau es kopi susu, semua diseduh pas kamu pesan. Tanya aja barista kami, mereka senang ngobrol.",
    angka: ["92", "°C"],
    ket: "15 gram · 3 menit",
    f: foto("seduh", "Barista menyeduh kopi dengan teko leher angsa"),
  },
];

export type Item = { nama: string; isi?: string; harga: number; andalan?: string; f?: Foto };

export const menu: { kategori: string; item: Item[] }[] = [
  {
    kategori: "Kopi",
    item: [
      {
        nama: "Es Kopi Susu Aren",
        isi: "Espresso, susu segar, dan gula aren dari Baduy.",
        harga: 22,
        andalan: "paling laris!",
        f: foto("es-kopi-susu", "Es kopi susu aren"),
      },
      { nama: "Kopi Tubruk Karang", isi: "Robusta Gunung Karang, diseduh ala rumah.", harga: 12, f: foto("tubruk", "Kopi tubruk di gelas") },
      {
        nama: "V60 Gunung Karang",
        isi: "Arabika natural. Rasa ceri, gula merah, kakao.",
        harga: 28,
        andalan: "favorit barista",
        f: foto("v60", "Kopi diseduh dengan V60 tembaga"),
      },
      { nama: "Kopi Susu Panas", isi: "Latte dengan biji house blend.", harga: 22, f: foto("latte", "Latte dengan latte art") },
      { nama: "Es Kopi Pandan", isi: "Sirup pandan bikinan sendiri.", harga: 24, f: foto("es-kopi-susu-2", "Es kopi susu di gelas") },
      { nama: "Espresso", isi: "Single atau double shot.", harga: 16, f: foto("espresso", "Espresso mengucur ke gelas") },
      { nama: "Americano", isi: "Panas atau dingin.", harga: 20 },
    ],
  },
  {
    kategori: "Bukan kopi",
    item: [
      { nama: "Es Cokelat Aren", isi: "Cokelat pekat, gula aren, susu.", harga: 22 },
      { nama: "Teh Tarik Rempah", isi: "Teh hitam, kayu manis, kapulaga.", harga: 18 },
      { nama: "Wedang Jahe Sereh", isi: "Hangat, buat yang lagi meriang.", harga: 15 },
      { nama: "Es Kelapa Jeruk", isi: "Kelapa muda, jeruk nipis, sedikit madu.", harga: 20 },
    ],
  },
  {
    kategori: "Teman ngopi",
    item: [
      {
        nama: "Pisang Goreng Aren",
        isi: "Pisang kepok, siraman aren, taburan wijen.",
        harga: 18,
        andalan: "wajib coba",
        f: foto("pisang", "Pisang goreng bertabur gula"),
      },
      { nama: "Emping Melinjo Pedas Manis", isi: "Emping khas Pandeglang, renyah.", harga: 15 },
      { nama: "Gorengan Campur", isi: "Bakwan, tahu isi, tempe mendoan. Isi 5.", harga: 15, f: foto("gorengan", "Gorengan dan kopi hitam") },
      { nama: "Roti Bakar Srikaya", isi: "Srikaya pandan bikinan sendiri.", harga: 20, f: foto("roti", "Roti bakar di atas talenan") },
      { nama: "Nasi Rabeg Mini", isi: "Rabeg kambing khas Serang, porsi pas.", harga: 32 },
    ],
  },
];

// Tiga menu andalan (kartu besar)
export const andalan = [
  { nama: "Es Kopi Susu Aren", harga: 22, catatan: "gula aren Baduy", f: foto("es-kopi-susu", "Es kopi susu aren") },
  { nama: "Kopi Tubruk Karang", harga: 12, catatan: "kayak di rumah nenek", f: foto("tubruk", "Kopi tubruk di gelas") },
  { nama: "Pisang Goreng Aren", harga: 18, catatan: "pasangan sejati", f: foto("pisang", "Pisang goreng bertabur gula") },
];

// Struk paket pesan antar
export const struk = {
  paket: "Paket Ngopi Berdua",
  baris: [
    ["2", "Es Kopi Susu Aren", 44_000],
    ["1", "Pisang Goreng Aren", 18_000],
    ["1", "Emping Pedas Manis", 15_000],
  ] as [string, string, number][],
  potongan: 10_000,
};

export const biji = [
  {
    nama: "Karang Natural",
    jenis: "Arabika",
    asal: "Gunung Karang, 1.100 mdpl",
    proses: "Natural",
    sangrai: 2,
    rasa: ["Ceri merah", "Gula aren", "Kakao"],
    harga: "95rb",
    warna: "#c3312b",
  },
  {
    nama: "Pulosari Honey",
    jenis: "Robusta",
    asal: "Gunung Pulosari, 900 mdpl",
    proses: "Honey",
    sangrai: 3,
    rasa: ["Karamel", "Kacang sangrai", "Rempah"],
    harga: "70rb",
    warna: "#c98a3c",
  },
  {
    nama: "Kawalu House Blend",
    jenis: "Arabika & Robusta",
    asal: "Pandeglang & Lebak",
    proses: "Campuran",
    sangrai: 4,
    rasa: ["Cokelat hitam", "Gula merah", "Pas buat kopi susu"],
    harga: "60rb",
    warna: "#2f4b2f",
  },
];

export const fasilitas = ["WiFi kencang", "Colokan tiap meja", "Mushola", "Parkir motor & mobil", "Ruang ber-AC", "Area merokok terpisah"];

export const suasana = [
  [
    foto("kedai-tanaman", "Sudut bar penuh tanaman"),
    foto("latte", "Latte di meja kayu"),
    foto("kedai-halaman", "Halaman belakang dengan kursi besi"),
  ],
  [
    foto("ngobrol", "Dua sahabat ngobrol di meja"),
    foto("sudut-jendela", "Pengunjung bekerja di dekat jendela"),
    foto("biji-sangrai", "Segenggam biji kopi sangrai"),
  ],
  [
    foto("kedai-meja", "Barista dan pengunjung di meja bar"),
    foto("ruang-dalam", "Ruang dalam dengan lantai teraso"),
    foto("gula-aren", "Gula aren kristal"),
  ],
];

export const fotoMalam = foto("kedai-malam", "Kedai di malam hari dengan lampu neon");
