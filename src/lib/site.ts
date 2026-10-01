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
  { href: "#layanan", label: "Layanan" },
  { href: "#contoh", label: "Contoh" },
  { href: "#harga", label: "Harga" },
  { href: "#cara-kerja", label: "Cara kerja" },
  { href: "#faq", label: "FAQ" },
];

export const services = [
  {
    title: "Website UMKM",
    desc: "Biar warung, toko, atau usaha jasa kamu gampang dicari di Google dan kelihatan lebih meyakinkan.",
    fit: "Kafe, laundry, katering, bengkel, toko online kecil",
    price: "mulai 499rb",
  },
  {
    title: "Company Profile",
    desc: "Wajah resmi perusahaan kamu di internet. Profil, layanan, klien, dan kontak dalam satu tempat.",
    fit: "CV, PT, kontraktor, sekolah, klinik",
    price: "mulai 1,49jt",
  },
  {
    title: "Portofolio Pribadi",
    desc: "Tunjukin karya dan pengalaman kamu dengan cara yang lebih keren daripada PDF.",
    fit: "Desainer, fotografer, freelancer, pencari kerja",
    price: "mulai 499rb",
  },
  {
    title: "Custom",
    desc: "Punya ide yang lebih spesifik? Toko online, sistem booking, atau dashboard. Kita obrolin bareng.",
    fit: "Kebutuhan khusus sesuai request",
    price: "ngobrol dulu",
  },
];

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

export const demos = [
  {
    slug: "kopi-senja",
    name: "Kopi Senja",
    kind: "Website UMKM",
    url: "kopisenja.id",
    bg: "bg-[#f3e9dc]",
  },
  {
    slug: "arunika-konstruksi",
    name: "Arunika Konstruksi",
    kind: "Company Profile",
    url: "arunikakonstruksi.co.id",
    bg: "bg-[#0f2a3d]",
  },
  {
    slug: "nadia-putri",
    name: "Nadia Putri",
    kind: "Portofolio",
    url: "nadiaputri.com",
    bg: "bg-white",
  },
];
