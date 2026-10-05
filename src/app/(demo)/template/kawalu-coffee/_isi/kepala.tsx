"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { useStatusBuka } from "./buka";
import { JUDUL, TANGAN } from "./gaya";
import s from "./kawalu.module.css";

// Header: transparan di atas langit pembuka, jadi krem setelah digulir. Sembunyi saat menggulir ke bawah,
// muncul lagi saat menggulir ke atas. Status buka/tutup dihitung live dari jam WIB.
export function Kepala() {
  const { scrollY } = useScroll();
  const [atas, setAtas] = useState(true);
  const [sembunyi, setSembunyi] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => {
    const lalu = scrollY.getPrevious() ?? 0;
    setAtas(y < 40);
    setSembunyi(y > 200 && y > lalu);
  });

  return (
    <motion.header
      animate={{ y: sembunyi ? "-110%" : "0%" }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${atas ? "bg-transparent" : "bg-[#f3ead8] shadow-[0_1px_0_rgb(34_20_14/0.12)]"}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 text-[#22140e] md:px-8">
        <a href="#atas" className="flex items-baseline gap-1">
          <Cangkir />
          <span className={`${JUDUL} text-2xl leading-none`}>Kawalu</span>
          <span className={`${TANGAN} text-xl leading-none text-[#c3312b]`}>coffee</span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-semibold md:flex">
          <a href="#cerita">Cerita</a>
          <a href="#menu">Menu</a>
          <a href="#biji">Biji kopi</a>
          <a href="#lokasi">Lokasi</a>
        </nav>
        <div className="flex items-center gap-2">
          <StatusBuka className="hidden sm:flex" />
          <a href="#pesan" className="rounded-full bg-[#22140e] px-4 py-2 text-sm font-bold text-[#f3ead8]">
            Pesan antar
          </a>
        </div>
      </div>
    </motion.header>
  );
}

export function StatusBuka({ className = "", gelap }: { className?: string; gelap?: boolean }) {
  const st = useStatusBuka();
  return (
    <p
      className={`${className} min-h-8 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
        gelap ? "bg-[#f3ead8]/10 text-[#f3ead8]" : "bg-[#22140e]/[0.07] text-[#22140e]"
      }`}
      aria-live="polite"
    >
      <span className={`size-2 rounded-full ${st === null ? "bg-current opacity-30" : st.buka ? `${s.denyut} bg-[#3fbf6a]` : "bg-[#c3312b]"}`} />
      {st?.teks ?? "Cek jam buka"}
    </p>
  );
}

function Cangkir() {
  return (
    <svg viewBox="0 0 28 24" className="mr-1 h-5 w-6 self-center text-[#22140e]" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8h16v6a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7z" />
      <path d="M19 10h2.5a3 3 0 0 1 0 6H19" />
      <path d="M9 1.5c-1.2 1.4 1.2 2.4 0 4M14 1.5c-1.2 1.4 1.2 2.4 0 4" stroke="#c3312b" />
    </svg>
  );
}
