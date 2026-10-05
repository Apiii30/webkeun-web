"use client";

import { useSyncExternalStore } from "react";
import { jam } from "./data";

// Status buka/tutup kedai menurut jam WIB (Asia/Jakarta), apa pun zona waktu pengunjung.
// null saat render di server & hydrate (supaya HTML cocok), lalu diperbarui tiap 30 detik.
export type Status = { buka: boolean; hari: number; teks: string };

function sekarangWIB() {
  const bagian = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jakarta", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23" })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  );
  const hari = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(bagian.weekday);
  return { hari, menit: Number(bagian.hour) * 60 + Number(bagian.minute) };
}

const pukul = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}.${String(m % 60).padStart(2, "0")}`;

function hitung(): string {
  const { hari, menit } = sekarangWIB();
  const j = jam[hari];
  if (menit >= j.buka && menit < j.tutup) return JSON.stringify({ buka: true, hari, teks: `Buka · sampai ${j.tutup === 1440 ? "24.00" : pukul(j.tutup)}` });
  const besok = jam[(hari + 1) % 7];
  const teks = menit < j.buka ? `Tutup · buka ${pukul(j.buka)}` : `Tutup · buka besok ${pukul(besok.buka)}`;
  return JSON.stringify({ buka: false, hari, teks });
}

const langganan = (cb: () => void) => {
  const id = setInterval(cb, 30_000);
  return () => clearInterval(id);
};

export function useStatusBuka(): Status | null {
  const s = useSyncExternalStore(langganan, hitung, () => "");
  return s ? (JSON.parse(s) as Status) : null;
}
