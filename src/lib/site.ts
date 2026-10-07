// Semua konten website Webkeun ada di sini.
// Mau ganti harga, nomor WA, atau teks? Cukup edit file ini.

export const site = {
  name: "Webkeun",
  tagline: "Yuk webkeun",
  // produk utama Webkeun: undangan digital pernikahan, lalu jasa pembuatan website
  description:
    "Undangan digital pernikahan mulai Rp99rb (nama tamu, RSVP, musik) dan jasa pembuatan website mulai Rp450rb untuk UMKM, company profile, dan portofolio.",
  whatsapp: "6283125043525", // format internasional, tanpa + dan tanpa 0 di depan
  whatsappDisplay: "0831-2504-3525",
  email: "yukwebkeun@gmail.com",
};

export function mailLink(subject = "Tanya soal undangan digital & website") {
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
}

export function waLink(message = "Halo Webkeun, aku mau tanya-tanya soal undangan digital atau website.") {
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
  { href: "/template/undangan", label: "Undangan Digital" },
  { href: "/template", label: "Template Website" },
  { href: "/#harga", label: "Harga" },
  { href: "/#faq", label: "FAQ" },
  { href: "/tentang", label: "Tentang Kami" },
  { href: "/kontak", label: "Kontak" },
];

// Isi dropdown "Layanan": subjudul di landing page
export const aboutLinks = [
  { href: "/#kenapa", label: "Kenapa Webkeun", desc: "Yang bikin kami beda", icon: "zap" },
  { href: "/#fitur", label: "Fitur yang termasuk", desc: "Domain, hosting, SEO dasar, dll.", icon: "check" },
  { href: "/#harga", label: "Harga paket", desc: "Undangan 99rb · website 450rb", icon: "tag" },
  { href: "/#cara-kerja", label: "Cara kerja", desc: "Dari ngobrol sampai online", icon: "steps" },
  { href: "/#faq", label: "Pertanyaan umum", desc: "Yang sering ditanyain", icon: "help" },
] as const;

// Ringkasan singkat di bawah hero
export const facts = [
  { icon: "heart", title: "Undangan mulai 99rb", desc: "Nama tiap tamu tertulis di link-nya, tinggal sebar lewat WhatsApp." },
  { icon: "wallet", title: "Website mulai 450rb", desc: "Rapi di HP, ada tombol WhatsApp, dan bisa revisi." },
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
    title: "Domain & hosting diurus",
    desc: "Urusan domain dan hosting kami yang atur. Paket Bisnis ke atas sudah termasuk domain atas nama usaha kamu.",
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
    icon: "heart",
    slug: "undangan",
    title: "Undangan Digital",
    short: "Undangan pernikahan online",
    desc: "Undangan pernikahan yang tinggal disebar lewat WhatsApp. Ada nama tamu, RSVP, galeri foto, dan peta lokasi acara.",
    fit: "Akad, resepsi, lamaran, tasyakuran",
    price: "mulai 99rb",
  },
  {
    icon: "store",
    slug: "website-umkm",
    title: "Website UMKM",
    short: "Buat warung, toko, dan usaha jasa",
    desc: "Biar warung, toko, atau usaha jasa kamu gampang dicari di Google dan kelihatan lebih meyakinkan.",
    fit: "Kafe, laundry, katering, bengkel, toko online kecil",
    price: "mulai 450rb",
  },
  {
    icon: "building",
    slug: "company-profile",
    title: "Company Profile",
    short: "Wajah resmi perusahaan kamu",
    desc: "Wajah resmi perusahaan kamu di internet. Profil, layanan, klien, dan kontak dalam satu tempat.",
    fit: "CV, PT, kontraktor, sekolah, klinik",
    price: "mulai 850rb",
  },
  {
    icon: "user",
    slug: "portofolio",
    title: "Portofolio Pribadi",
    short: "Pamerkan karya & pengalaman",
    desc: "Tunjukin karya dan pengalaman kamu dengan cara yang lebih keren daripada PDF.",
    fit: "Desainer, fotografer, freelancer, pencari kerja",
    price: "mulai 450rb",
  },
  {
    icon: "sliders",
    slug: "custom",
    title: "Custom",
    short: "Toko online, booking, dashboard",
    desc: "Punya ide yang lebih spesifik? Toko online, sistem booking, atau dashboard. Kita obrolin bareng.",
    fit: "Kebutuhan khusus sesuai request",
    price: "mulai 1,5jt",
  },
] as const;

// Panggung pratinjau di section Layanan (landing page): contoh website yang "tergulir" di bingkai browser & HP,
// fitur yang disorot, dan celetukan maskot. Screenshot diambil dari /public/preview/<kategori>.
// Custom belum punya contoh jadi, jadi digambar sebagai rancangan sistem booking (web & hp = null).
export const serviceShowcase = {
  "website-umkm": {
    tab: "UMKM",
    nama: "Kawalu Coffee",
    domain: "kawalucoffee.id",
    demo: "/template/kawalu-coffee",
    web: ["/preview/umkm/laptop-kawalu-coffee.webp", "/preview/umkm/web-kawalu-2.webp"],
    hp: ["/preview/umkm/hp-kawalu-1.webp", "/preview/umkm/hp-kawalu-2.webp"],
    mood: "senyum",
    line: "Warungmu jadi gampang dicari!",
    chips: [
      ["tag", "Menu & harga"],
      ["whatsapp", "Pesan lewat WA"],
      ["pin", "Peta lokasi"],
    ],
  },
  "company-profile": {
    tab: "Company",
    nama: "Bahtera Lintas Nusantara",
    domain: "bahteralogistik.co.id",
    demo: "/template/bahtera-logistik",
    web: ["/preview/company-profile/laptop-bahtera-logistik.webp", "/preview/company-profile/web-bahtera-2.webp"],
    hp: ["/preview/company-profile/hp-bahtera-1.webp", "/preview/company-profile/hp-bahtera-2.webp"],
    mood: "kedip",
    line: "Langsung kelihatan bonafide.",
    chips: [
      ["building", "Profil & legalitas"],
      ["layers", "Daftar layanan"],
      ["edit", "Form penawaran"],
    ],
  },
  portofolio: {
    tab: "Portofolio",
    nama: "Laras Kinanti",
    domain: "laraskinanti.com",
    demo: "/template/laras-kinanti",
    web: ["/preview/portofolio/laptop-laras-kinanti.webp", "/preview/portofolio/web-laras-2.webp"],
    hp: ["/preview/portofolio/hp-laras-1.webp", "/preview/portofolio/hp-laras-2.webp"],
    mood: "tertawa",
    line: "Karyamu, panggungmu.",
    chips: [
      ["image", "Galeri karya"],
      ["user", "Tentang aku"],
      ["chat", "Kontak & sosmed"],
    ],
  },
  // Undangan dibuat untuk HP; di panggung dua tema bergantian (Garden → Porselen) supaya kelihatan ada banyak pilihan
  undangan: {
    tab: "Undangan",
    nama: "undangan Fara & Aditya",
    domain: "fara-aditya.my.id",
    demo: "/template/undangan",
    web: ["/preview/undangan/laptop-undangan-garden.webp", "/preview/undangan/laptop-undangan-porselen.webp"],
    hp: ["/preview/undangan/hp-undangan-garden-1.webp", "/preview/undangan/hp-undangan-porselen-1.webp"],
    mood: "kedip",
    line: "Tinggal sebar ke tamu!",
    chips: [
      ["heart", "RSVP & ucapan"],
      ["image", "Galeri prewedding"],
      ["wallet", "Amplop digital"],
    ],
  },
  custom: {
    tab: "Custom",
    nama: "Sistem booking",
    domain: "ide-kamu.id/booking",
    demo: null,
    web: null,
    hp: null,
    mood: "kaget",
    line: "Ada ide? Hayu diobrolin!",
    chips: [
      ["clock", "Booking jadwal"],
      ["sliders", "Dashboard admin"],
      ["wallet", "Bayar online"],
    ],
  },
} as const;

// Daftar harga (disepakati tim, Oktober 2026). Add-on (express, perpanjangan undangan, kelola website) belum final,
// jadi belum ditampilkan. nilai: angka rupiah untuk data terstruktur Google. dasar: paket yang fiturnya ikut semua.
export type Paket = {
  nama: string;
  harga: string;
  nilai: number;
  mulai?: boolean;
  sorot?: string;
  untuk: string;
  aktif?: string;
  dasar?: string;
  fitur: string[];
};

export const hargaPaket = {
  undangan: {
    label: "Undangan Digital",
    ikon: "heart",
    ket: "Link undangan untuk dibagikan ke tamu",
    paket: [
      {
        nama: "Basic",
        harga: "99rb",
        nilai: 99_000,
        untuk: "Undangan simpel yang tetap cantik",
        aktif: "3 bulan",
        fitur: ["Template siap pakai", "Nama tamu di link", "Hitung mundur acara", "Peta lokasi"],
      },
      {
        nama: "Premium",
        harga: "229rb",
        nilai: 229_000,
        sorot: "Terlaris",
        untuk: "Paling lengkap buat hari bahagia",
        aktif: "6 bulan",
        dasar: "Basic",
        fitur: ["Galeri foto & musik", "RSVP & ucapan tamu", "Amplop digital", "Link live streaming"],
      },
      {
        nama: "Exclusive",
        harga: "499rb",
        nilai: 499_000,
        untuk: "Desain khusus, cuma punya kalian",
        aktif: "12 bulan",
        dasar: "Premium",
        fitur: ["Desain custom penuh", "Domain sendiri"],
      },
    ] as Paket[],
  },
  website: {
    label: "Pembuatan Website",
    ikon: "browser",
    ket: "UMKM · company profile · portofolio",
    paket: [
      {
        nama: "Basic",
        harga: "450rb",
        nilai: 450_000,
        untuk: "Buat yang baru mulai online",
        fitur: ["1 halaman landing page", "Tombol WhatsApp", "Tampilan rapi di HP", "2× revisi"],
      },
      {
        nama: "Bisnis",
        harga: "850rb",
        nilai: 850_000,
        sorot: "Paling pas",
        untuk: "Buat usaha yang mau tampil serius",
        fitur: ["Hingga 5 halaman", "Domain 1 tahun", "Tombol WhatsApp & peta", "3× revisi"],
      },
      {
        nama: "Premium",
        harga: "1,5jt",
        nilai: 1_500_000,
        mulai: true,
        untuk: "Fitur sesuai kebutuhan kamu",
        fitur: ["Halaman & fitur custom", "Katalog produk / blog", "Maintenance 3 bulan"],
      },
    ] as Paket[],
  },
} as const;
export type JenisHarga = keyof typeof hargaPaket;

export const steps = [
  {
    title: "Ngobrol dulu",
    desc: "Ceritain acara atau usaha kamu lewat WhatsApp. Gratis, nggak ada kewajiban apa-apa.",
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
    desc: "Undangan atau website kamu tayang. Tinggal sebar link-nya ke tamu atau pelanggan.",
  },
];

export const faqs = [
  {
    q: "Webkeun juga bikin undangan digital?",
    a: "Bisa banget, malah itu layanan andalan kami. Undangan pernikahan yang tinggal disebar lewat WhatsApp: nama tiap tamu tertulis di link-nya, ada RSVP & ucapan, galeri foto, peta lokasi, musik, dan amplop digital. Semua temanya bisa dicoba di halaman Undangan Digital.",
  },
  {
    q: "Aku nggak ngerti teknis sama sekali. Bisa?",
    a: "Bisa banget. Kamu cukup kirim info usaha, foto, dan logo (kalau ada). Urusan teknis, domain, dan hosting biar kami yang beresin.",
  },
  {
    q: "Berapa lama websitenya jadi?",
    a: "Website paket Basic sekitar 3 hari kerja, paket Bisnis sekitar 7 hari kerja. Waktunya dihitung setelah semua materi (teks, foto, logo) lengkap.",
  },
  {
    q: "Domain dan hosting gimana?",
    a: "Paket website Bisnis sudah termasuk domain untuk tahun pertama. Tahun berikutnya cukup bayar perpanjangannya, nanti kami ingatkan sebelum jatuh tempo. Untuk undangan, paket Exclusive sudah pakai domain sendiri.",
  },
  {
    q: "Kalau mau ganti isi website setelah jadi?",
    a: "Perubahan kecil (ganti teks, harga, atau foto) bisa langsung chat kami. Untuk perubahan besar, kita obrolin dulu skopnya.",
  },
  {
    q: "Bayarnya gimana?",
    a: "DP 50% di awal untuk mulai pengerjaan, sisanya dilunasi setelah undangan atau website siap online. Bisa transfer bank atau QRIS.",
  },
  {
    q: "Bisa bikin toko online atau fitur khusus?",
    a: "Bisa, lewat paket website Premium (mulai 1,5jt). Ceritain dulu kebutuhannya, nanti kami kasih rincian fitur dan harganya.",
  },
];

// Testimoni klien. Yang pertama tampil besar sebagai percakapan WhatsApp, sisanya sebagai kartu di bawahnya.
// sorotan: potongan kalimat dari `isi` yang diberi stabilo. karya: hasil kerja yang bisa dilihat pengunjung.
// CONTOH: testimoni Frisca & Arif di bawah masih data dummy. Ganti dengan kata-kata mereka sendiri (dan minta izin
// menampilkan nama & foto) sebelum dipakai untuk promosi.
export type Testimoni = {
  nama: string;
  panggilan: string;
  layanan: string;
  bintang: number;
  isi: string;
  sorotan?: string;
  reaksi?: string;
  balasan: string;
  foto: string;
  waktu: string;
  karya?: { href: string; layar: string; label: string };
};

export const testimonials: Testimoni[] = [
  {
    nama: "Frisca Triani & Arif Rahman",
    panggilan: "Frisca & Arif",
    layanan: "Undangan digital pernikahan",
    bintang: 5,
    isi: "Kak, makasih banyak ya! Undangannya cantik banget, tamu-tamu pada nanya bikin di mana. Nama tiap tamu muncul di link-nya, musiknya pas, dan RSVP-nya bikin kami gampang ngitung catering. Revisi juga diladenin sampai kami bener-bener puas. Pokoknya recommended!",
    sorotan: "tamu-tamu pada nanya bikin di mana",
    reaksi: "🥹🤍",
    balasan: "Sama-sama, Kak Frisca & Kak Arif! Ikut seneng undangannya disukai. Selamat menempuh hidup baru ya 🤍",
    foto: "/undangan/frisca-arif/dsc00251.webp",
    waktu: "19.42",
    karya: { href: "/template/undangan-frisca-arif", layar: "/preview/undangan/hp-undangan-frisca-1.webp", label: "Lihat undangan mereka" },
  },
];

// Kategori template. Kategori website difilter di /template?kategori=<slug>; undangan punya halaman sendiri
// (/template/undangan) karena pengunjung, isi, dan cara pesannya beda.
export const templateCategories = [
  { slug: "undangan", label: "Undangan Digital", desc: "Pernikahan online", icon: "heart" },
  { slug: "umkm", label: "Website UMKM", desc: "Kafe, toko, usaha jasa", icon: "store" },
  { slug: "company-profile", label: "Company Profile", desc: "CV, PT, kontraktor", icon: "building" },
  { slug: "portofolio", label: "Portofolio", desc: "Desainer, fotografer", icon: "user" },
] as const;

export const kategoriWebsite = templateCategories.filter((c) => c.slug !== "undangan");
export type KategoriWebsite = (typeof kategoriWebsite)[number]["slug"];

export function kategoriHref(slug: string) {
  return slug === "undangan" ? "/template/undangan" : `/template?kategori=${slug}`;
}

// Judul & teks pembuka halaman /template, berganti mengikuti kategori website yang dipilih
export const templateIntro = {
  semua: {
    judul: "siap kamu pakai",
    intro: "Lihat demonya langsung, pilih yang paling dekat sama usaha kamu, lalu kami sesuaikan warna, foto, dan isinya.",
  },
  umkm: {
    judul: "buat UMKM",
    intro: "Buat kafe, warung, toko, atau usaha jasa. Menu & harga, lokasi, dan tombol pesan lewat WhatsApp sudah tersedia.",
  },
  "company-profile": {
    judul: "company profile",
    intro: "Wajah resmi perusahaan kamu: profil, layanan, legalitas, sampai form minta penawaran dalam satu website.",
  },
  portofolio: {
    judul: "portofolio pribadi",
    intro: "Pamerkan karya dan pengalaman kamu dengan cara yang lebih berkesan daripada PDF.",
  },
} as const;

// Template website & undangan. Halaman demonya ada di /template/<slug>.
// Gambar di /public/preview/<kategori> adalah screenshot dari halaman demo itu; kalau tampilannya diubah, ambil ulang.
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
    laptop: "/preview/umkm/laptop-kawalu-coffee.webp",
    phone: "/preview/umkm/hp-kawalu-1.webp",
    includes: ["Pembuka parallax", "Menu & harga", "Pesan antar & jual biji", "Jam buka live & peta"],
  },
  {
    slug: "bahtera-logistik",
    name: "Bahtera Lintas Nusantara",
    kind: "Company Profile",
    category: "company-profile",
    url: "bahteralogistik.co.id",
    desc: "Perusahaan logistik di Surabaya: dibuka dengan pintu kontainer yang berayun 3D, peta rute ke 12 pelabuhan yang tergambar saat digulir, layanan sebagai kontainer yang diturunkan derek, armada, lacak kiriman, dan form minta penawaran.",
    laptop: "/preview/company-profile/laptop-bahtera-logistik.webp",
    phone: "/preview/company-profile/hp-bahtera-1.webp",
    includes: ["Pembuka pintu kontainer 3D", "Peta rute interaktif", "Layanan & armada", "Lacak kiriman & penawaran"],
  },
  {
    slug: "laras-kinanti",
    name: "Laras Kinanti",
    kind: "Portofolio",
    category: "portofolio",
    url: "laraskinanti.com",
    desc: "Fotografer potret & dokumenter: dibuka dengan bingkai kamera yang mekar jadi layar penuh, seri foto yang bertumpuk saat digulir, rol film yang bergeser ke samping, dan daftar harga yang jelas. Parallax di setiap bagian.",
    laptop: "/preview/portofolio/laptop-laras-kinanti.webp",
    phone: "/preview/portofolio/hp-laras-1.webp",
    includes: ["Pembuka parallax", "Seri foto & galeri", "Rol film potret", "Harga & kontak"],
  },
  {
    slug: "undangan-fara-aditya-oriental-peony",
    name: "Fara & Aditya · Oriental Peony",
    kind: "Undangan Digital",
    category: "undangan",
    url: "faraaditya.my.id",
    desc: "Tema Oriental Peony: pernikahan bernuansa Tionghoa merah pernis, emas, dan giok, dengan lanskap lukisan biru-hijau, gerbang paifang, peoni, teratai, bambu, bangau, lentera merah, dan 囍. Dibuka dengan animasi kamera ±10 detik: menembus jendela bulan, melewati pegunungan berlapis, mendekati gerbang, lalu mundur ke kolam teratai berbingkai kayu merah. Galeri roda jendela bulan dan love story berupa gulungan lukisan yang terbuka saat digulir. Khusus tampilan HP.",
    phone: "/preview/undangan/hp-undangan-oriental-1.webp",
    screens: ["/preview/undangan/hp-undangan-oriental-2.webp", "/preview/undangan/hp-undangan-oriental-3.webp"],
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
    phone: "/preview/undangan/hp-undangan-sakinah-1.webp",
    screens: ["/preview/undangan/hp-undangan-sakinah-2.webp", "/preview/undangan/hp-undangan-sakinah-3.webp"],
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
    phone: "/preview/undangan/hp-undangan-delima-1.webp",
    screens: ["/preview/undangan/hp-undangan-delima-2.webp", "/preview/undangan/hp-undangan-delima-3.webp"],
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
    phone: "/preview/undangan/hp-undangan-porselen-1.webp",
    screens: ["/preview/undangan/hp-undangan-porselen-2.webp", "/preview/undangan/hp-undangan-porselen-3.webp"],
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
    phone: "/preview/undangan/hp-undangan-garden-1.webp",
    screens: ["/preview/undangan/hp-undangan-garden-2.webp", "/preview/undangan/hp-undangan-garden-3.webp"],
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
    phone: "/preview/undangan/hp-undangan-frisca-1.webp",
    screens: ["/preview/undangan/hp-undangan-frisca-2.webp", "/preview/undangan/hp-undangan-frisca-3.webp"],
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
    phone: "/preview/undangan/hp-undangan-luxury-1.webp",
    screens: ["/preview/undangan/hp-undangan-luxury-2.webp", "/preview/undangan/hp-undangan-luxury-3.webp"],
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
    phone: "/preview/undangan/hp-undangan-sunda-1.webp",
    screens: ["/preview/undangan/hp-undangan-sunda-2.webp", "/preview/undangan/hp-undangan-sunda-3.webp"],
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
    phone: "/preview/undangan/hp-undangan-rimba-1.webp",
    screens: ["/preview/undangan/hp-undangan-rimba-2.webp", "/preview/undangan/hp-undangan-rimba-3.webp"],
    tone: { bg: "#1d2b22", accent: "#d8b56e" },
    includes: ["Sampul buka undangan", "Ayat & salam", "Galeri layar penuh", "RSVP & amplop digital"],
  },
];

// Potongan layar desktop & HP dari demo, untuk kolom bergerak di hero
const kawalu = "kawalucoffee.id";
const bahtera = "bahteralogistik.co.id";
const laras = "laraskinanti.com";
const faraAditya = "faraaditya.my.id";
// Kolom desktop: hanya website (UMKM, company profile, portofolio). Undangan dibuat untuk HP, jadi tampil di kolom HP,
// selang-seling dengan website dan lebih dulu.
export const heroShots = {
  desktop: [
    { src: "/preview/umkm/laptop-kawalu-coffee.webp", url: kawalu },
    { src: "/preview/company-profile/web-bahtera-2.webp", url: bahtera },
    { src: "/preview/portofolio/laptop-laras-kinanti.webp", url: laras },
    { src: "/preview/umkm/web-kawalu-2.webp", url: kawalu },
    { src: "/preview/company-profile/laptop-bahtera-logistik.webp", url: bahtera },
    { src: "/preview/portofolio/web-laras-2.webp", url: laras },
    { src: "/preview/company-profile/web-bahtera-3.webp", url: bahtera },
  ],
  phone: [
    { src: "/preview/undangan/hp-undangan-sunda-1.webp", url: faraAditya },
    { src: "/preview/umkm/hp-kawalu-1.webp", url: kawalu },
    { src: "/preview/undangan/hp-undangan-frisca-1.webp", url: "friscaarif.my.id" },
    { src: "/preview/company-profile/hp-bahtera-1.webp", url: bahtera },
    { src: "/preview/undangan/hp-undangan-luxury-1.webp", url: faraAditya },
    { src: "/preview/portofolio/hp-laras-1.webp", url: laras },
    { src: "/preview/undangan/hp-undangan-garden-1.webp", url: faraAditya },
    { src: "/preview/umkm/hp-kawalu-2.webp", url: kawalu },
    { src: "/preview/undangan/hp-undangan-porselen-1.webp", url: faraAditya },
    { src: "/preview/company-profile/hp-bahtera-2.webp", url: bahtera },
    { src: "/preview/undangan/hp-undangan-rimba-1.webp", url: faraAditya },
    { src: "/preview/portofolio/hp-laras-2.webp", url: laras },
  ],
};
