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

// Link biasa di menu utama. "Layanan", "Template", dan "Resources" punya dropdown sendiri.
export const navLinks = [{ href: "/#faq", label: "FAQ", icon: "help" }] as const;

// Isi dropdown "Resources": halaman-halaman pendukung
export const resourcesLinks = [
  { href: "/tentang", label: "Tentang Kami", desc: "Siapa kami & arti nama Webkeun", icon: "user" },
  { href: "/kontak", label: "Kontak", desc: "Ngobrol & konsultasi gratis", icon: "chat" },
] as const;

export const footerLinks = [
  { href: "/template", label: "Template" },
  { href: "/#harga", label: "Harga" },
  { href: "/#faq", label: "FAQ" },
  { href: "/tentang", label: "Tentang Kami" },
  { href: "/kontak", label: "Kontak" },
];

// Isi dropdown "Layanan": subjudul di landing page
export const aboutLinks = [
  { href: "/#kenapa", label: "Kenapa Webkeun", desc: "Yang bikin kami beda", icon: "zap" },
  { href: "/#fitur", label: "Fitur yang termasuk", desc: "Domain, hosting, SEO dasar, dll.", icon: "check" },
  { href: "/#harga", label: "Harga paket", desc: "Mulai 499rb, sekali bayar", icon: "tag" },
  { href: "/#cara-kerja", label: "Cara kerja", desc: "Dari ngobrol sampai online", icon: "steps" },
  { href: "/#faq", label: "Pertanyaan umum", desc: "Yang sering ditanyain", icon: "help" },
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
    slug: "website-umkm",
    title: "Website UMKM",
    short: "Buat warung, toko, dan usaha jasa",
    desc: "Biar warung, toko, atau usaha jasa kamu gampang dicari di Google dan kelihatan lebih meyakinkan.",
    fit: "Kafe, laundry, katering, bengkel, toko online kecil",
    price: "mulai 499rb",
  },
  {
    icon: "building",
    slug: "company-profile",
    title: "Company Profile",
    short: "Wajah resmi perusahaan kamu",
    desc: "Wajah resmi perusahaan kamu di internet. Profil, layanan, klien, dan kontak dalam satu tempat.",
    fit: "CV, PT, kontraktor, sekolah, klinik",
    price: "mulai 1,49jt",
  },
  {
    icon: "user",
    slug: "portofolio",
    title: "Portofolio Pribadi",
    short: "Pamerkan karya & pengalaman",
    desc: "Tunjukin karya dan pengalaman kamu dengan cara yang lebih keren daripada PDF.",
    fit: "Desainer, fotografer, freelancer, pencari kerja",
    price: "mulai 499rb",
  },
  {
    icon: "sliders",
    slug: "custom",
    title: "Custom",
    short: "Toko online, booking, dashboard",
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

// Kategori template; slug-nya dipakai di URL /template?kategori=<slug>
export const templateCategories = [
  { slug: "umkm", label: "Website UMKM", desc: "Kafe, toko, usaha jasa", icon: "store" },
  { slug: "company-profile", label: "Company Profile", desc: "CV, PT, kontraktor", icon: "building" },
  { slug: "portofolio", label: "Portofolio", desc: "Desainer, fotografer", icon: "user" },
  { slug: "undangan", label: "Undangan Digital", desc: "Pernikahan online", icon: "heart" },
] as const;

// Template website & undangan. Halaman demonya ada di /template/<slug>.
// Gambar di /public/preview adalah screenshot dari halaman demo itu; kalau tampilannya diubah, ambil ulang.
export const templates = [
  {
    slug: "kopi-senja",
    name: "Kopi Senja",
    kind: "Website UMKM",
    category: "umkm",
    url: "kopisenja.id",
    desc: "Kedai kopi di Bandung: menu lengkap dengan harga, jam buka, dan alamat. Pelanggan bisa langsung pesan antar.",
    laptop: "/preview/laptop-kopi-senja.webp",
    phone: "/preview/hp-kopi-senja-1.webp",
    includes: ["Menu & harga", "Jam buka", "Lokasi", "Tombol pesan antar"],
  },
  {
    slug: "arunika-konstruksi",
    name: "Arunika Konstruksi",
    kind: "Company Profile",
    category: "company-profile",
    url: "arunikakonstruksi.co.id",
    desc: "Kontraktor umum: profil perusahaan, layanan, dan proyek terbaru, dibuat tegas supaya calon klien langsung percaya.",
    laptop: "/preview/laptop-arunika-konstruksi.webp",
    phone: "/preview/hp-arunika-1.webp",
    includes: ["Profil perusahaan", "Layanan", "Proyek terbaru", "Kontak"],
  },
  {
    slug: "nadia-putri",
    name: "Nadia Putri",
    kind: "Portofolio",
    category: "portofolio",
    url: "nadiaputri.com",
    desc: "Desainer grafis: karya pilihan ditata bersih dan lega, jadi hasil kerjanya yang paling menonjol.",
    laptop: "/preview/laptop-nadia-putri.webp",
    phone: "/preview/hp-nadia-1.webp",
    includes: ["Karya pilihan", "Tentang saya", "Kontak"],
  },
  {
    slug: "undangan-rara-dimas",
    name: "Rara & Dimas",
    kind: "Undangan Digital",
    category: "undangan",
    url: "rarandimas.my.id",
    desc: "Undangan pernikahan bernuansa sage yang kalem. Nama tamu tampil di sampul, lengkap dengan lokasi dan RSVP.",
    laptop: "/preview/laptop-undangan-rara-dimas.webp",
    phone: "/preview/hp-undangan-1.webp",
    includes: ["Nama tamu di sampul", "Hitung mundur", "RSVP & ucapan", "Amplop digital"],
  },
];

// Potongan layar desktop & HP dari demo, untuk kolom bergerak di hero
const kopi = "kopisenja.id";
const arunika = "arunikakonstruksi.co.id";
const nadia = "nadiaputri.com";
const undangan = "rarandimas.my.id";
export const heroShots = {
  desktop: [
    { src: "/preview/laptop-kopi-senja.webp", url: kopi },
    { src: "/preview/web-arunika-2.webp", url: arunika },
    { src: "/preview/laptop-nadia-putri.webp", url: nadia },
    { src: "/preview/web-kopi-senja-2.webp", url: kopi },
    { src: "/preview/laptop-undangan-rara-dimas.webp", url: undangan },
    { src: "/preview/laptop-arunika-konstruksi.webp", url: arunika },
    { src: "/preview/web-nadia-2.webp", url: nadia },
    { src: "/preview/web-arunika-3.webp", url: arunika },
  ],
  phone: [
    { src: "/preview/hp-arunika-1.webp", url: arunika },
    { src: "/preview/hp-kopi-senja-1.webp", url: kopi },
    { src: "/preview/hp-undangan-1.webp", url: undangan },
    { src: "/preview/hp-nadia-1.webp", url: nadia },
    { src: "/preview/hp-arunika-2.webp", url: arunika },
    { src: "/preview/hp-kopi-senja-2.webp", url: kopi },
    { src: "/preview/hp-nadia-2.webp", url: nadia },
  ],
};
