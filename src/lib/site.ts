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
// Undangan khusus tampilan HP, jadi tidak punya screenshot laptop: kartunya memakai 3 layar HP (phone = sampul,
// screens = mempelai & acara) di atas warna temanya (tone).
export const templates = [
  {
    slug: "kawalu-coffee",
    name: "Kawalu Coffee",
    kind: "Website UMKM",
    category: "umkm",
    url: "kawalucoffee.id",
    desc: "Kedai kopi di Serang, Banten: pembuka lanskap Gunung Karang yang bergerak saat digulir, menu & harga per kategori, pesan antar, jual biji kopi, serta jam buka live dan peta lokasi.",
    laptop: "/preview/laptop-kawalu-coffee.webp",
    phone: "/preview/hp-kawalu-1.webp",
    includes: ["Pembuka parallax", "Menu & harga", "Pesan antar & jual biji", "Jam buka live & peta"],
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
    slug: "laras-kinanti",
    name: "Laras Kinanti",
    kind: "Portofolio",
    category: "portofolio",
    url: "laraskinanti.com",
    desc: "Fotografer potret & dokumenter: dibuka dengan bingkai kamera yang mekar jadi layar penuh, seri foto yang bertumpuk saat digulir, rol film yang bergeser ke samping, dan daftar harga yang jelas. Parallax di setiap bagian.",
    laptop: "/preview/laptop-laras-kinanti.webp",
    phone: "/preview/hp-laras-1.webp",
    includes: ["Pembuka parallax", "Seri foto & galeri", "Rol film potret", "Harga & kontak"],
  },
  {
    slug: "undangan-fara-aditya-oriental-peony",
    name: "Fara & Aditya · Oriental Peony",
    kind: "Undangan Digital",
    category: "undangan",
    url: "faraaditya.my.id",
    desc: "Tema Oriental Peony: pernikahan bernuansa Tionghoa merah pernis, emas, dan giok, dengan lanskap lukisan biru-hijau, gerbang paifang, peoni, teratai, bambu, bangau, lentera merah, dan 囍. Dibuka dengan animasi kamera ±10 detik: menembus jendela bulan, melewati pegunungan berlapis, mendekati gerbang, lalu mundur ke kolam teratai berbingkai kayu merah. Galeri roda jendela bulan dan love story berupa gulungan lukisan yang terbuka saat digulir. Khusus tampilan HP.",
    phone: "/preview/hp-undangan-oriental-1.webp",
    screens: ["/preview/hp-undangan-oriental-2.webp", "/preview/hp-undangan-oriental-3.webp"],
    tone: { bg: "#f6e3d6", accent: "#9e1c22" },
    includes: ["Pembuka kamera 10 detik", "Galeri roda jendela bulan", "Love story gulungan lukisan", "Musik & angpao digital"],
  },
  {
    slug: "undangan-fara-aditya-putih-sakinah",
    name: "Fara & Aditya · Putih Sakinah",
    kind: "Undangan Digital",
    category: "undangan",
    url: "faraaditya.my.id",
    desc: "Tema Putih Sakinah: nuansa Islami putih mutiara, emas, dan hijau zamrud, dengan lentera kuningan, untaian melati, magnolia, dan anggrek bulan. Dibuka dengan pintu mihrab berkisi bintang delapan yang berayun 3D, lalu kamera menembus lengkung ke Taj Mahal saat fajar. Bismillah, ayat, dan doa dalam teks Arab, galeri jendela mihrab, dan perjalanan cinta berupa jendela berpintu yang terbuka saat digulir. Khusus tampilan HP.",
    phone: "/preview/hp-undangan-sakinah-1.webp",
    screens: ["/preview/hp-undangan-sakinah-2.webp", "/preview/hp-undangan-sakinah-3.webp"],
    tone: { bg: "#eef0ea", accent: "#0f3a31" },
    includes: ["Pembuka pintu mihrab 3D", "Ayat & doa teks Arab", "Galeri jendela mihrab", "Parallax penuh"],
  },
  {
    slug: "undangan-fara-aditya-merah-delima",
    name: "Fara & Aditya · Merah Delima",
    kind: "Undangan Digital",
    category: "undangan",
    url: "faraaditya.my.id",
    desc: "Tema Merah Delima: marun & blush bergaya cetakan tembaga, dengan mawar Redouté, dahan delima, dan merak putih. Dibuka dengan gerbang besi tempa yang berayun di dalam bingkai cermin, lalu kamera menembus ke lembah air terjun. Galeri tumpukan foto yang bisa digeser dan kisah cinta berupa surat bersegel lilin. Khusus tampilan HP.",
    phone: "/preview/hp-undangan-delima-1.webp",
    screens: ["/preview/hp-undangan-delima-2.webp", "/preview/hp-undangan-delima-3.webp"],
    tone: { bg: "#f3dfdb", accent: "#7b2431" },
    includes: ["Pembuka gerbang besi 3D", "Galeri tumpukan foto", "Surat cinta bersegel lilin", "Parallax penuh"],
  },
  {
    slug: "undangan-fara-aditya-biru-porselen",
    name: "Fara & Aditya · Biru Porselen",
    kind: "Undangan Digital",
    category: "undangan",
    url: "faraaditya.my.id",
    desc: "Tema Biru Porselen: biru kobalt & putih gading seperti lukisan porselen, dengan batik kawung dan jendela gunungan. Dibuka dengan pintu batik yang terbelah, rimbun emas yang tersibak, lalu kamera menembus jendela ke danau & air terjun. Galeri carousel cincin 3D dan kisah cinta berupa perjalanan horizontal. Khusus tampilan HP.",
    phone: "/preview/hp-undangan-porselen-1.webp",
    screens: ["/preview/hp-undangan-porselen-2.webp", "/preview/hp-undangan-porselen-3.webp"],
    tone: { bg: "#dfe6f1", accent: "#27427a" },
    includes: ["Pembuka jendela gunungan", "Galeri carousel cincin 3D", "Kisah cinta horizontal", "Parallax penuh"],
  },
  {
    slug: "undangan-fara-aditya-garden-premium",
    name: "Fara & Aditya · Garden Premium",
    kind: "Undangan Digital",
    category: "undangan",
    url: "faraaditya.my.id",
    desc: "Tema Garden Premium: taman bergaya cetakan toile teal dengan gapura bertiang, air mancur, merak, peony, dan wisteria. Dibuka dengan animasi kamera mundur berlapis dari balik bunga sampai seluruh gapura terlihat. Khusus tampilan HP.",
    phone: "/preview/hp-undangan-garden-1.webp",
    screens: ["/preview/hp-undangan-garden-2.webp", "/preview/hp-undangan-garden-3.webp"],
    tone: { bg: "#e2ebe7", accent: "#2f5d62" },
    includes: ["Pembuka kamera mundur berlapis", "Kartu acara berpintu taman", "Galeri pigura emas", "RSVP & amplop digital"],
  },
  {
    slug: "undangan-frisca-arif",
    name: "Frisca & Arif · Rose Plum",
    kind: "Undangan Digital",
    category: "undangan",
    url: "friscaarif.my.id",
    desc: "Undangan nuansa rose & plum dengan motif geometri Islami dan sentuhan Sunda: foto berbingkai lengkung, love story bergaris waktu, kartu acara bertumpuk, galeri coverflow, musik latar, RSVP, dan amplop digital bergaya kartu ATM. Khusus tampilan HP.",
    phone: "/preview/hp-undangan-frisca-1.webp",
    screens: ["/preview/hp-undangan-frisca-2.webp", "/preview/hp-undangan-frisca-3.webp"],
    tone: { bg: "#f4e6e2", accent: "#9c7880" },
    includes: ["Musik latar piringan hitam", "Love story bergaris waktu", "Galeri coverflow", "RSVP & amplop kartu ATM"],
  },
  {
    slug: "undangan-fara-aditya-luxury",
    name: "Fara & Aditya · Luxury",
    kind: "Undangan Digital",
    category: "undangan",
    url: "faraaditya.my.id",
    desc: "Tema Luxury: gaya majalah mewah ivory, taupe & emas. Foto besar bersudut lengkung, galeri carousel 3D, dan kisah cinta berbentuk bab-bab editorial. Khusus tampilan HP.",
    phone: "/preview/hp-undangan-luxury-1.webp",
    screens: ["/preview/hp-undangan-luxury-2.webp", "/preview/hp-undangan-luxury-3.webp"],
    tone: { bg: "#efe7dc", accent: "#8b6f4e" },
    includes: ["Sampul tirai terangkat", "Galeri carousel 3D", "Kisah cinta per bab", "Amplop kartu hitam metalik"],
  },
  {
    slug: "undangan-fara-aditya-sunda",
    name: "Fara & Aditya · Art Sunda",
    kind: "Undangan Digital",
    category: "undangan",
    url: "faraaditya.my.id",
    desc: "Tema Art Sunda: pintu bermotif mega mendung yang terbuka, Gedung Sate, kujang, siger, dan bunga melati-kenanga di atas kertas krem. Khusus tampilan HP.",
    phone: "/preview/hp-undangan-sunda-1.webp",
    screens: ["/preview/hp-undangan-sunda-2.webp", "/preview/hp-undangan-sunda-3.webp"],
    tone: { bg: "#f3ead9", accent: "#8a3f2b" },
    includes: ["Sampul pintu mega mendung", "Ornamen kujang & aksara Sunda", "Galeri layar penuh", "RSVP & amplop digital"],
  },
  {
    slug: "undangan-fara-aditya-rimba",
    name: "Fara & Aditya · Rimba",
    kind: "Undangan Digital",
    category: "undangan",
    url: "faraaditya.my.id",
    desc: "Tema Rimba: hutan berkabut dari lukisan klasik, bunga ilustrasi botani, dan bingkai emas. Khusus tampilan HP, dengan animasi masuk yang beragam dan galeri yang membesar saat diketuk.",
    phone: "/preview/hp-undangan-rimba-1.webp",
    screens: ["/preview/hp-undangan-rimba-2.webp", "/preview/hp-undangan-rimba-3.webp"],
    tone: { bg: "#1d2b22", accent: "#d8b56e" },
    includes: ["Sampul buka undangan", "Ayat & salam", "Galeri layar penuh", "RSVP & amplop digital"],
  },
];

// Potongan layar desktop & HP dari demo, untuk kolom bergerak di hero
const kawalu = "kawalucoffee.id";
const arunika = "arunikakonstruksi.co.id";
const laras = "laraskinanti.com";
const faraAditya = "faraaditya.my.id";
export const heroShots = {
  desktop: [
    { src: "/preview/laptop-kawalu-coffee.webp", url: kawalu },
    { src: "/preview/web-arunika-2.webp", url: arunika },
    { src: "/preview/laptop-laras-kinanti.webp", url: laras },
    { src: "/preview/web-kawalu-2.webp", url: kawalu },
    { src: "/preview/laptop-arunika-konstruksi.webp", url: arunika },
    { src: "/preview/web-laras-2.webp", url: laras },
    { src: "/preview/web-arunika-3.webp", url: arunika },
  ],
  phone: [
    { src: "/preview/hp-arunika-1.webp", url: arunika },
    { src: "/preview/hp-kawalu-1.webp", url: kawalu },
    { src: "/preview/hp-laras-1.webp", url: laras },
    { src: "/preview/hp-arunika-2.webp", url: arunika },
    { src: "/preview/hp-kawalu-2.webp", url: kawalu },
    { src: "/preview/hp-laras-2.webp", url: laras },
    { src: "/preview/hp-undangan-rimba-1.webp", url: faraAditya },
    { src: "/preview/hp-undangan-sunda-1.webp", url: faraAditya },
    { src: "/preview/hp-undangan-luxury-1.webp", url: faraAditya },
    { src: "/preview/hp-undangan-frisca-1.webp", url: "friscaarif.my.id" },
    { src: "/preview/hp-undangan-garden-1.webp", url: faraAditya },
    { src: "/preview/hp-undangan-porselen-1.webp", url: faraAditya },
  ],
};
