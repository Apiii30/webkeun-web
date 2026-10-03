"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { Undangan } from "../../types";
import { ASET } from "./aset";
import { Burung, Gambar, LEMBUT, Pembatas, Wisteria, cormorant, italiana } from "./hias";
import s from "./garden.module.css";

// Adegan taman di beranda, sekaligus animasi pembuka undangan ("kamera mundur").
//
// Adegan disusun berlapis dari jauh ke dekat: lembah & pegunungan → kabut & palem → gapura, air mancur & wisteria
// → merak & peony → wisteria paling depan. Saat undangan dibuka, semua lapisan mulai dalam keadaan diperbesar
// dari satu titik (tengah lengkung gapura) lalu mengecil bersamaan ke ukuran aslinya. Lapisan dekat diperbesar
// jauh lebih banyak daripada lapisan jauh, jadi gerak mundurnya punya kedalaman sungguhan (parallax), seperti
// kamera yang ditarik mundur dari balik bunga sampai seluruh gapura taman terlihat.
//
// Setelah itu, saat beranda digulir keluar, tiap lapisan pergi dengan kecepatan berbeda (kelas keluar* di CSS).

const ASAL = "50% 60%"; // titik pusat "kamera": tengah bukaan gapura, tepat di atas air mancur
const MUNDUR = { duration: 3.9, ease: [0.42, 0, 0.12, 1] } as const;

// Satu lapisan kedalaman. awal = skala saat kamera masih di depan; makin dekat makin besar.
function Lapis({ awal, buka, keluar, className = "", children }: { awal: number; buka: boolean; keluar?: string; className?: string; children: ReactNode }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${keluar ?? ""} ${className}`}>
      <motion.div
        className="absolute inset-0"
        style={{ transformOrigin: ASAL }}
        initial={{ transform: `scale(${awal})` }}
        animate={buka ? { transform: "scale(1)" } : undefined}
        transition={MUNDUR}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Butir air mancur yang berkilau
function Percikan() {
  return (
    <div className="absolute bottom-[38%] left-1/2 h-6 w-16 -translate-x-1/2" aria-hidden="true">
      {Array.from({ length: 9 }, (_, i) => (
        <span
          key={i}
          className={`${s.titik} absolute top-0 size-[3px] rounded-full bg-white/90 shadow-[0_0_4px_1px_rgb(255_255_255/0.6)]`}
          style={{ left: `${10 + ((i * 37) % 80)}%`, "--x": `${(i % 2 ? 1 : -1) * (6 + (i % 4) * 3)}px`, "--d": `${1.8 + (i % 3) * 0.5}s`, animationDelay: `${-i * 0.33}s` } as CSSProperties}
        />
      ))}
    </div>
  );
}

export function Adegan({ u, buka }: { u: Undangan; buka: boolean }) {
  return (
    <section id="beranda" className={`${s.sek} relative h-svh min-h-[42rem] overflow-hidden bg-[#e7ece8]`}>
      {/* 1. lembah, pegunungan & air terjun (paling jauh) */}
      <Lapis awal={1.4} buka={buka} keluar={s.keluarJauh}>
        <Image src={ASET.lembah.src} alt="" fill preload sizes="(min-width: 440px) 440px, 100vw" className="object-cover object-[50%_38%]" />
        <div className="absolute inset-x-0 top-0 h-[34%] bg-gradient-to-b from-[#eef1ec] via-[#eef1ec]/60 to-transparent" />
        <Burung className="top-[9%] left-0" delay={-4} />
        <Burung className="top-[12%] left-0" delay={-11} size={11} />
      </Lapis>

      {/* 2. kabut & palem */}
      <Lapis awal={1.9} buka={buka} keluar={s.keluarJauh}>
        <div className={`${s.kabut} absolute inset-x-[-20%] top-[44%] h-[22%] bg-[radial-gradient(50%_50%_at_50%_50%,rgb(238_241_236/0.85),transparent_70%)]`} />
        <div className="absolute bottom-[30%] left-[-4%] w-[42%]">
          <div className={s.ayunB} style={{ transformOrigin: "50% 100%" }}>
            <Gambar a="palem" sizes="190px" />
          </div>
        </div>
        <div className="absolute right-[-2%] bottom-[33%] w-[34%]">
          <div className={s.ayunA} style={{ transformOrigin: "50% 100%" }}>
            <Gambar a="palem" flip sizes="160px" />
          </div>
        </div>
      </Lapis>

      {/* 3. gapura taman dengan air mancur di dalamnya, wisteria menjuntai dari lengkungnya */}
      <Lapis awal={2.5} buka={buka} keluar={s.keluarTengah}>
        <div className="absolute bottom-[12%] left-1/2 w-[30%] -translate-x-1/2">
          <Gambar a="airMancur" sizes="120px" />
          <Percikan />
        </div>
        <div className="absolute bottom-[3%] left-[1%] w-[98%]">
          <Gambar a="gapura" sizes="(min-width: 440px) 425px, 96vw" preload />
          <Wisteria className="top-[22%] left-[13%] w-[10%]" />
          <Wisteria className="top-[17%] left-[19%] w-[8%]" jeda={-1.6} />
          <Wisteria className="top-[22%] right-[13%] w-[10%]" jeda={-0.8} />
          <Wisteria className="top-[17%] right-[19%] w-[8%]" jeda={-2.4} />
        </div>
      </Lapis>

      {/* 4. merak & peony di depan gapura */}
      <Lapis awal={3.4} buka={buka} keluar={s.keluarDekat}>
        <div className="absolute right-0 bottom-[5%] w-[40%]">
          <Gambar a="merakSakura" sizes="180px" />
        </div>
        <div className="absolute bottom-[-3%] left-0 w-[60%]">
          <div className={s.ayunA} style={{ transformOrigin: "30% 100%" }}>
            <Gambar a="peony" sizes="270px" />
          </div>
        </div>
        <div className="absolute right-0 bottom-[-5%] w-[42%]">
          <div className={s.ayunB} style={{ transformOrigin: "60% 100%" }}>
            <Gambar a="peonyMerah" sizes="190px" />
          </div>
        </div>
      </Lapis>

      {/* 5. wisteria paling dekat: saat kamera mundur, ia tersapu ke sudut atas */}
      <Lapis awal={4.6} buka={buka} keluar={s.keluarDekat}>
        <Wisteria className="top-[-8%] left-[1%] w-[12%]" sizes="56px" />
        <Wisteria className="top-[-12%] right-[2%] w-[11%]" sizes="52px" jeda={-1} />
      </Lapis>

      {/* teks di langit, di atas gapura; muncul setelah kamera berhenti */}
      <div className={`${s.keluarTeks} absolute inset-x-0 top-[7%] flex flex-col items-center px-10 text-center`}>
        <motion.div
          className="absolute inset-x-[6%] -inset-y-8 rounded-[50%] bg-[radial-gradient(closest-side,rgb(238_241_236/0.9),rgb(238_241_236/0.55)_60%,transparent)]"
          initial={{ opacity: 0 }}
          animate={buka ? { opacity: 1 } : undefined}
          transition={{ duration: 1.4, delay: 2.4 }}
          aria-hidden="true"
        />
        {[
          <p key="a" className="text-[10px] tracking-[0.42em] text-[#34596a] uppercase">
            The Wedding of
          </p>,
          <h1 key="b" className={`${italiana} mt-2 text-[2.6rem] leading-tight whitespace-nowrap text-[#24434e]`}>
            {u.wanita.panggilan} <span className={`${cormorant} text-[2rem] text-[#b9975b] italic`}>&amp;</span> {u.pria.panggilan}
          </h1>,
          <Pembatas key="c" className="mt-2" />,
          <p key="d" className="mt-1 text-[11px] tracking-[0.25em] text-[#34596a] uppercase">
            {u.tanggal.split(",")[1]?.trim() ?? u.tanggal}
          </p>,
        ].map((el, i) => (
          <motion.div
            key={i}
            className="relative"
            initial={{ opacity: 0, transform: "translateY(18px)" }}
            animate={buka ? { opacity: 1, transform: "translateY(0px)" } : undefined}
            transition={{ duration: 1.3, ease: LEMBUT, delay: 2.6 + i * 0.18 }}
          >
            {el}
          </motion.div>
        ))}
      </div>

      {/* petunjuk gulir */}
      <motion.div
        className="absolute inset-x-0 bottom-[calc(5.5rem+var(--demo-h,0px))] flex justify-center"
        initial={{ opacity: 0 }}
        animate={buka ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: 4 }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className={`${s.petunjuk} size-6 text-[#f3efe3] drop-shadow-[0_1px_3px_rgb(0_0_0/0.5)]`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </motion.div>
    </section>
  );
}
