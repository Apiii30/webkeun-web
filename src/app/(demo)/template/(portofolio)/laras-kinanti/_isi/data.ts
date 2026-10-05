// Isi template portofolio Laras Kinanti (fotografer potret & dokumenter, tokoh fiktif).
// Semua foto dari Unsplash (Unsplash License: bebas dipakai, termasuk komersial). Fotografernya tercatat di bawah.
// Disimpan sebagai webp maks 1600px di /public/portofolio/laras.

const UKURAN = {
  "laras-potret": [899, 1600], // Rafi Ashraf (unsplash.com/photos/EV1NJ2A40IY)
  "laras-studio": [1600, 1067], // B Y G (unsplash.com/photos/rMUo1wmzGKQ)
  "laut-jala": [1067, 1600], // rishi (unsplash.com/photos/P7nrx9eqV5o)
  "laut-perahu": [1600, 1067], // Devi Puspita Amartha Yahya (unsplash.com/photos/4QhNCFW8UJY)
  "laut-pikul": [1067, 1600], // Dendy Darma Satyazi (unsplash.com/photos/DMW0b1oJ6N8)
  "laut-tarik": [1600, 1071], // Husniati Salma (unsplash.com/photos/ATRyb0hYSsg)
  "pasar-gorengan": [1600, 1067], // septiyeni .36 (unsplash.com/photos/AGRkhWqdZ8g)
  "pasar-ikan": [1067, 1600], // prananta haroun (unsplash.com/photos/O958PDbt8m0)
  "pasar-jajan": [1067, 1600], // Lek Nikto (unsplash.com/photos/Wp6EZVd3yQY)
  "pasar-kios": [1067, 1600], // Devi Puspita Amartha Yahya (unsplash.com/photos/jAVjvvyNKRU)
  "pasar-sate": [946, 1600], // The Ian (unsplash.com/photos/xuLZHLNrUsA)
  "pasar-timbang": [1067, 1600], // Devi Puspita Amartha Yahya (unsplash.com/photos/UPib5nGLtoI)
  "potret-canang": [1067, 1600], // Polina Kuzovkova (unsplash.com/photos/hQPOIsGdu5w)
  "potret-ilalang": [1280, 1600], // Axel Bimashanda (unsplash.com/photos/VaX_OVjhwZQ)
  "potret-jalan": [1600, 1200], // Deva Raditya DD (unsplash.com/photos/uNAifwR9eFI)
  "potret-mahkota": [1600, 1334], // Ryanwar Hanif (unsplash.com/photos/0SU8gZu0r5U)
  "potret-nenek": [1067, 1600], // Zahra Wijayanti (unsplash.com/photos/HV-b3RVg2X0)
  "potret-pemuda": [1280, 1600], // Sean Weaver (unsplash.com/photos/r5rF2GPu8r0)
  "sawah-caping": [1067, 1600], // Bas Peperzak (unsplash.com/photos/_Qi5XLmQ754)
  "sawah-ibu": [1600, 900], // Carles Rabada (unsplash.com/photos/qIBVHDafIdw)
  "sawah-petani": [1067, 1600], // Polina Kuzovkova (unsplash.com/photos/g5O60VhyiHA)
  "sawah-rumput": [1067, 1600], // Polina Kuzovkova (unsplash.com/photos/21ZsIxsq3B4)
  "sawah-senyum": [1067, 1600], // gede adhiputra (unsplash.com/photos/au84UJ1KmNU)
  "tari-kecak": [1280, 1600], // Gabriel Federa (unsplash.com/photos/kPHkkssRnLE)
  "tari-legong": [1600, 1064], // Didi Paul (unsplash.com/photos/fWvv8L9Ann0)
  "tari-pasangan": [1200, 1600], // Agto Nugroho (unsplash.com/photos/G8EVsq_mQ3Q)
  "tari-selendang": [1200, 1600], // Dino Januarsa (unsplash.com/photos/ZnaV5AJ27dc)
} as const;

export type Foto = { src: string; w: number; h: number; alt: string };
const foto = (nama: keyof typeof UKURAN, alt: string): Foto => ({
  src: `/portofolio/laras/${nama}.webp`,
  w: UKURAN[nama][0],
  h: UKURAN[nama][1],
  alt,
});

export const profil = {
  nama: "Laras Kinanti",
  depan: "Laras",
  belakang: "Kinanti",
  peran: "Fotografer potret & dokumenter",
  kota: "Bandung, Jawa Barat",
  email: "halo@laraskinanti.com",
  instagram: "laras.kinanti",
  wa: "6281200000000",
  slot: "Jadwal Okt–Des 2026: sisa 3 slot",
  potret: foto("laras-studio", "Laras memotret dari balik kamera"),
  potretTentang: foto("laras-potret", "Laras dengan kameranya"),
};

// Foto kecil yang melayang di sekitar bingkai pembuka (kedalaman beda-beda untuk efek parallax)
export const satelit = [
  { f: foto("tari-selendang", "Penari dengan selendang merah"), d: 0.8, pos: "right-[-6%] top-[13%] w-[30vw] md:right-[7%] md:top-[12%] md:w-[12vw]", arah: 1 },
  { f: foto("sawah-senyum", "Ibu bertudung kain tersenyum"), d: 1.3, pos: "left-[-8%] top-[18%] w-[28vw] md:left-[7%] md:top-[15%] md:w-[10.5vw]", arah: -1 },
  { f: foto("laut-jala", "Nelayan melempar jala"), d: 1.6, pos: "left-[3%] bottom-[11%] w-[24vw] md:left-[17%] md:bottom-[8%] md:w-[8.5vw]", arah: -1 },
  { f: foto("pasar-timbang", "Pedagang pasar menimbang belanjaan"), d: 1.1, pos: "right-[2%] bottom-[14%] w-[26vw] md:right-[15%] md:bottom-[10%] md:w-[9.5vw]", arah: 1 },
  { f: foto("potret-ilalang", "Potret perempuan di antara ilalang"), d: 0.5, pos: "hidden md:block md:right-[28%] md:top-[6%] md:w-[6vw]", arah: 1 },
];

export const pernyataan =
  "Saya memotret orang-orang yang jarang difoto: pedagang subuh, petani, nelayan, dan penari sebelum naik panggung.";

export type Seri = {
  no: string;
  judul: string;
  tempat: string;
  tahun: string;
  isi: string;
  frame: number;
  warna: { bg: string; fg: string; aksen: string };
  sampul: Foto;
  foto: Foto[];
};

export const seri: Seri[] = [
  {
    no: "01",
    judul: "Pasar Subuh",
    tempat: "Pasar Cicadas, Bandung",
    tahun: "2024",
    isi: "Jam tiga pagi, sebelum kota bangun. Enam minggu ikut belanja bareng para pedagang, sampai saya hafal siapa jualan apa.",
    frame: 212,
    warna: { bg: "#e6dccb", fg: "#17130f", aksen: "#c9361f" },
    sampul: foto("pasar-sate", "Pedagang ikan asap di lapaknya"),
    foto: [
      foto("pasar-sate", "Pedagang ikan asap di lapaknya"),
      foto("pasar-timbang", "Pedagang menimbang belanjaan"),
      foto("pasar-kios", "Penjaga kios di antara dagangan"),
      foto("pasar-ikan", "Ibu-ibu menjual ikan kering"),
      foto("pasar-gorengan", "Pedagang gorengan menunggu pembeli"),
      foto("pasar-jajan", "Pedagang jajanan di gerbang pasar"),
    ],
  },
  {
    no: "02",
    judul: "Yang Menua di Sawah",
    tempat: "Ciparay & Majalaya",
    tahun: "2023–2024",
    isi: "Potret petani yang sudah bertani lebih lama dari umur saya. Difoto di sawah mereka sendiri, dengan cahaya jam lima sore.",
    frame: 148,
    warna: { bg: "#23241a", fg: "#ece4d3", aksen: "#d9a441" },
    sampul: foto("sawah-caping", "Nenek bercaping tersenyum"),
    foto: [
      foto("sawah-caping", "Nenek bercaping tersenyum"),
      foto("sawah-rumput", "Petani memikul rumput pakan"),
      foto("sawah-petani", "Petani bercaping di pematang"),
      foto("sawah-ibu", "Ibu bertudung kain di kebun"),
    ],
  },
  {
    no: "03",
    judul: "Laut Selatan",
    tempat: "Pangandaran",
    tahun: "2023",
    isi: "Nelayan tarik jaring dan bakul ikan di pesisir selatan. Seri ini dicetak jadi zine kecil dan habis dalam dua minggu.",
    frame: 96,
    warna: { bg: "#13242c", fg: "#e3ecee", aksen: "#e39b3a" },
    sampul: foto("laut-pikul", "Nelayan memikul keranjang di pantai"),
    foto: [
      foto("laut-pikul", "Nelayan memikul keranjang di pantai"),
      foto("laut-jala", "Nelayan melempar jala"),
      foto("laut-perahu", "Nelayan mendorong perahu ke laut"),
      foto("laut-tarik", "Menarik jaring bersama di pasir"),
    ],
  },
  {
    no: "04",
    judul: "Sebelum Naik Panggung",
    tempat: "Bandung & Gianyar",
    tahun: "2022–2025",
    isi: "Penari, penabuh, dan semua yang sibuk di belakang panggung. Proyek panjang yang sampai sekarang belum selesai.",
    frame: 304,
    warna: { bg: "#46130d", fg: "#f3e6d8", aksen: "#f0b44c" },
    sampul: foto("tari-pasangan", "Sepasang penari dalam kostum emas"),
    foto: [
      foto("tari-pasangan", "Sepasang penari dalam kostum emas"),
      foto("tari-legong", "Penari legong di depan gamelan"),
      foto("tari-kecak", "Penari kecak di antara obor"),
      foto("tari-selendang", "Penari dengan selendang merah"),
    ],
  },
];

// Rol film potret pesanan
export const rol = [
  { f: foto("potret-mahkota", "Potret perempuan bermahkota bunga"), ket: "Sesi personal · studio" },
  { f: foto("potret-ilalang", "Potret perempuan di antara ilalang"), ket: "Sesi personal · Lembang" },
  { f: foto("potret-pemuda", "Potret pemuda dengan kamera"), ket: "Profil kreator · Braga" },
  { f: foto("potret-jalan", "Potret perempuan tertawa di jalan"), ket: "Sesi kelulusan · Dago" },
  { f: foto("potret-canang", "Ibu merangkai canang"), ket: "Dokumenter · Ubud" },
  { f: foto("potret-nenek", "Potret nenek berkerudung"), ket: "Potret keluarga · Garut" },
  { f: foto("sawah-senyum", "Ibu bertudung kain tersenyum"), ket: "Pesanan zine · Bali" },
];

export const layanan = [
  {
    nama: "Potret personal",
    isi: "Sesi 2 jam di satu lokasi pilihanmu. 25 foto edit, siap dalam 7 hari.",
    harga: "850rb",
    f: foto("potret-ilalang", "Contoh potret personal"),
  },
  {
    nama: "Profil & tim",
    isi: "Foto profil untuk kantor, komunitas, atau kreator. Sampai 10 orang, plus foto suasana kerja.",
    harga: "2,2jt",
    f: foto("potret-pemuda", "Contoh foto profil"),
  },
  {
    nama: "Dokumenter usaha",
    isi: "Sehari ikut di balik usahamu: proses, orang-orangnya, dan produknya. Cocok buat website & katalog.",
    harga: "3,5jt/hari",
    f: foto("pasar-kios", "Contoh dokumenter usaha"),
  },
  {
    nama: "Acara & pertunjukan",
    isi: "Pentas, syukuran, atau akad yang intim. Fokus ke momen dan orang, bukan pose.",
    harga: "mulai 4,8jt",
    f: foto("tari-legong", "Contoh foto pertunjukan"),
  },
];

export const catatan = [
  ["Basis", "Bandung, bisa ke luar kota"],
  ["Alat", "35mm film & mirrorless"],
  ["Bahasa", "Indonesia, Sunda, Inggris"],
  ["Balas pesan", "Biasanya di hari yang sama"],
] as const;

export const pameran = [
  ["2025", "Pameran kolektif “Kota yang Bangun Pagi”", "Bandung"],
  ["2024", "Zine “Laut Selatan”, cetak 200 eksemplar", "Swaterbit"],
  ["2023", "Lokakarya potret jalanan untuk pelajar", "Cimahi"],
] as const;
