// Isi undangan Frisca & Arif, disalin dari proyek undangan aslinya (folder wedding-invitation).
// Di sini dipakai sebagai demo template: RSVP & ucapan hanya tersimpan di browser, tanpa database.
// Bagian bertanda TODO masih berisi data sementara di proyek aslinya.

export const wedding = {
  bride: {
    nickname: "Frisca",
    fullName: "Frisca Triani Ivanka",
    parents: "Putri dari Bapak Agus Siswanto & Ibu (Almh.) Srie Astrie",
    photo: "dsc00010",
    instagram: "", // TODO: username tanpa @, kosongkan jika tidak ada
    whatsapp: "", // TODO: nomor WA untuk konfirmasi hadiah, format 628xxxxxxxxxx
  },
  groom: {
    nickname: "Arif",
    fullName: "Arif Rahman Fauzi",
    parents: "Putra dari Bapak (Alm.) Endang & Ibu Enny",
    photo: "dsc00324",
    instagram: "", // TODO
    whatsapp: "", // TODO: format 628xxxxxxxxxx
  },

  // TODO: cerita masih contoh (yang pasti baru "kenal sejak 2011"). Ganti tahun, judul, teks, dan fotonya.
  // icon: "sparkles" | "message" | "heart" | "gem" | "rings"
  loveStory: [
    {
      year: "2011",
      title: "Awal Bertemu",
      icon: "sparkles",
      photo: "dsc00291",
      text: "Semua berawal dari sebuah perkenalan sederhana di tahun 2011. Tidak ada yang menyangka, pertemuan itu menjadi awal dari cerita panjang kami.",
    },
    {
      year: "2014",
      title: "Semakin Dekat",
      icon: "message",
      photo: "dsc00306",
      text: "Obrolan ringan perlahan menjadi kebiasaan. Dari teman bercerita, kami mulai saling mengenal lebih dalam.",
    },
    {
      year: "2019",
      title: "Saling Menguatkan",
      icon: "heart",
      photo: "dsc00271",
      text: "Banyak hal kami lewati bersama, suka maupun duka. Setiap langkah mengajarkan kami arti sabar dan saling percaya.",
    },
    {
      year: "2025",
      title: "Lamaran",
      icon: "gem",
      photo: "dsc00314",
      text: "Dengan restu kedua keluarga, kami mengikat janji dalam acara lamaran yang penuh haru dan bahagia.",
    },
    {
      year: "2027",
      title: "Menuju Halal",
      icon: "rings",
      photo: "dsc00254",
      text: "Insya Allah, pada 17 Januari 2027 kami menyempurnakan separuh agama dalam ikatan pernikahan.",
    },
  ],

  // Dipakai untuk countdown dan tombol "Simpan ke Kalender" (zona WIB).
  date: "2027-01-17T08:00:00+07:00",

  events: [
    {
      title: "Akad Nikah",
      date: "2027-01-17T08:00:00+07:00",
      time: "08.00 WIB – Selesai",
      venue: "Lokasi menyusul", // TODO
      address: "", // TODO
      mapsUrl: "", // TODO: link Google Maps
    },
    {
      title: "Resepsi",
      date: "2027-01-17T08:00:00+07:00",
      time: "Waktu menyusul", // TODO
      venue: "Lokasi menyusul", // TODO
      address: "", // TODO
      mapsUrl: "", // TODO
    },
  ],

  // Batas akhir tamu bisa mengisi / mengubah RSVP.
  rsvpDeadline: "2027-01-10T23:59:59+07:00",
  // Maksimal jumlah orang untuk tamu umum (tamu terdaftar memakai jatah masing-masing).
  publicMaxPax: 2,

  // TODO: ganti dengan rekening asli. Section amplop disembunyikan jika daftar ini kosong.
  // owner: pemilik rekening ("bride" / "groom"), dipakai sebagai tujuan default konfirmasi WhatsApp.
  gifts: [
    { bank: "BCA", number: "0000000000", holder: "Frisca Triani Ivanka", owner: "bride" },
    { bank: "Mandiri", number: "0000000000", holder: "Arif Rahman Fauzi", owner: "groom" },
  ] as Gift[],
  giftAddress: "" as string, // TODO: alamat kirim kado, kosongkan jika tidak ada

  // Letakkan file lagu di public/music/ lalu sesuaikan nama filenya.
  music: "/undangan/frisca-arif/backsound.mp3",

  photos: {
    cover: "dsc00273",
    hero: "dsc00306",
    quote: "dsc00293",
    closing: "dsc00311",
    gallery: [
      "dsc00251",
      "dsc00022",
      "dsc00279",
      "dsc00319",
      "dsc00015",
      "dsc00271",
      "dsc00252",
      "dsc00314",
      "dsc00001",
      "dsc00291",
      "dsc00254",
      "dsc00007",
      "dsc00325",
    ],
  },
} as const;

export type Gift = { bank: string; number: string; holder: string; owner: "bride" | "groom" };

export type WeddingEvent = (typeof wedding.events)[number];

export type Attendance = "hadir" | "tidak_hadir";

export const ATTENDANCE_LABEL: Record<Attendance, string> = {
  hadir: "Hadir",
  tidak_hadir: "Tidak Hadir",
};

/** Ucapan yang tampil publik di undangan. */
export type Wish = { id: number; name: string; attendance: Attendance; message: string | null; createdAt: string };

// Ucapan contoh (sama dengan data demo di proyek aslinya)
export const CONTOH_UCAPAN: Wish[] = [
  {
    id: 2,
    name: "Ayu Lestari",
    attendance: "tidak_hadir",
    message: "Mohon maaf belum bisa hadir, semoga lancar sampai hari H dan menjadi keluarga sakinah mawaddah warahmah.",
    createdAt: "2026-10-01T09:30:00+07:00",
  },
  {
    id: 1,
    name: "Dimas Pratama",
    attendance: "hadir",
    message: "Barakallahu lakuma wa baraka alaikuma wa jamaa bainakuma fii khair. Wilujeng nya!",
    createdAt: "2026-09-29T19:10:00+07:00",
  },
];

export const isRsvpClosed = () => Date.now() > new Date(wedding.rsvpDeadline).getTime();
