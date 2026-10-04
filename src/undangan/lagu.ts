// Daftar lagu latar yang bisa dipilih untuk undangan. Filenya di public/undangan/music (format M4A/AAC supaya bisa
// diputar di semua browser, termasuk Safari iPhone). Lagu request khusus satu pasangan taruh di folder pasangan itu
// (mis. /undangan/<pasangan>/musik.m4a) lalu isi `musik` di data undangannya dengan bentuk yang sama.

export type Lagu = { src: string; judul: string; penyanyi: string };

const m = (nama: string) => `/undangan/music/${nama}.m4a`;

export const LAGU = {
  anugerahTerindah: { src: m("anugerah-terindah"), judul: "Anugerah Terindah", penyanyi: "Andmesh" },
  bermuara: { src: m("bermuara"), judul: "Bermuara", penyanyi: "Rizky Febian & Mahalini" },
  hinggaTuaBersama: { src: m("hingga-tua-bersama"), judul: "Hingga Tua Bersama", penyanyi: "Rizky Febian" },
  nantiKitaSepertiIni: { src: m("nanti-kita-seperti-ini"), judul: "Nanti Kita Seperti Ini", penyanyi: "Batas Senja" },
  penjagaHati: { src: m("penjaga-hati"), judul: "Penjaga Hati", penyanyi: "Nadhif Basalamah" },
  perfect: { src: m("perfect"), judul: "Perfect", penyanyi: "Ed Sheeran" },
  pernikahanKita: { src: m("pernikahan-kita"), judul: "Pernikahan Kita", penyanyi: "Tiara Andini & Arsy Widianto" },
  theWayYouLookAtMe: { src: m("the-way-you-look-at-me"), judul: "The Way You Look At Me", penyanyi: "Nyoman Paul" },
} satisfies Record<string, Lagu>;
