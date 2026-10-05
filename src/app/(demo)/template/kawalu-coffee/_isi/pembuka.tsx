"use client";

import { motion, type MotionValue, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useDiam } from "./diam";
import { JUDUL, MONO, TANGAN } from "./gaya";
import s from "./kawalu.module.css";

// Pembuka: lanskap Gunung Karang bergaya cetak saring (warna rata, berlapis). Panggungnya sticky setinggi
// 2,4 layar; saat digulir tiap lapisan naik dengan kecepatan sesuai jaraknya (yang dekat lebih cepat),
// matahari terbenam & langit menghangat, lalu bukit krem paling depan naik menutupi layar dan menyambung
// mulus ke bagian "Dari ceri ke cangkir" yang berwarna sama. "Kurangi gerakan": lanskap diam.

const SLICE = "absolute inset-0 h-full w-full";

export function Pembuka() {
  const ref = useRef<HTMLElement>(null);
  const diam = useDiam();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // seberapa jauh tiap lapisan naik (svh) sepanjang pembuka: makin dekat ke kamera, makin jauh
  const lapis = {
    awan: useTransform(p, [0, 1], ["0svh", "-5svh"]),
    gunung: useTransform(p, [0, 1], ["0svh", "-6svh"]),
    nama: useTransform(p, [0, 1], ["0svh", "-12svh"]),
    punggung: useTransform(p, [0, 1], ["0svh", "-20svh"]),
    kebun: useTransform(p, [0, 1], ["0svh", "-36svh"]),
    depan: useTransform(p, [0, 0.45, 1], ["0svh", "-8svh", "-83svh"]),
    dahan: useTransform(p, [0, 1], ["0svh", "-70svh"]),
  };
  const naik = (y: MotionValue<string>) => (diam ? undefined : { y });

  const langit = useTransform(p, [0, 0.7], ["#f6dcae", "#eea576"]);
  const matahari = useTransform(p, [0, 0.8], ["0svh", "30svh"]);

  return (
    <section ref={ref} id="atas" className={`relative ${diam ? "" : "h-[240svh]"}`}>
      <motion.div style={{ backgroundColor: diam ? "#f6dcae" : langit }} className="sticky top-0 h-svh overflow-hidden">
        {/* matahari */}
        <motion.svg style={diam ? undefined : { y: matahari }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className={SLICE} aria-hidden="true">
          <circle cx="1010" cy="250" r="86" fill="#f4ad45" />
          <circle cx="1010" cy="250" r="118" fill="#f4ad45" opacity="0.18" />
        </motion.svg>

        {/* awan */}
        <motion.svg style={naik(lapis.awan)} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className={SLICE} aria-hidden="true">
          <g className={s.awan} fill="#fbf1de">
            <Awan x={210} y={210} k={1} />
            <Awan x={1180} y={150} k={0.75} />
            <Awan x={640} y={110} k={0.55} />
          </g>
        </motion.svg>

        {/* Gunung Karang (paling jauh) dengan Pulosari di kirinya */}
        <motion.svg style={naik(lapis.gunung)} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className={SLICE} aria-hidden="true">
          <path
            d="M0 530 C120 510 210 440 300 390 C340 370 370 372 410 396 C450 418 480 390 520 350 C590 282 660 236 712 220 L736 212 L758 224 L790 220 C850 242 930 312 1030 382 C1150 465 1290 514 1440 530 L1440 900 L0 900Z"
            fill="#93ab9c"
          />
          <path d="M712 220 L736 212 L758 224 L790 220 C770 238 748 234 736 246 C724 234 716 238 712 220Z" fill="#a9bdb0" />
        </motion.svg>

        {/* nama kedai, di antara gunung dan punggung bukit */}
        <motion.div style={naik(lapis.nama)} className="absolute inset-x-0 bottom-[42svh] flex flex-col items-center text-[#22140e] md:bottom-[38svh]">
          <motion.p
            initial={diam ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`${MONO} mb-2 px-6 text-center text-[11px] tracking-[0.16em] uppercase md:text-xs`}
          >
            Kopi lereng Gunung Karang · diseduh di Serang, Banten
          </motion.p>
          <div className="relative">
            <motion.h1
              initial={diam ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={`${JUDUL} text-[33vw] leading-[0.78] tracking-[-0.02em] md:text-[23vw]`}
            >
              Kawalu
            </motion.h1>
            <motion.span
              initial={diam ? false : { opacity: 0, scale: 0.6, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: -9 }}
              transition={{ duration: 0.7, delay: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              className={`${TANGAN} absolute -top-[9vw] -right-[3vw] text-[15vw] leading-none text-[#c3312b] md:-top-[5vw] md:-right-[5vw] md:text-[8vw]`}
            >
              coffee
            </motion.span>
          </div>
        </motion.div>

        {/* punggung bukit */}
        <motion.svg style={naik(lapis.punggung)} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className={SLICE} aria-hidden="true">
          <path
            d="M0 608 C150 568 280 594 420 560 C560 526 650 552 790 572 C930 592 1050 532 1210 548 C1310 558 1390 576 1440 568 L1440 900 L0 900Z"
            fill="#668a5e"
          />
          {/* pohon-pohon kecil di punggung bukit */}
          <g fill="#557a4f">
            {[120, 205, 980, 1040, 1300, 1355].map((x, i) => (
              <ellipse key={x} cx={x} cy={i % 2 ? 568 : 578} rx={18 + (i % 3) * 5} ry={26 + (i % 2) * 8} />
            ))}
          </g>
        </motion.svg>

        {/* kebun kopi berbaris */}
        <motion.svg style={naik(lapis.kebun)} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className={SLICE} aria-hidden="true">
          <defs>
            <pattern id="kw-baris" width="34" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(-5)">
              <ellipse cx="9" cy="11" rx="9" ry="6" fill="#26401f" />
              <ellipse cx="26" cy="11" rx="7" ry="5" fill="#2b4724" />
            </pattern>
          </defs>
          <path d="M0 682 C240 610 520 626 760 666 C980 702 1200 636 1440 654 L1440 900 L0 900Z" fill="#34502e" />
          <path d="M0 682 C240 610 520 626 760 666 C980 702 1200 636 1440 654 L1440 900 L0 900Z" fill="url(#kw-baris)" opacity="0.9" />
        </motion.svg>

        {/* bukit krem paling depan: naik menutupi layar */}
        <motion.div style={naik(lapis.depan)} className="absolute inset-x-0 top-[80svh] h-[130svh]">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute inset-x-0 -top-[7svh] h-[7.2svh] w-full" aria-hidden="true">
            <path d="M0 120 L0 70 C260 10 560 0 840 34 C1080 62 1280 64 1440 40 L1440 120Z" fill="#f3ead8" />
          </svg>
          <div className="relative h-full bg-[#f3ead8]">
            {/* judul "Dari ceri ke cangkir" ikut naik bersama bukit, jadi tanpa layar kosong sebelum bagian berikutnya */}
            <div className={`${diam ? "hidden" : ""} absolute inset-x-0 top-[64svh] mx-auto max-w-6xl px-5 text-[#22140e] md:top-[60svh] md:px-8`}>
              <p className={`${MONO} text-[11px] tracking-[0.16em] uppercase md:text-xs`}>
                <span className="text-[#c3312b]">●</span> Dari ceri ke cangkir
              </p>
              <h2 className={`${JUDUL} mt-3 text-[15vw] leading-[0.82] md:text-[7.5vw]`}>
                Empat langkah
                <br />
                sebelum kamu minum
              </h2>
            </div>
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 pt-[2svh] md:flex-row md:justify-between md:pt-[3svh]">
              <p className="max-w-md text-center text-[15px] leading-snug text-[#22140e]/80 md:text-left md:text-base">
                Kedai kopi kecil di Cipocok Jaya. Biji kami sangrai sendiri tiap Senin, gula arennya dari Baduy.
              </p>
              <div className="flex gap-2.5">
                <a href="#menu" className="rounded-full bg-[#22140e] px-6 py-3 text-sm font-bold text-[#f3ead8] transition-transform hover:-translate-y-0.5">
                  Lihat menu
                </a>
                <a href="#pesan" className="rounded-full border-2 border-[#22140e] px-6 py-2.5 text-sm font-bold text-[#22140e] transition-transform hover:-translate-y-0.5">
                  Pesan antar
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* dahan kopi di sudut, paling dekat ke kamera */}
        <motion.div style={naik(lapis.dahan)} className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className={`${s.goyang} absolute -top-[4%] -left-[16%] w-[52vw] origin-top-left md:-left-[3%] md:w-[19vw]`}>
            <Dahan />
          </div>
          <div className={`${s.goyang} absolute -top-[6%] -right-[18%] w-[48vw] origin-top-right -scale-x-100 [animation-delay:-2s] md:right-[1%] md:w-[15vw]`}>
            <Dahan buah={1} />
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}

function Awan({ x, y, k }: { x: number; y: number; k: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <ellipse cx="0" cy="0" rx="120" ry="26" />
      <ellipse cx="-40" cy="-18" rx="52" ry="30" />
      <ellipse cx="30" cy="-28" rx="62" ry="38" />
    </g>
  );
}

// Dahan kopi dengan daun berpasangan dan gerombol ceri. `buah` menggeser pola warna ceri supaya dua dahan beda.
const SIMPUL: [number, number, number][] = [
  [44, 52, 28],
  [92, 118, 34],
  [134, 188, 40],
  [168, 258, 46],
  [204, 330, 52],
];
const WARNA = ["#c3312b", "#a3221f", "#d8453a", "#7f9a45", "#c3312b", "#8e1c1a"];

function Dahan({ buah = 0 }: { buah?: number }) {
  return (
    <svg viewBox="0 0 300 420" className="h-auto w-full overflow-visible">
      <path d="M8 -20 C56 70 118 140 150 220 S214 362 262 430" fill="none" stroke="#3b2a1c" strokeWidth="6" strokeLinecap="round" />
      {SIMPUL.map(([x, y, sudut], i) => (
        <g key={y}>
          <Daun x={x} y={y} r={sudut - 95} p={96 + i * 6} />
          <Daun x={x} y={y} r={sudut + 10} p={88 + i * 7} />
          {Array.from({ length: 5 }, (_, k) => {
            const a = (k / 5) * Math.PI * 2 + i;
            return (
              <g key={k}>
                <circle cx={x + Math.cos(a) * 10} cy={y + Math.sin(a) * 8 + 4} r={9.5 - (k % 2)} fill={WARNA[(k + i + buah) % WARNA.length]} />
                <circle cx={x + Math.cos(a) * 10 - 3} cy={y + Math.sin(a) * 8 + 1} r="2.4" fill="#fff" opacity="0.35" />
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}

function Daun({ x, y, r, p }: { x: number; y: number; r: number; p: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <path d={`M0 0 C${p * 0.25} -${p * 0.24} ${p * 0.75} -${p * 0.22} ${p} 0 C${p * 0.75} ${p * 0.22} ${p * 0.25} ${p * 0.24} 0 0Z`} fill="#2f4b2f" />
      <path d={`M4 0 L${p - 8} 0`} stroke="#4d6d42" strokeWidth="1.6" />
    </g>
  );
}
