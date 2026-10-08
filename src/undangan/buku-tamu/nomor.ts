// Nomor WhatsApp & daftar tempelan di halaman rekap. Dipakai di browser (pratinjau) dan di server (validasi).

// Nomor → format internasional tanpa "+" (0812… / +62 812… / 812… → 62812…).
// "" kalau kosong, null kalau bukan nomor yang masuk akal.
export function rapikanWa(v: string): string | null {
  const d = v.replace(/\D/g, "");
  if (!d) return "";
  const n = d.startsWith("0") ? `62${d.slice(1)}` : d.startsWith("8") ? `62${d}` : d;
  return /^[0-9]{9,15}$/.test(n) ? n : null;
}

// 6281234567890 → 0812-3456-7890 (nomor luar negeri tetap +kode negara)
export function tampilWa(n: string) {
  if (!n) return "";
  if (!n.startsWith("62")) return `+${n}`;
  return `0${n.slice(2)}`.replace(/^(\d{4})(\d{4})(\d+)$/, "$1-$2-$3");
}

export function rapikanNama(v: string) {
  return v.replace(/\s+/g, " ").trim().slice(0, 60);
}

export type BarisTempel = { nama: string; wa: string; nomorSalah: boolean };

const NOMOR_AKHIR = /^(.*?)[\s,;|:\t-]*(\+?\d[\d\s().-]{6,}\d)\s*$/;
const NOMOR_AWAL = /^(\+?\d[\d\s().-]{6,}\d)[\s,;|:\t-]+(.+)$/;

// Satu tamu per baris: "Budi Santoso, 0812…", "Budi Santoso<Tab>0812…" (dari Excel), "0812… Budi", atau nama saja.
// Baris judul kolom ("Nama", "No WA") dilewati.
export function bacaTempelan(teks: string): BarisTempel[] {
  const hasil: BarisTempel[] = [];
  for (const mentah of teks.split(/\r?\n/)) {
    const baris = mentah.trim();
    const judulKolom = /^(nama|name)(\s+tamu)?\s*([,;|\t]|$)/i.test(baris) && !/\d{6,}/.test(baris);
    if (!baris || judulKolom) continue;
    const akhir = baris.match(NOMOR_AKHIR);
    const awal = akhir ? null : baris.match(NOMOR_AWAL);
    const [nama, nomor] = akhir ? [akhir[1], akhir[2]] : awal ? [awal[2], awal[1]] : [baris, ""];
    const wa = rapikanWa(nomor);
    const n = rapikanNama(nama.replace(/[\s,;|:\t-]+$/, ""));
    if (n) hasil.push({ nama: n, wa: wa ?? "", nomorSalah: wa === null });
  }
  return hasil;
}
