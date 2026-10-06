"use client";

import { type Transition, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { type CSSProperties, type ReactNode, useCallback, useEffect, useState } from "react";
import type { Undangan } from "../../types";
import { ASET } from "./aset";
import { Burung, Gambar, KelopakJatuh, LEMBUT, Pembatas, Wisteria, cormorant, italiana } from "./hias";
import s from "./garden.module.css";

// Beranda tema Garden Premium sekaligus animasi pembuka "memasuki taman" (±23 detik setelah "Buka Undangan"):
//   0.0  sampul pergi berlapis (shell.tsx) → kita berdiri di depan gerbang besi berkisi: tiang batu berguci di kedua
//        sisi, lengkung besi bermonogram di atasnya, wisteria menjuntai, semak peony di kakinya. Taman tampak samar
//        & jauh lewat kisi-kisinya. Kamera berputar sampai menghadap gerbang.
//   3.4  gembok emas di tengah gerbang berkilau, terbuka, lalu jatuh
//   4.2  kedua daun gerbang berayun terbuka (3D), cahaya & kelopak menyembur masuk
//   6.2  kamera melangkah melewati gerbang lalu berjalan menyusuri taman: lewat di bawah pergola wisteria, palem &
//        semak peony lewat di kiri-kanan, kupu-kupu beterbangan, sampai dekat ke gapura & air mancur
//  11.8  kamera menengadah & menoleh sejenak, lalu mundur (zoom out) memperlihatkan seluruh gapura
//  16.2  nama mempelai muncul di langit
//  18.0  kabut berkumpul di lengkung gapura, garis lengkung emas tergambar, lalu potret mempelai muncul dari balik
//        kabut mengisi lengkung itu; wisteria mekar di bahunya (urutannya di FotoLengkung)
// Pemandangan disusun dalam ruang 3D sungguhan (tiap lapisan di kedalaman sendiri, kamera bergerak di antaranya),
// jadi gerak maju-mundurnya parallax alami. Semuanya transform & opacity (dijalankan GPU).

const T_HADAP = 0.4;
const T_KUNCI = 3.4;
const T_BUKA = 4.2;
const T_MASUK = 6.2;
const T_DEKAT = 11.8;
const T_TOLEH = 13.6;
const T_DIAM = 16.6;
const T_TEKS = 16.2;
const T_FOTO = 18.0;
// detik saat seluruh animasi pembuka selesai (navigasi bawah baru muncul sesudahnya, lihat shell.tsx)
export const T_SELESAI = T_FOTO + 4;

// Jalur keyframe dari titik-titik [detik, nilai], satu easing per ruas
function jalur(titik: [number, string][], ease: Transition["ease"] = [0.45, 0, 0.3, 1]) {
  const t0 = titik[0][0];
  const dur = titik[titik.length - 1][0] - t0;
  return {
    nilai: titik.map((p) => p[1]),
    transition: { duration: dur, delay: t0, times: titik.map((p) => (p[0] - t0) / dur), ease: titik.slice(1).map(() => ease) } as Transition,
  };
}

/* ───────── Taman 3D ───────── */

const P = 1000; // jarak pandang kamera (perspective), px

// Kamera: translateZ = maju ke taman. Mulai jauh di luar gerbang, berjalan masuk sampai dekat gapura, menoleh,
// lalu mundur & berhenti tepat di posisi diam (semua lapisan berukuran asli).
const KAMERA = jalur([
  [0, "translateZ(-600px) rotateX(0deg) rotateY(0deg)"],
  [T_MASUK, "translateZ(-600px) rotateX(0deg) rotateY(0deg)"],
  [T_DEKAT, "translateZ(300px) rotateX(0deg) rotateY(0deg)"],
  [T_TOLEH, "translateZ(300px) rotateX(-4deg) rotateY(-8deg)"],
  [T_DIAM, "translateZ(0px) rotateX(0deg) rotateY(0deg)"],
]);

// Satu lapisan sedalam z px (negatif = di belakang layar), diperbesar/diperkecil supaya saat kamera diam ukurannya asli
function Lapis({ z, className = "", children }: { z: number; className?: string; children: ReactNode }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} style={{ transform: `translateZ(${z}px) scale(${Math.round(((P - z) / P) * 1000) / 1000})` }}>
      {children}
    </div>
  );
}

// Lapisan yang hanya tampak selama kamera berjalan, lalu memudar sebelum terlalu dekat
function LapisLewat({ z, hilang, buka, children }: { z: number; hilang: number; buka: boolean; children: ReactNode }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{ transform: `translateZ(${z}px) scale(${Math.round(((P - z) / P) * 1000) / 1000})` }}
      initial={{ opacity: 1 }}
      animate={buka ? { opacity: 0 } : undefined}
      transition={{ duration: 1, delay: hilang }}
    >
      {children}
    </motion.div>
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

// Kupu-kupu kecil yang terbang melintas berkelok
function Kupu({ className = "", d = 16, jeda = 0, warna = "#7f9fae" }: { className?: string; d?: number; jeda?: number; warna?: string }) {
  return (
    <div className={`${s.kupu} pointer-events-none absolute left-0 ${className}`} style={{ "--d": `${d}s`, "--j": `${jeda}s` } as CSSProperties} aria-hidden="true">
      <svg viewBox="0 0 20 16" className={`${s.sayap} w-4`}>
        <path d="M10 8C6 0 0 1 1 6s5 4 9 2Zm0 0c4-8 10-7 9-2s-5 4-9 2Zm0 0C7 12 3 15 4 11s4-3 6-3Zm0 0c3 4 7 7 6 3s-4-3-6-3Z" fill={warna} stroke="#24434e" strokeWidth=".6" />
      </svg>
    </div>
  );
}

function Taman({ buka }: { buka: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 [perspective:1000px] [perspective-origin:50%_55%]">
      <motion.div className="absolute inset-0 [transform-style:preserve-3d]" initial={{ transform: KAMERA.nilai[0] }} animate={buka ? { transform: KAMERA.nilai } : undefined} transition={KAMERA.transition}>
        {/* 1. langit, lembah & pegunungan (paling jauh) */}
        <Lapis z={-900}>
          {/* panorama lembah yang lebih luas di belakangnya: saat kamera masih jauh, sekeliling lembah tidak polos */}
          <div className="absolute -inset-[70%] bg-[linear-gradient(#e2eae7,#eef1ec_35%,#dde6e2)]" />
          <div className="absolute -inset-[45%] opacity-55 [mask-image:radial-gradient(closest-side,black_55%,transparent)]">
            <Image src={ASET.lembah.src} alt="" fill sizes="(min-width: 440px) 840px, 190vw" className="object-cover object-[50%_40%]" />
          </div>
          <div className="absolute inset-0 [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
            <Image src={ASET.lembah.src} alt="" fill preload sizes="(min-width: 440px) 440px, 100vw" className="object-cover object-[50%_38%]" />
          </div>
          <div className="absolute inset-x-0 top-0 h-[34%] bg-gradient-to-b from-[#eef1ec] via-[#eef1ec]/60 to-transparent" />
          <Burung className="top-[9%] left-0" delay={-4} />
          <Burung className="top-[12%] left-0" delay={-11} size={11} />
        </Lapis>

        {/* 2. kabut & palem */}
        <Lapis z={-600}>
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

        {/* 3. gapura taman dengan air mancur, wisteria menjuntai dari lengkungnya */}
        <Lapis z={-300}>
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

        {/* kupu-kupu di antara gapura & bunga */}
        <Lapis z={-160}>
          <Kupu className="top-[46%]" d={17} jeda={-3} />
          <Kupu className="top-[58%]" d={21} jeda={-11} warna="#e7a3a6" />
        </Lapis>

        {/* 4. merak & peony di depan gapura */}
        <Lapis z={-80}>
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

        {/* 5. wisteria paling dekat, di sudut atas */}
        <Lapis z={60}>
          <Wisteria className="top-[-8%] left-[1%] w-[12%]" sizes="56px" />
          <Wisteria className="top-[-12%] right-[2%] w-[11%]" sizes="52px" jeda={-1} />
        </Lapis>

        {/* yang dilewati kamera saat berjalan: pergola wisteria di atas, palem & semak peony di kiri-kanan */}
        <LapisLewat z={180} hilang={9.4} buka={buka}>
          <div className="absolute inset-x-[-10%] top-[2%] h-3 rounded-full bg-[linear-gradient(#e7ece8,#b9c7c4)] shadow-[0_3px_0_#34596a]" />
          {[4, 18, 33, 50, 66, 80, 94].map((x, i) => (
            <div key={x} className="absolute top-[3%] w-[11%]" style={{ left: `${x - 5}%` }}>
              <Wisteria className="top-0 left-0 w-full" sizes="56px" jeda={-i * 0.7} />
            </div>
          ))}
        </LapisLewat>
        <LapisLewat z={350} hilang={8.8} buka={buka}>
          <div className="absolute bottom-[14%] left-[-30%] w-[52%]">
            <Gambar a="palem" sizes="230px" />
          </div>
          <div className="absolute right-[-26%] bottom-[-4%] w-[58%]">
            <Gambar a="peonyMerah" flip sizes="260px" />
          </div>
          <div className="absolute bottom-[-6%] left-[-22%] w-[56%]">
            <Gambar a="peony" sizes="250px" />
          </div>
        </LapisLewat>
      </motion.div>
    </div>
  );
}

/* ───────── Gerbang taman ───────── */

// Lubang gerbang 300 × 440 berpuncak setengah lingkaran (150 / 440 = 34,1% tingginya)
const LENGKUNG: CSSProperties = { borderRadius: "50% 50% 0 0 / 34.1% 34.1% 0 0" };
// Masker dinding: semua tampak kecuali lubang berbentuk gerbang tepat di kotak lubang (dinding meluas 200vmax ke
// segala arah dari kotak itu)
const ARCH = `url("data:image/svg+xml;utf8,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 440' preserveAspectRatio='none'><path d='M0 440V150A150 150 0 0 1 300 150V440Z'/></svg>")}")`;
const LUBANG: CSSProperties = {
  maskImage: `linear-gradient(#000, #000), ${ARCH}`,
  WebkitMaskImage: `linear-gradient(#000, #000), ${ARCH}`,
  maskSize: "100% 100%, calc(100% - 400vmax) calc(100% - 400vmax)",
  WebkitMaskSize: "100% 100%, calc(100% - 400vmax) calc(100% - 400vmax)",
  maskPosition: "0 0, 200vmax 200vmax",
  WebkitMaskPosition: "0 0, 200vmax 200vmax",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskComposite: "exclude",
  WebkitMaskComposite: "xor",
};

function Gerbang({ u, buka, onSelesai }: { u: Undangan; buka: boolean; onSelesai: () => void }) {
  useEffect(() => {
    if (!buka) return;
    const id = setTimeout(onSelesai, (T_MASUK + 2.6) * 1000);
    return () => clearTimeout(id);
  }, [buka, onSelesai]);

  // berputar menghadap gerbang, diam, lalu membesar melewati layar (kamera melangkah masuk) & memudar
  const gerak = jalur(
    [
      [0, "rotateY(12deg) scale(1.08)"],
      [T_HADAP, "rotateY(12deg) scale(1.08)"],
      [T_HADAP + 2.8, "rotateY(0deg) scale(1)"],
      [T_MASUK, "rotateY(0deg) scale(1)"],
      [T_MASUK + 2.4, "rotateY(0deg) scale(5.5)"],
    ],
    [0.5, 0, 0.3, 1],
  );
  const pudar = { duration: T_MASUK + 2.4, times: [0, (T_MASUK + 1.4) / (T_MASUK + 2.4), 1] };

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-clip [perspective:900px]" aria-hidden="true">
      <motion.div
        className="absolute inset-0 flex flex-col items-center"
        style={{ transformOrigin: "50% 40%" }}
        initial={{ opacity: 1, transform: gerak.nilai[0] }}
        animate={buka ? { opacity: [1, 1, 0], transform: gerak.nilai } : undefined}
        transition={{ ...gerak.transition, opacity: pudar }}
      >
        <div className="h-[17%] min-h-[6.5rem] shrink-0" />

        <div className="relative w-[66%] max-w-[18rem] shrink-0">
          {/* lubang gerbang */}
          <div className="relative aspect-[300/440] [perspective:800px]" style={{ ...LENGKUNG, boxShadow: "inset 0 12px 26px rgb(20 40 48 / 0.35)" }}>
            {/* dinding taman berteralis daun di sekeliling lubang gerbang (lubangnya dipotong dengan masker) */}
            <div className={`${s.teralis} absolute -inset-[200vmax]`} style={LUBANG} />
            {[true, false].map((kiri) => (
              <DaunGerbang key={String(kiri)} kiri={kiri} buka={buka} />
            ))}
            <Gembok buka={buka} />
            <motion.div
              className="absolute -inset-[30%] bg-[radial-gradient(closest-side,rgb(255_252_238),rgb(255_246_220/0.7)_45%,transparent)]"
              initial={{ opacity: 0 }}
              animate={buka ? { opacity: [0, 0.95, 0] } : undefined}
              transition={{ duration: 2, times: [0, 0.25, 1], ease: "easeOut", delay: T_BUKA + 0.3 }}
            />
          </div>

          {/* tiang batu berguci di kiri-kanan */}
          {[true, false].map((kiri) => (
            <TiangBatu key={String(kiri)} className={`top-[-9%] bottom-0 w-[24%] ${kiri ? "right-[96%]" : "left-[96%]"}`} />
          ))}
          {/* lengkung besi bermonogram & wisteria yang menjuntai darinya */}
          <LengkungBesi u={u} />
          {[
            ["left-[4%] w-[13%]", 0],
            ["left-[17%] w-[10%]", -1.2],
            ["right-[17%] w-[10%]", -0.6],
            ["right-[4%] w-[13%]", -2],
          ].map(([c, j]) => (
            <Wisteria key={c as string} className={`top-[-3%] ${c}`} sizes="60px" jeda={j as number} />
          ))}
          {/* semak peony di kaki tiang */}
          <div className="absolute -left-[46%] bottom-[-8%] z-20 w-[72%]">
            <div className={s.ayunA} style={{ transformOrigin: "40% 100%" }}>
              <Gambar a="peony" sizes="220px" />
            </div>
          </div>
          <div className="absolute -right-[42%] bottom-[-6%] z-20 w-[60%]">
            <div className={s.ayunB} style={{ transformOrigin: "60% 100%" }}>
              <Gambar a="peonyMerah" sizes="190px" />
            </div>
          </div>
        </div>

        {/* halaman rumput di depan gerbang: pagar tanaman di kaki dinding, jalan batu pijakan, bunga-bunga kecil */}
        <div className={`${s.rumput} relative w-full flex-1`}>
          <svg viewBox="0 0 400 40" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-9 w-full -translate-y-[55%]" aria-hidden="true">
            <path
              d="M0 40V22C10 10 24 8 34 16 42 6 58 4 66 14 76 4 92 6 100 16 110 6 126 6 134 16 144 4 160 6 168 16 178 6 194 6 202 16 212 4 228 6 236 16 246 6 262 6 270 16 280 4 296 6 304 16 314 6 330 6 338 16 348 4 364 6 372 16 382 8 394 10 400 20V40Z"
              fill="#7e9e94"
              stroke="#4d7066"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
            />
            <path d="M0 40V30C40 24 80 26 120 30S200 34 240 30 320 24 400 30V40Z" fill="#6d8f85" />
          </svg>
          <div className="absolute inset-x-[30%] top-0 bottom-0 bg-[linear-gradient(#e6ece8,#d6dfda)] [clip-path:polygon(18%_0,82%_0,100%_100%,0_100%)]" />
          {[14, 40, 68].map((y, i) => (
            <span key={y} className="absolute left-1/2 h-[9%] -translate-x-1/2 rounded-[50%] bg-[#f1f4f0] shadow-[inset_0_-3px_0_#b9c7c4]" style={{ top: `${y}%`, width: `${18 + i * 7}%` }} />
          ))}
          {[
            [8, 30, "#e7a3a6"],
            [20, 62, "#f3efe3"],
            [12, 82, "#d98a8d"],
            [84, 36, "#f3efe3"],
            [92, 66, "#e7a3a6"],
            [78, 86, "#dcc58f"],
            [26, 20, "#dcc58f"],
            [70, 18, "#e7a3a6"],
          ].map(([x, y, w], i) => (
            <svg key={i} viewBox="-6 -6 12 12" className="absolute size-3" style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true">
              {[0, 72, 144, 216, 288].map((r) => (
                <ellipse key={r} cy="-3" rx="1.8" ry="3" transform={`rotate(${r})`} fill={w as string} />
              ))}
              <circle r="1.2" fill="#b9975b" />
            </svg>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Daun gerbang besi berkisi (taman tampak samar di baliknya), berengsel di tepi luar, berayun terbuka ke dalam
function DaunGerbang({ kiri, buka }: { kiri: boolean; buka: boolean }) {
  const sudut = kiri ? "rounded-tl-[100%_34.1%]" : "rounded-tr-[100%_34.1%]";
  return (
    <motion.div
      className={`absolute inset-y-0 w-1/2 overflow-hidden border-[4px] border-[#34596a] bg-[rgb(233_238_233/0.35)] ${kiri ? "left-0" : "right-0"} ${sudut}`}
      style={{ transformOrigin: kiri ? "0% 50%" : "100% 50%" }}
      initial={{ transform: "rotateY(0deg)" }}
      animate={buka ? { transform: ["rotateY(0deg)", `rotateY(${kiri ? 10 : -10}deg)`, `rotateY(${kiri ? 116 : -116}deg)`, `rotateY(${kiri ? 102 : -102}deg)`] } : undefined}
      transition={{ duration: 2.4, times: [0, 0.16, 0.7, 1], ease: [[0.4, 0, 0.6, 1], [0.3, 0, 0.2, 1], [0.4, 0, 0.4, 1]], delay: T_BUKA }}
    >
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <pattern id={`gd-kisi-${kiri ? "ki" : "ka"}`} width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M0 0H20M0 0V20" stroke="#34596a" strokeWidth="2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#gd-kisi-${kiri ? "ki" : "ka"})`} />
      </svg>
      <span className={`absolute inset-[5px] border border-[#dcc58f]/80 ${sudut}`} />
      <span className="absolute inset-x-0 top-[60%] h-[5px] bg-[#34596a]" />
      <span className="absolute inset-x-0 top-[61%] h-[2px] bg-[#dcc58f]" />
      {/* bunga besi di tengah panel */}
      <svg viewBox="-20 -20 40 40" className="absolute top-[34%] left-1/2 w-[42%] -translate-x-1/2" aria-hidden="true">
        {[0, 60, 120, 180, 240, 300].map((r) => (
          <ellipse key={r} cy="-10" rx="4.6" ry="9" transform={`rotate(${r})`} fill="none" stroke="#34596a" strokeWidth="2" />
        ))}
        <circle r="4.2" fill="#dcc58f" stroke="#34596a" strokeWidth="1.5" />
      </svg>
    </motion.div>
  );
}

// Gembok emas berbentuk hati di pertemuan kedua daun gerbang: berkilau, terbuka, lalu jatuh
function Gembok({ buka }: { buka: boolean }) {
  return (
    <motion.div
      className="absolute top-[56%] left-1/2 z-10 w-[16%] -translate-x-1/2"
      initial={{ opacity: 1, transform: "translateY(0px) rotate(0deg)" }}
      animate={buka ? { opacity: [1, 1, 0], transform: ["translateY(0px) rotate(0deg)", "translateY(0px) rotate(0deg)", "translateY(70px) rotate(24deg)"] } : undefined}
      transition={{ duration: 1, times: [0, 0.45, 1], ease: "easeIn", delay: T_KUNCI + 0.5 }}
    >
      <svg viewBox="0 0 40 52" className="w-full overflow-visible drop-shadow-[0_3px_4px_rgb(20_40_48/0.4)]">
        <defs>
          <linearGradient id="gd-gembok" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8a6a33" />
            <stop offset=".4" stopColor="#f2e3b5" />
            <stop offset="1" stopColor="#a8843f" />
          </linearGradient>
        </defs>
        {/* sengkelit yang terangkat saat gembok terbuka */}
        <motion.path
          d="M11 20V12a9 9 0 0 1 18 0v8"
          fill="none"
          stroke="url(#gd-gembok)"
          strokeWidth="4"
          initial={{ y: 0 }}
          animate={buka ? { y: [0, 0, -7] } : undefined}
          transition={{ duration: 0.6, times: [0, 0.4, 1], delay: T_KUNCI }}
        />
        <path d="M20 50 4 33a9 9 0 0 1 16-11 9 9 0 0 1 16 11Z" fill="url(#gd-gembok)" stroke="#7a5c2a" strokeWidth="1" />
        <circle cx="20" cy="32" r="3" fill="#24434e" />
        <path d="M19 33h2v6h-2Z" fill="#24434e" />
        <motion.path
          d="M0-6C.7-1.4 1.4-.7 6 0 1.4.7.7 1.4 0 6-.7 1.4-1.4.7-6 0-1.4-.7-.7-1.4 0-6Z"
          fill="#fffbe8"
          initial={{ opacity: 0, x: 30, y: 26, scale: 0.4 }}
          animate={buka ? { opacity: [0, 1, 0], scale: [0.4, 1.6, 0.4] } : undefined}
          transition={{ duration: 0.8, delay: T_KUNCI - 0.4 }}
        />
      </svg>
    </motion.div>
  );
}

// Tiang batu bergalur dengan guci di puncaknya
function TiangBatu({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 460" preserveAspectRatio="none" className={`absolute drop-shadow-[0_8px_10px_rgb(20_40_48/0.25)] ${className}`} aria-hidden="true">
      <g fill="#eef1ec" stroke="#34596a" strokeWidth="1.4" vectorEffect="non-scaling-stroke">
        <path d="M22 4h16l-2 8h-12Z" />
        <path d="M18 12c-8 4-8 16 2 20h20c10-4 10-16 2-20Z" />
        <path d="M8 34h44v10H8Z" />
        <path d="M12 44h36v6H12Z" />
        <path d="M14 50h32v370H14Z" />
        <path d="M8 420h44v14H8ZM4 434h52v26H4Z" />
      </g>
      <g stroke="#34596a" strokeWidth="1" opacity=".55" vectorEffect="non-scaling-stroke">
        <path d="M21 56v358M27 56v358M33 56v358M39 56v358" />
      </g>
    </svg>
  );
}

// Lengkung besi tempa di atas gerbang dengan pelat monogram mempelai
function LengkungBesi({ u }: { u: Undangan }) {
  return (
    <div className="absolute inset-x-[-14%] top-[-17%] aspect-[300/100]">
      <svg viewBox="0 0 300 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <g fill="none" stroke="#34596a" strokeWidth="3" strokeLinecap="round">
          <path d="M14 96C30 46 90 26 150 26s120 20 136 70" />
          <path d="M30 96C44 58 96 40 150 40s106 18 120 56" strokeWidth="2" />
          <path d="M14 96c-8-6-6-16 2-16s8 10 2 12M286 96c8-6 6-16-2-16s-8 10-2 12" strokeWidth="2" />
          {[60, 90, 210, 240].map((x) => (
            <path key={x} d={`M${x} ${x < 150 ? 44 - (x - 60) * 0.25 : 44 - (240 - x) * 0.25}c-6-10 4-16 8-8`} strokeWidth="1.8" />
          ))}
        </g>
        <ellipse cx="150" cy="32" rx="40" ry="27" fill="#eef1ec" stroke="#b9975b" strokeWidth="3" />
        <ellipse cx="150" cy="32" rx="34" ry="21" fill="none" stroke="#34596a" strokeWidth="1" />
      </svg>
      <p className={`${italiana} absolute top-[32%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[1.35rem] leading-none whitespace-nowrap text-[#24434e]`}>
        {u.wanita.panggilan[0]}
        <span className="mx-0.5 text-[0.9rem] text-[#b9975b]">&amp;</span>
        {u.pria.panggilan[0]}
      </p>
    </div>
  );
}

/* ───────── Foto mempelai di lengkung gapura ───────── */

// Foto mengisi lubang lengkung gapura (gambar gapura: lubangnya x 25–75%, lengkung mulai di y 40%, puncak dalam ±23%),
// kakinya memudar ke air mancur di bawahnya, seakan pemandangan di balik gapura berubah menjadi potret mempelai.
// Urutan (detik dari `mulai`): kabut putih berkumpul di lengkung → garis lengkung emas tergambar → foto muncul dari
// balik kabut sambil sedikit mengecil → wisteria mekar di kedua bahu lengkung → kilau emas berkelip.
function FotoLengkung({ src, alt, mulai }: { src: string; alt: string; mulai: number | false }) {
  const jalan = mulai !== false;
  const t = mulai || 0;
  const pudarBawah = { maskImage: "linear-gradient(black 72%, transparent)", WebkitMaskImage: "linear-gradient(black 72%, transparent)" };
  return (
    <div className="absolute top-[25.5%] left-[27%] h-[44%] w-[46%]">
      {/* kabut yang berkumpul lalu tersibak */}
      <motion.div
        className="absolute -inset-[18%] rounded-t-full bg-[radial-gradient(closest-side,rgb(250_252_248),rgb(244_247_242/0.85)_55%,transparent)]"
        initial={{ opacity: 0, transform: "scale(0.6)" }}
        animate={jalan ? { opacity: [0, 0.95, 0.95, 0], transform: ["scale(0.6)", "scale(1)", "scale(1.05)", "scale(1.25)"] } : undefined}
        transition={{ duration: 3, times: [0, 0.3, 0.55, 1], ease: "easeInOut", delay: t }}
      />
      {/* potret */}
      <motion.div
        className="absolute inset-0 overflow-clip rounded-t-full"
        style={pudarBawah}
        initial={{ opacity: 0 }}
        animate={jalan ? { opacity: 1 } : undefined}
        transition={{ duration: 1.6, ease: "easeOut", delay: t + 1 }}
      >
        <motion.div className="absolute inset-0" initial={{ transform: "scale(1.16)" }} animate={jalan ? { transform: "scale(1)" } : undefined} transition={{ duration: 3, ease: LEMBUT, delay: t + 1 }}>
          <Image src={src} alt={alt} fill preload sizes="(min-width: 440px) 200px, 45vw" className="object-cover object-[50%_28%]" />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute inset-y-0 left-0 w-[70%] bg-[linear-gradient(100deg,transparent_20%,rgb(255_247_222/0.6)_50%,transparent_80%)]"
          initial={{ opacity: 0, transform: "translateX(-110%)" }}
          animate={jalan ? { opacity: [0, 1, 0], transform: "translateX(160%)" } : undefined}
          transition={{ duration: 1.3, ease: "easeInOut", delay: t + 2.6 }}
        />
      </motion.div>
      {/* garis lengkung emas di tepi potret, memudar di kaki */}
      <svg viewBox="0 0 100 157" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" style={pudarBawah} aria-hidden="true">
        <defs>
          <linearGradient id="gd-lengkung" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8a6a33" />
            <stop offset=".45" stopColor="#f2e3b5" />
            <stop offset="1" stopColor="#a8843f" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0 157V50A50 50 0 0 1 100 50V157"
          fill="none"
          stroke="url(#gd-lengkung)"
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={jalan ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{ pathLength: { duration: 1.8, ease: [0.65, 0, 0.35, 1], delay: t + 0.5 }, opacity: { duration: 0.2, delay: t + 0.5 } }}
        />
      </svg>
      {/* wisteria mekar di kedua bahu lengkung */}
      {[true, false].map((kiri) => (
        <motion.div
          key={String(kiri)}
          className={`absolute top-[6%] w-[22%] ${kiri ? "-left-[6%]" : "-right-[6%]"}`}
          style={{ transformOrigin: "50% 0%" }}
          initial={{ opacity: 0, transform: "scaleY(0.2)" }}
          animate={jalan ? { opacity: 1, transform: "scaleY(1)" } : undefined}
          transition={{ duration: 1.4, ease: LEMBUT, delay: t + 1.9 + (kiri ? 0 : 0.15) }}
        >
          <Wisteria className="top-0 left-0 w-full" sizes="50px" jeda={kiri ? 0 : -1.3} />
        </motion.div>
      ))}
      {/* kilau emas berkelip di sekeliling lengkung */}
      {[
        [8, 12],
        [92, 18],
        [50, -6],
        [-4, 46],
        [104, 52],
      ].map(([x, y], i) => (
        <motion.svg
          key={i}
          viewBox="-6 -6 12 12"
          className="absolute size-3"
          style={{ left: `${x}%`, top: `${y}%` }}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={jalan ? { opacity: [0, 1, 0], scale: [0.3, 1.3, 0.3] } : undefined}
          transition={{ duration: 1.2, delay: t + 2.4 + i * 0.18 }}
          aria-hidden="true"
        >
          <path d="M0-6C.7-1.4 1.4-.7 6 0 1.4.7.7 1.4 0 6-.7 1.4-1.4.7-6 0-1.4-.7-.7-1.4 0-6Z" fill="#f2e3b5" />
        </motion.svg>
      ))}
    </div>
  );
}

/* ───────── Beranda ───────── */

export function Adegan({ u, buka }: { u: Undangan; buka: boolean }) {
  const [lewat, setLewat] = useState(false);
  const selesai = useCallback(() => setLewat(true), []);
  // "kurangi gerakan": gerak transform dilewati motion, jadi gerbang langsung dihilangkan saat dibuka
  const kurangi = useReducedMotion();
  return (
    <section id="beranda" className={`${s.sek} relative h-svh min-h-[42rem] overflow-clip bg-[#e7ece8]`}>
      <Taman buka={buka} />

      {/* kelopak yang beterbangan selama berjalan di taman */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={buka ? { opacity: [0, 1, 1, 0.35] } : undefined}
        transition={{ duration: T_DIAM - T_BUKA, times: [0, 0.1, 0.7, 1], delay: T_BUKA }}
      >
        <KelopakJatuh n={10} />
      </motion.div>

      {/* nama di langit, di atas gapura; muncul setelah kamera berhenti */}
      <div className={`${s.keluarTeks} absolute inset-x-0 top-[7%] flex flex-col items-center px-10 text-center`}>
        <motion.div
          className="absolute inset-x-[6%] -inset-y-8 rounded-[50%] bg-[radial-gradient(closest-side,rgb(238_241_236/0.9),rgb(238_241_236/0.55)_60%,transparent)]"
          initial={{ opacity: 0 }}
          animate={buka ? { opacity: 1 } : undefined}
          transition={{ duration: 1.4, delay: T_TEKS - 0.2 }}
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
            transition={{ duration: 1.3, ease: LEMBUT, delay: T_TEKS + i * 0.18 }}
          >
            {el}
          </motion.div>
        ))}
      </div>

      {/* foto mempelai di dalam lengkung gapura (kotaknya sama persis dengan gambar gapura, lihat FotoLengkung) */}
      <div className={`${s.keluarTengah} pointer-events-none absolute bottom-[3%] left-[1%] aspect-[1000/1500] w-[98%]`}>
        <FotoLengkung src={u.foto.sampul} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} mulai={buka ? T_FOTO : false} />
      </div>

      {/* petunjuk gulir */}
      <motion.div
        className="absolute inset-x-0 bottom-[calc(5.5rem+var(--demo-h,0px))] flex justify-center"
        initial={{ opacity: 0 }}
        animate={buka ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: T_SELESAI }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className={`${s.petunjuk} size-6 text-[#f3efe3] drop-shadow-[0_1px_3px_rgb(0_0_0/0.5)]`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </motion.div>

      {!lewat && !(kurangi && buka) && <Gerbang u={u} buka={buka} onSelesai={selesai} />}
    </section>
  );
}
