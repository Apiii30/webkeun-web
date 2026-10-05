// Isi template Company Profile "PT Bahtera Lintas Nusantara" (perusahaan logistik fiktif di Surabaya).
// Semua foto dari Unsplash (Unsplash License: bebas dipakai, termasuk komersial). Fotografernya tercatat di bawah.
// Disimpan sebagai webp maks 1600px di /public/company/bahtera.

const UKURAN = {
  "admin-gudang": [1600, 1067], // EqualStock (unsplash.com/photos/h8H_tTEDE0Y)
  "derek-langit": [1067, 1600], // Julia Taubitz (unsplash.com/photos/v8zoz8wobfM)
  "derek-merah": [1600, 1067], // Claudio Schwarz (unsplash.com/photos/O1HZ7DWJn5I)
  "derek-senja": [1600, 1068], // Werner Hilversum (unsplash.com/photos/vFLJEhS_y5w)
  forklift: [1280, 1600], // Spencer Davis (unsplash.com/photos/a_4tgP1t6Y0)
  "gudang-gelap": [1067, 1600], // Jhonatan Londono (unsplash.com/photos/_FF8CJbcios)
  "kapal-asap": [1600, 1066], // Hennie Stander (unsplash.com/photos/Y92tPZJLfUY)
  "kapal-laut": [1600, 1153], // Bent Van Aeken (unsplash.com/photos/0A7YwYhZhWw)
  "kapal-tunda": [1067, 1600], // Defrino Maasy (unsplash.com/photos/xEbmd6M8dlM)
  "muat-pinisi": [1600, 1067], // Pradamas Gifarry (unsplash.com/photos/0d3tcGsZ7Go)
  "pelabuhan-atas": [1600, 1067], // CHUTTERSNAP (unsplash.com/photos/9cCeS9Sg6nU)
  "pelabuhan-malam": [1600, 1200], // Ed Wingate (unsplash.com/photos/iWI0nZ1iloY)
  "pelabuhan-senja": [1600, 1200], // Manson (unsplash.com/photos/O-hXklfVxOo)
  "pelabuhan-tegak": [1280, 1600], // Nazarizal Mohammad (unsplash.com/photos/ANAGcyPUVwk)
  "perak-derek": [1410, 1600], // Kevin Yudhistira Alloni (unsplash.com/photos/LqQH2RjLUQQ)
  "perak-tunda": [1165, 1600], // Kevin Yudhistira Alloni (unsplash.com/photos/LldFn42cEtA)
  petugas: [1067, 1600], // Mufid Majnun (unsplash.com/photos/lWmyvGCodTE)
  pinisi: [1600, 900], // wd toro (unsplash.com/photos/4k_hklGbrgg)
  rapat: [1600, 1067], // UX Indonesia (unsplash.com/photos/Rf6lwwbsZB4)
  sortir: [1600, 1068], // CHUTTERSNAP (unsplash.com/photos/dRrWcufYhkg)
  tim: [1600, 1067], // UX Indonesia (unsplash.com/photos/hv2DRoXTKxI)
  "truk-kota": [1067, 1600], // proudlyswazi (unsplash.com/photos/Fvwvp2CD3rs)
  "truk-tol": [1600, 1067], // Nishat Samadzai (unsplash.com/photos/k2xIbQC_x6A)
} as const;

export type Foto = { src: string; w: number; h: number; alt: string };
const foto = (nama: keyof typeof UKURAN, alt: string): Foto => ({
  src: `/company/bahtera/${nama}.webp`,
  w: UKURAN[nama][0],
  h: UKURAN[nama][1],
  alt,
});

export const pt = {
  nama: "PT Bahtera Lintas Nusantara",
  singkat: "Bahtera",
  sejak: 2009,
  kode: "BHTU 260451",
  cek: "3",
  wa: "6281200000000",
  telepon: "(031) 329 0000",
  email: "halo@bahteralogistik.co.id",
  kantor: [
    { kota: "Surabaya", peran: "Kantor pusat", alamat: "Jl. Perak Barat No. 28, Tanjung Perak, Surabaya 60177" },
    { kota: "Jakarta", peran: "Cabang", alamat: "Jl. Enggano No. 7, Tanjung Priok, Jakarta Utara 14310" },
    { kota: "Makassar", peran: "Cabang", alamat: "Jl. Nusantara No. 112, Makassar 90173" },
  ],
};

export const waLink = (teks: string) => `https://wa.me/${pt.wa}?text=${encodeURIComponent(teks)}`;

export const fotoPembuka = foto("pelabuhan-senja", "Pelabuhan peti kemas saat senja dilihat dari atas");

// Rute dari hub Surabaya. Koordinat dalam satuan peta (lihat peta.ts); c1 & c2 titik kendali kurva (jalur laut).
export type Rute = { kota: string; xy: [number, number]; c1: [number, number]; c2: [number, number]; moda: string; waktu: string };
export const HUB: [number, number] = [383, 288];
export const rute: Rute[] = [
  { kota: "Jakarta", xy: [260, 265], c1: [350, 262], c2: [300, 255], moda: "Laut & darat", waktu: "1–2 hari" },
  { kota: "Banjarmasin", xy: [422, 206], c1: [395, 262], c2: [420, 238], moda: "Laut", waktu: "2 hari" },
  { kota: "Makassar", xy: [523, 244], c1: [430, 290], c2: [480, 268], moda: "Laut", waktu: "2–3 hari" },
  { kota: "Balikpapan", xy: [468, 163], c1: [440, 270], c2: [482, 220], moda: "Laut", waktu: "3 hari" },
  { kota: "Pontianak", xy: [311, 137], c1: [360, 250], c2: [300, 200], moda: "Laut", waktu: "3 hari" },
  { kota: "Batam", xy: [200, 113], c1: [330, 240], c2: [270, 170], moda: "Laut", waktu: "4 hari" },
  { kota: "Kupang", xy: [611, 350], c1: [460, 322], c2: [560, 345], moda: "Laut", waktu: "4 hari" },
  { kota: "Bitung", xy: [644, 106], c1: [500, 250], c2: [590, 60], moda: "Laut", waktu: "5 hari" },
  { kota: "Ambon", xy: [707, 214], c1: [520, 300], c2: [640, 262], moda: "Laut", waktu: "5–6 hari" },
  { kota: "Sorong", xy: [772, 155], c1: [560, 302], c2: [730, 236], moda: "Laut", waktu: "6–7 hari" },
  { kota: "Medan", xy: [88, 57], c1: [290, 200], c2: [150, 70], moda: "Laut", waktu: "6–7 hari" },
  { kota: "Jayapura", xy: [970, 190], c1: [600, 300], c2: [860, 95], moda: "Laut", waktu: "8–10 hari" },
];

export const layanan = [
  {
    kode: "BHTU 100201",
    nama: "Freight forwarding",
    sub: "Laut · FCL & LCL",
    isi: "Kirim satu kontainer penuh (20 & 40 kaki) atau titip sebagian ruang (LCL). Kami pesankan kapal, urus stuffing, sampai bongkar di pelabuhan tujuan.",
    poin: ["Jadwal kapal mingguan ke 12 pelabuhan", "Asuransi kargo all-risk", "Door-to-door atau port-to-port"],
    warna: "#b8432f",
    f: foto("kapal-laut", "Kapal kontainer berlayar di laut biru"),
  },
  {
    kode: "BHTU 100202",
    nama: "Trucking & distribusi",
    sub: "Darat · Jawa–Bali–Sumatra",
    isi: "Armada sendiri dari pick-up sampai trailer 40 kaki, lengkap dengan GPS. Cocok untuk distribusi rutin ke gudang dan toko.",
    poin: ["136 unit armada milik sendiri", "Pantauan GPS 24 jam", "Sopir tetap, bukan borongan"],
    warna: "#1f3a5f",
    f: foto("truk-tol", "Truk boks melaju di jalan tol"),
  },
  {
    kode: "BHTU 100203",
    nama: "Gudang & cross-dock",
    sub: "Rungkut · 6.000 m²",
    isi: "Simpan, sortir, dan kemas ulang barang sebelum dikirim. Stok bisa dipantau lewat laporan harian.",
    poin: ["Rak selektif & area curah", "Forklift & reach truck", "Laporan stok harian"],
    warna: "#2f6b5a",
    f: foto("forklift", "Operator forklift di dalam gudang"),
  },
  {
    kode: "BHTU 100204",
    nama: "Kepabeanan & dokumen",
    sub: "PPJK · ekspor & impor",
    isi: "Pemberitahuan pabean, izin larangan-pembatasan, sampai pengurusan di pelabuhan. Supaya barang tidak tertahan berhari-hari.",
    poin: ["PPJK terdaftar", "Ekspor, impor, & barang antarpulau", "Konsultasi HS code"],
    warna: "#d99a2b",
    f: foto("admin-gudang", "Staf administrasi tersenyum di meja kerja"),
  },
];

export const armada = [
  ["Trailer 40 kaki", 24],
  ["Tronton", 32],
  ["Fuso", 40],
  ["CDD boks", 28],
  ["Pick-up", 12],
] as const;

// Data demo pelacakan kiriman
export const contohResi = "BLN-2610-0451";
export const lacak = {
  resi: contohResi,
  rute: "Surabaya → Makassar",
  muatan: "1 × 20 kaki · Bahan bangunan",
  kapal: "KM Sinar Bahari · Voy. 041",
  langkah: [
    { waktu: "01 Okt, 09.12", teks: "Barang diterima di gudang Rungkut", selesai: true },
    { waktu: "02 Okt, 14.40", teks: "Stuffing ke kontainer BHTU 260451 3", selesai: true },
    { waktu: "03 Okt, 21.05", teks: "Kapal berangkat dari Tanjung Perak", selesai: true },
    { waktu: "06 Okt, 07.30", teks: "Tiba di Pelabuhan Soekarno-Hatta, Makassar", selesai: false },
    { waktu: "06 Okt", teks: "Diantar ke alamat penerima", selesai: false },
  ],
};

export const legalitas = [
  ["NIB", "Izin usaha lengkap"],
  ["PPJK", "Terdaftar di Bea Cukai"],
  ["ISO 9001", "Manajemen mutu"],
  ["All-risk", "Asuransi kargo"],
];

export const galeri = [
  foto("perak-derek", "Derek-derek di Tanjung Perak"),
  foto("muat-pinisi", "Buruh memuat karung ke kapal"),
  foto("petugas", "Petugas lapangan berhelm dan rompi"),
  foto("kapal-tunda", "Kapal tunda merah saat senja"),
  foto("rapat", "Tim kantor berdiskusi"),
  foto("sortir", "Petugas gudang menyortir barang"),
];

export const fotoTim = foto("tim", "Tim Bahtera berdiskusi di kantor");
export const fotoPinisi = foto("pinisi", "Lambung kapal pinisi bercat merah putih biru");
export const fotoMalam = foto("pelabuhan-malam", "Pelabuhan peti kemas di malam hari");
