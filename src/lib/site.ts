// Semua konten website Webkeun ada di sini.
// Mau ganti harga, nomor WA, atau teks? Cukup edit file ini.

export const site = {
  name: "Webkeun",
  tagline: "Yuk webkeun",
  description:
    "Jasa pembuatan website UMKM, company profile, dan portofolio. Rapi, cepat, enak dilihat di HP, dan harganya masuk akal.",
  whatsapp: "6283125043525", // format internasional, tanpa + dan tanpa 0 di depan
  whatsappDisplay: "0831-2504-3525",
};

export function waLink(message = "Halo Webkeun, aku mau tanya-tanya soal pembuatan website.") {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const navLinks = [
  { href: "#layanan", label: "Layanan", icon: "layers" },
  { href: "#contoh", label: "Contoh", icon: "browser" },
  { href: "#harga", label: "Harga", icon: "tag" },
  { href: "#cara-kerja", label: "Cara kerja", icon: "steps" },
  { href: "#faq", label: "FAQ", icon: "help" },
] as const;

// Ringkasan singkat di bawah hero
export const facts = [
  { icon: "wallet", title: "Mulai 499rb", desc: "Sekali bayar, domain & hosting tahun pertama sudah termasuk." },
  { icon: "clock", title: "Jadi ±3–7 hari", desc: "Dihitung sejak materi lengkap sampai website online." },
  { icon: "chat", title: "Konsultasi gratis", desc: "Ngobrol dulu lewat WhatsApp, tanpa kewajiban apa-apa." },
] as const;

// Fitur yang sudah termasuk di setiap website
export const features = [
  {
    icon: "phone",
    title: "Rapi di HP & laptop",
    desc: "Kebanyakan pelanggan buka dari HP. Tampilan website kamu kami pastikan tetap rapi dan enak dibaca di layar kecil.",
  },
  {
    icon: "whatsapp",
    title: "Tombol WhatsApp langsung",
    desc: "Pengunjung tinggal klik sekali buat chat atau pesan. Pesan pembukanya bisa diatur sesuai usaha kamu.",
  },
  {
    icon: "search",
    title: "Gampang dicari di Google",
    desc: "Judul, deskripsi, dan struktur halaman kami rapikan (SEO dasar) supaya usaha kamu lebih mudah ditemukan.",
  },
  {
    icon: "globe",
    title: "Domain & hosting termasuk",
    desc: "Alamat website pakai nama usaha kamu sendiri. Tahun pertama sudah kami urus, kamu tinggal pakai.",
  },
  {
    icon: "pin",
    title: "Lokasi Google Maps",
    desc: "Peta dan petunjuk arah langsung di website, jadi pelanggan nggak nyasar waktu mau mampir.",
  },
  {
    icon: "image",
    title: "Katalog & galeri",
    desc: "Pajang menu, produk, atau hasil kerja kamu dengan foto yang tertata rapi.",
  },
  {
    icon: "zap",
    title: "Cepat dibuka",
    desc: "Halaman ringan dan gambar dioptimasi, jadi tetap cepat walau sinyal lagi pas-pasan.",
  },
  {
    icon: "edit",
    title: "Bisa revisi",
    desc: "Kurang sreg sama warna, teks, atau foto? Bilang aja, kita rapikan bareng sesuai jatah revisi paketmu.",
  },
] as const;

export const services = [
  {
    icon: "store",
    title: "Website UMKM",
    desc: "Biar warung, toko, atau usaha jasa kamu gampang dicari di Google dan kelihatan lebih meyakinkan.",
    fit: "Kafe, laundry, katering, bengkel, toko online kecil",
    price: "mulai 499rb",
  },
  {
    icon: "building",
    title: "Company Profile",
    desc: "Wajah resmi perusahaan kamu di internet. Profil, layanan, klien, dan kontak dalam satu tempat.",
    fit: "CV, PT, kontraktor, sekolah, klinik",
    price: "mulai 1,49jt",
  },
  {
    icon: "user",
    title: "Portofolio Pribadi",
    desc: "Tunjukin karya dan pengalaman kamu dengan cara yang lebih keren daripada PDF.",
    fit: "Desainer, fotografer, freelancer, pencari kerja",
    price: "mulai 499rb",
  },
  {
    icon: "sliders",
    title: "Custom",
    desc: "Punya ide yang lebih spesifik? Toko online, sistem booking, atau dashboard. Kita obrolin bareng.",
    fit: "Kebutuhan khusus sesuai request",
    price: "ngobrol dulu",
  },
] as const;

export const packages = [
  {
    name: "Starter",
    for: "Buat yang baru mulai",
    price: "499rb",
    priceNote: "sekali bayar",
    features: [
      "1 halaman (landing page)",
      "Rapi di HP & laptop",
      "Tombol WhatsApp & Google Maps",
      "Domain .my.id + hosting 1 tahun",
      "2x revisi",
      "Jadi ±3 hari kerja",
    ],
    highlight: false,
  },
  {
    name: "Bisnis",
    for: "Paling pas buat usaha yang serius",
    price: "1,49jt",
    priceNote: "sekali bayar",
    features: [
      "Sampai 5 halaman",
      "Domain .com + hosting 1 tahun",
      "SEO dasar biar muncul di Google",
      "Katalog produk / galeri",
      "Form kontak",
      "3x revisi",
      "Jadi ±7 hari kerja",
    ],
    highlight: true,
  },
  {
    name: "Custom",
    for: "Fitur sesuai kebutuhan",
    price: "Ngobrol dulu",
    priceNote: "harga sesuai skop",
    features: [
      "Toko online & pembayaran",
      "Sistem booking / reservasi",
      "Dashboard admin",
      "Integrasi sesuai request",
      "Konsultasi gratis",
    ],
    highlight: false,
  },
];

export const steps = [
  {
    title: "Ngobrol dulu",
    desc: "Ceritain usaha kamu lewat WhatsApp. Gratis, nggak ada kewajiban apa-apa.",
  },
  {
    title: "Kami rancang",
    desc: "Kamu dapat desain awal buat dicek. Mau warna, foto, atau teksnya diganti? Bilang aja.",
  },
  {
    title: "Revisi bareng",
    desc: "Kita rapikan sampai kamu sreg. Kamu bisa lihat progresnya langsung dari link.",
  },
  {
    title: "Online!",
    desc: "Website tayang pakai domain kamu sendiri. Tinggal share link-nya ke pelanggan.",
  },
];

export const faqs = [
  {
    q: "Aku nggak ngerti teknis sama sekali. Bisa?",
    a: "Bisa banget. Kamu cukup kirim info usaha, foto, dan logo (kalau ada). Urusan teknis, domain, dan hosting biar kami yang beresin.",
  },
  {
    q: "Berapa lama websitenya jadi?",
    a: "Paket Starter sekitar 3 hari kerja, paket Bisnis sekitar 7 hari kerja. Waktunya dihitung setelah semua materi (teks, foto, logo) lengkap.",
  },
  {
    q: "Domain dan hosting gimana?",
    a: "Sudah termasuk untuk tahun pertama. Tahun berikutnya kamu cukup bayar perpanjangannya aja, nanti kami ingatkan sebelum jatuh tempo.",
  },
  {
    q: "Kalau mau ganti isi website setelah jadi?",
    a: "Perubahan kecil (ganti teks, harga, atau foto) bisa langsung chat kami. Untuk perubahan besar, kita obrolin dulu skopnya.",
  },
  {
    q: "Bayarnya gimana?",
    a: "DP 50% di awal untuk mulai pengerjaan, sisanya dilunasi setelah website siap online. Bisa transfer bank atau e-wallet.",
  },
  {
    q: "Bisa bikin toko online atau fitur khusus?",
    a: "Bisa, lewat paket Custom. Ceritain dulu kebutuhannya, nanti kami kasih rincian fitur dan harganya.",
  },
];

// Gambar di /public/contoh adalah screenshot dari halaman demo di /contoh/*.
// Kalau tampilan demonya diubah, ambil ulang screenshot-nya.
export const demos = [
  {
    slug: "kopi-senja",
    name: "Kopi Senja",
    kind: "Website UMKM",
    url: "kopisenja.id",
    desc: "Kedai kopi di Bandung: menu lengkap dengan harga, jam buka, dan alamat. Pelanggan bisa langsung pesan antar.",
    laptop: "/contoh/laptop-kopi-senja.webp",
    phone: "/contoh/hp-kopi-senja-1.webp",
  },
  {
    slug: "arunika-konstruksi",
    name: "Arunika Konstruksi",
    kind: "Company Profile",
    url: "arunikakonstruksi.co.id",
    desc: "Kontraktor umum: profil perusahaan, layanan, dan proyek terbaru, dibuat tegas supaya calon klien langsung percaya.",
    laptop: "/contoh/laptop-arunika-konstruksi.webp",
    phone: "/contoh/hp-arunika-1.webp",
  },
  {
    slug: "nadia-putri",
    name: "Nadia Putri",
    kind: "Portofolio",
    url: "nadiaputri.com",
    desc: "Desainer grafis: karya pilihan ditata bersih dan lega, jadi hasil kerjanya yang paling menonjol.",
    laptop: "/contoh/laptop-nadia-putri.webp",
    phone: "/contoh/hp-nadia-1.webp",
  },
];

// Potongan layar HP dari demo, untuk kolom bergerak di hero
export const heroShots = [
  ["/contoh/hp-kopi-senja-1.webp", "/contoh/hp-arunika-2.webp", "/contoh/hp-nadia-2.webp"],
  ["/contoh/hp-arunika-1.webp", "/contoh/hp-kopi-senja-2.webp", "/contoh/hp-nadia-1.webp"],
  ["/contoh/hp-nadia-1.webp", "/contoh/hp-arunika-3.webp", "/contoh/hp-kopi-senja-1.webp"],
];
