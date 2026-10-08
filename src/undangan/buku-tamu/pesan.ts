// Teks pesan WhatsApp undangan di halaman rekap. {nama} diganti nama tamu, {link} diganti link undangannya.

export const PESAN_BAWAAN = `Kepada Yth.
Bapak/Ibu/Saudara/i
{nama}

Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.

Info lengkap acara bisa dilihat di sini:
{link}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih.`;

export function isiPesan(templat: string, nama: string, link: string) {
  return templat.replaceAll("{nama}", nama).replaceAll("{link}", link);
}
