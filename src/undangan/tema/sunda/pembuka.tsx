"use client";

import { type Transition, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import type { Undangan } from "../../types";
import { ASET, RUMPUN_GEDUNG } from "./aset";
import { Burung, GedungSate, Kujang, Kuntul, MegaMendung, MelatiJatuh, Rumpun, Siger } from "./ornamen";
import s from "./sunda.module.css";

// Beranda tema Art Sunda sekaligus animasi pembuka "Lalampahan ka Bandung" (±24 detik). Urutannya (detik setelah
// "Buka Undangan" ditekan; kartu sampul terangkat di shell.tsx):
//   0.0  kita berada di dalam rumah panggung: dinding bilik, lampu gantung, dudukuy di dinding, angklung & kendi
//        berisi melati. Pintu nila bermotif mega mendung masih tertutup; kamera berputar sampai menghadap pintu.
//   2.0  cahaya pagi merembes dari celah pintu, 2.6 kujang di kedua daun pintu berkilau
//   3.6  pintu berayun terbuka ke dalam rumah, cahaya menyembur & jatuh di tikar pandan → tampak sawah Priangan
//   5.6  kamera melangkah keluar pintu lalu terbang di atas sawah berundak menuju Tangkuban Perahu; rumpun bambu
//        terlewati di kiri-kanan, kawanan kuntul melintas, kuncup melati beterbangan
//  11.0  kamera mendongak masuk ke gumpalan awan mega mendung yang menutup seluruh layar (12.4)
//  13.0  awan tersibak ke kiri-kanan → pagi di Bandung: kamera mundur memperlihatkan Gedung Sate dari dekat sampai
//        seluruhnya tampak (17.0); bunga di kakinya tumbuh (15.2), nama mempelai muncul (16.2)
//  18.2  foto mempelai tampil (urutannya di FotoSiger): kujang terbang mengapit, bingkai lengkung tergambar, tirai
//        mega mendung tersibak, siger turun di puncak, ronce melati terjuntai
// Semua gerak memakai transform & opacity (dijalankan mesin animasi browser). Pemandangan 3D: tiap lapisan berada
// di kedalaman sendiri di dalam satu "kamera" ber-perspektif, jadi geraknya parallax sungguhan.

const T_HADAP = 0.5;
const T_CAHAYA = 2.0;
const T_KUJANG = 2.6;
const T_BUKA = 3.6;
const T_MASUK = 5.6;
const T_AWAN = 11.0;
const T_TUTUP = 12.4;
const T_SIBAK = 13.0;
const T_MEKAR = 15.2;
const T_TEKS = 16.2;
const T_DIAM = 17.0;
const T_FOTO = 18.2;
// detik saat seluruh animasi pembuka selesai (navigasi bawah baru muncul sesudahnya, lihat shell.tsx)
export const T_SELESAI = T_FOTO + 6.2;

const ease = [0.22, 1, 0.36, 1] as const;
const rozha = "font-[family-name:var(--font-rozha)]";

// Jalur keyframe dari titik-titik [detik, nilai, easing ruas menuju titik itu]
type Titik = [number, string] | [number, string, Transition["ease"]];
function jalur(titik: Titik[], ease: Transition["ease"] = [0.45, 0, 0.25, 1]) {
  const t0 = titik[0][0];
  const dur = titik[titik.length - 1][0] - t0;
  return {
    nilai: titik.map((p) => p[1]),
    transition: { duration: dur, delay: t0, times: titik.map((p) => (p[0] - t0) / dur), ease: titik.slice(1).map((p) => p[2] ?? ease) } as Transition,
  };
}

/* ───────── Pemandangan 3D ───────── */

const P = 1000; // jarak pandang (perspective) kamera, px

// Satu lapisan sejauh z px dari layar (negatif = di belakang), diperbesar/diperkecil supaya saat kamera diam ukurannya
// tetap asli. asal = titik perspektif, supaya posisinya saat diam juga tepat sama.
// datar: tanpa 3D sama sekali (tampilannya sama persis dengan saat kamera diam), dipakai sesudah pembuka selesai
function Lapis({ z, asal = "50% 50%", datar = false, children }: { z: number; asal?: string; datar?: boolean; children: ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-0" style={datar ? undefined : { transformOrigin: asal, transform: `translateZ(${z}px) scale(${Math.round(((P - z) / P) * 1000) / 1000})` }}>
      {children}
    </div>
  );
}

// Lapisan dekat yang dilewati kamera, lalu dihilangkan sesudah terlewati
function LapisLewat({ z, asal, hilang, buka, children }: { z: number; asal: string; hilang: number; buka: boolean; children: ReactNode }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{ transformOrigin: asal, transform: `translateZ(${z}px) scale(${Math.round(((P - z) / P) * 1000) / 1000})` }}
      initial={{ opacity: 1 }}
      animate={buka ? { opacity: 0 } : undefined}
      transition={{ duration: 0.6, delay: hilang }}
    >
      {children}
    </motion.div>
  );
}

function Sawah({ balik = false }: { balik?: boolean }) {
  const a = ASET.sawah;
  return <Image src={a.src} alt="" width={a.w} height={a.h} sizes="(min-width: 440px) 880px, 200vw" className={`h-auto w-full ${balik ? "-scale-x-100" : ""}`} />;
}

function Gambar({ a, className = "", sizes, balik = false }: { a: keyof typeof ASET; className?: string; sizes: string; balik?: boolean }) {
  const g = ASET[a];
  return <Image src={g.src} alt="" width={g.w} height={g.h} sizes={sizes} className={`absolute h-auto ${balik ? "-scale-x-100" : ""} ${className}`} />;
}

// Pegunungan Priangan dengan Tangkuban Perahu (punggungnya datar memanjang seperti perahu terbalik), gaya cetak tinta
function Gunung({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 110" className={className} aria-hidden="true">
      <path d="M0 110V70C30 60 50 46 80 50C110 54 122 40 150 42C190 45 204 30 238 34C272 38 290 52 322 48C352 44 372 56 400 52V110Z" fill="#aebdcf" />
      <path d="M52 110C86 96 116 64 158 53C192 45 250 45 282 54C314 63 334 92 366 110Z" fill="#7d93ae" />
      <g fill="none" stroke="#4d6585" strokeWidth="1.1" strokeLinecap="round" opacity=".55">
        <path d="M150 62c10 8 14 20 12 34M184 56c8 12 10 26 6 40M222 55c6 12 6 26 0 40M256 58c-2 12-6 24-14 34M118 76c8 6 12 16 10 26" />
      </g>
      <path d="M0 110V96C40 88 70 82 110 88C150 94 180 80 222 84C270 90 300 76 340 82C370 86 390 92 400 94V110Z" fill="#5d7898" />
    </svg>
  );
}

// Saung (dangau) di tengah sawah, gaya cetak tinta nila
function Saung({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 64" className={className} aria-hidden="true">
      <g stroke="#2f4560" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        <path d="M22 40V62M58 40V62M40 40V62" fill="none" />
        <path d="M16 40H64V46H16Z" fill="#e9e0cf" />
        <path d="M4 32L40 6L76 32Q40 26 4 32Z" fill="#41597a" />
        <path d="M14 30L40 12M26 28L40 18M54 28L40 18M66 30L40 12" fill="none" stroke="#d9e1ea" strokeWidth=".9" />
        <path d="M18 32H62V40H18Z" fill="#c9b892" />
      </g>
    </svg>
  );
}

function Kawanan({ buka }: { buka: boolean }) {
  const burung = [
    [0, 0, 34, 0],
    [12, -18, 26, -0.2],
    [20, 14, 28, -0.4],
    [-10, 20, 22, -0.1],
    [30, -4, 20, -0.3],
    [-18, -10, 18, -0.5],
  ];
  return (
    <motion.div
      className="absolute top-[22%] left-0 w-full"
      initial={{ transform: "translate(-70%, 30px)" }}
      animate={buka ? { transform: "translate(130%, -40px)" } : undefined}
      transition={{ duration: 6.4, delay: 6.0, ease: "linear" }}
    >
      {burung.map(([x, y, w, j], i) => (
        <div key={i} className="absolute" style={{ left: `${x}%`, top: y }}>
          <Burung w={w} jeda={j} />
        </div>
      ))}
    </motion.div>
  );
}

// Kamera di Priangan: dari pintu pemandangan tampak dekat, lalu kamera terbang di atas sawah (laju dijaga sama di
// sambungan dua ruas) dan mendongak masuk ke awan
const ASAL_DESA = "50% 40%";
const KAMERA_DESA = jalur([
  [0, "translateZ(120px) rotateX(0deg) rotateZ(0deg)"],
  [T_MASUK, "translateZ(120px) rotateX(0deg) rotateZ(0deg)"],
  [9.0, "translateZ(430px) rotateX(2deg) rotateZ(-1.6deg)", [0.5, 0, 0.75, 0.6]],
  [T_TUTUP + 0.4, "translateZ(900px) rotateX(10deg) rotateZ(0.8deg)", [0.3, 0.35, 0.4, 1]],
]);

function Priangan({ buka }: { buka: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 [perspective:1000px] [perspective-origin:50%_40%]"
      initial={{ opacity: 1 }}
      animate={buka ? { opacity: 0 } : undefined}
      transition={{ duration: 0.4, delay: T_TUTUP + 0.1 }}
    >
      <motion.div
        className="absolute inset-0 [transform-style:preserve-3d]"
        initial={{ transform: KAMERA_DESA.nilai[0] }}
        animate={buka ? { transform: KAMERA_DESA.nilai } : undefined}
        transition={KAMERA_DESA.transition}
      >
        {/* langit fajar & matahari terbit (paling jauh) */}
        <Lapis z={-1500} asal={ASAL_DESA}>
          <div className="absolute -inset-[60%] bg-[linear-gradient(#b4c6da,#dcd8cd_44%,#f4d8b4_50%,#f2e3c9_57%,#eee5d3)]" />
          <motion.div
            className="absolute top-[30%] left-[30%] aspect-square w-[40%] rounded-full bg-[radial-gradient(closest-side,#fffaf0,#fbe5bb_40%,rgb(251_229_187/0.35)_64%,transparent)]"
            initial={{ transform: "translateY(40px)" }}
            animate={buka ? { transform: "translateY(-16px)" } : undefined}
            transition={{ duration: 11, delay: 0.5, ease: "easeOut" }}
          />
        </Lapis>

        {/* pegunungan & Tangkuban Perahu */}
        <Lapis z={-1100} asal={ASAL_DESA}>
          <MegaMendung className={`${s.awan} absolute top-[6%] left-[2%] w-[30%] opacity-80`} />
          <MegaMendung className={`${s.awan} absolute top-[14%] right-[4%] w-[24%] opacity-70`} style={{ animationDelay: "-7s" }} />
          <Gunung className="absolute top-[29%] -left-[14%] w-[128%]" />
          <div className="absolute inset-x-[-40%] top-[41.5%] h-[5%] bg-[radial-gradient(50%_50%_at_50%_50%,rgb(244_236_222/0.9),transparent_72%)]" />
        </Lapis>

        {/* sawah berundak jauh & kabut */}
        <Lapis z={-760} asal={ASAL_DESA}>
          {/* tanah sawah hijau pupus di bawah cetakan tinta */}
          <div className="absolute -inset-x-[60%] top-[43%] -bottom-[60%] bg-[linear-gradient(rgb(201_207_178/0),#c6ccad_6%,#b3bf98_40%,#a3b28a)]" />
          <div className="absolute top-[27%] -left-[45%] w-[190%] opacity-70 [mask-image:linear-gradient(transparent_14%,black_30%)]">
            <Sawah />
          </div>
          <div className="absolute inset-x-[-40%] top-[43%] h-[9%] bg-[radial-gradient(50%_50%_at_50%_50%,rgb(244_236_222/0.9),transparent_72%)]" />
        </Lapis>

        {/* sawah tengah, saung & kawanan kuntul */}
        <Lapis z={-420} asal={ASAL_DESA}>
          <div className="absolute top-[35%] -left-[40%] w-[180%] opacity-85">
            <Sawah balik />
          </div>
          <Saung className="absolute top-[49%] left-[12%] w-[15%]" />
          <Kawanan buka={buka} />
        </Lapis>

        {/* sawah dekat & rumpun di pematang */}
        <Lapis z={150} asal={ASAL_DESA}>
          <div className="absolute top-[48%] -left-[55%] w-[210%]">
            <Sawah />
          </div>
          <Gambar a="hanjuang" className="bottom-[20%] -left-[6%] w-[30%] -rotate-6" sizes="130px" />
          <Gambar a="bambu" className="-right-[10%] bottom-[16%] w-[40%]" sizes="170px" balik />
        </Lapis>

        {/* rumpun bambu di kiri-kanan jalan, terlewati kamera */}
        <LapisLewat z={420} asal={ASAL_DESA} hilang={9.6} buka={buka}>
          <Gambar a="bambu" className="-bottom-[8%] -left-[46%] w-[78%]" sizes="320px" />
          <Gambar a="bambu" className="-right-[48%] -bottom-[4%] w-[74%]" sizes="300px" balik />
          <Gambar a="telang" className="-bottom-[6%] left-[2%] w-[34%] rotate-12" sizes="150px" />
        </LapisLewat>
      </motion.div>
    </motion.div>
  );
}

// Kamera di Bandung: muncul dari balik awan dekat sekali dengan langit & puncak Gedung Sate, lalu mundur pelan
// sampai diam (semua lapisan berukuran asli)
const KAMERA_KOTA = jalur([
  [0, "translateZ(620px) rotateX(-8deg) rotateY(6deg)"],
  [T_SIBAK, "translateZ(620px) rotateX(-8deg) rotateY(6deg)"],
  [T_DIAM, "translateZ(0px) rotateX(0deg) rotateY(0deg)", [0.25, 0.1, 0.2, 1]],
]);

// tampak: selama masih tertutup rumah & Priangan, Bandung tidak digambar sama sekali (lebih ringan)
// datar: sesudah kamera diam, pemandangan diratakan jadi 2D (tampilannya sama persis) supaya efek scroll di tiap
// lapisannya dijalankan browser sebagai lapisan biasa, tanpa ruang 3D yang membuat Safari berkedip.
function Bandung({ buka, mekar, tampak, datar }: { buka: boolean; mekar: number; tampak: boolean; datar: boolean }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${datar ? "" : "[perspective:1000px]"} ${tampak ? "" : "invisible"}`}>
      <motion.div
        className={`absolute inset-0 ${datar ? "" : "[transform-style:preserve-3d]"}`}
        initial={{ transform: KAMERA_KOTA.nilai[0] }}
        animate={buka ? { transform: KAMERA_KOTA.nilai } : undefined}
        transition={KAMERA_KOTA.transition}
      >
        {/* langit pagi, awan mega mendung & kuntul */}
        <Lapis z={-900} datar={datar}>
          <div className={`${s.keluarLangit} absolute inset-0`}>
            <div className="absolute -inset-[45%] bg-[linear-gradient(#bfd1e3,#dfe2df_36%,#f2e6d1_54%,#f4eee2_68%)]" />
            <div className="absolute top-[6%] right-[2%] aspect-square w-[44%] rounded-full bg-[radial-gradient(closest-side,rgb(255_250_238/0.95),rgb(253_238_206/0.5)_50%,transparent)]" />
            <MegaMendung className={`${s.awan} absolute top-[22%] -left-[12%] w-[30%]`} />
            <MegaMendung className={`${s.awan} absolute top-[27%] -right-[12%] w-[27%]`} style={{ animationDelay: "-6s", animationDuration: "19s" }} />
            <Kuntul className="top-[14%] left-0" delay={-8} />
            <Kuntul className="top-[18%] left-0" delay={-11} size={20} />
          </div>
        </Lapis>
        {/* gunung & sawah di kejauhan */}
        <Lapis z={-600} datar={datar}>
          <div className={`${s.keluarJauh} absolute inset-0`}>
            <Gunung className="absolute top-[50%] -left-[20%] w-[140%] opacity-30 [mask-image:linear-gradient(black_50%,transparent)]" />
          </div>
        </Lapis>
        {/* pohon kelapa kampung di kiri-kanan */}
        <Lapis z={-260} datar={datar}>
          <div className={`${s.keluarDesa} absolute inset-0`}>
            <div className="absolute bottom-[14%] -left-[24%] w-[66%] opacity-25 [mask-image:linear-gradient(transparent,black_30%,black_55%,transparent)]">
              <Image src={ASET.desa.src} alt="" width={ASET.desa.w} height={ASET.desa.h} sizes="290px" className="h-auto w-full" />
            </div>
            <div className="absolute -right-[24%] bottom-[16%] w-[62%] opacity-25 [mask-image:linear-gradient(transparent,black_30%,black_55%,transparent)]">
              <Image src={ASET.desa.src} alt="" width={ASET.desa.w} height={ASET.desa.h} sizes="270px" className="h-auto w-full -scale-x-100" />
            </div>
          </div>
        </Lapis>
        {/* Gedung Sate; lebarnya mengikuti tinggi layar supaya di HP pendek menaranya tidak menimpa foto */}
        <div className={`${s.keluarGedung} absolute inset-0`}>
          <div className="absolute inset-x-0 bottom-[var(--demo-h,0px)] flex justify-center">
            <div className="relative w-[min(112%,50svh)] shrink-0">
              <GedungSate preload />
            </div>
          </div>
        </div>
        {/* rumpun bunga di kaki gedung, paling dekat */}
        <Lapis z={140} datar={datar}>
          <div className={`${s.keluarBunga} absolute inset-0`}>
            <div className="absolute inset-x-0 bottom-[var(--demo-h,0px)]">
              <Rumpun items={RUMPUN_GEDUNG} tampil={buka} jeda={mekar} className="inset-x-0 -bottom-2 aspect-[1/0.55]" />
            </div>
          </div>
        </Lapis>
      </motion.div>
    </div>
  );
}

/* ───────── Awan mega mendung yang menutup lalu tersibak ───────── */

// [kiri %, atas %, lebar %, arah tersibak]
const AWAN_SIBAK: [number, number, number, number][] = [
  [-36, -8, 122, -1],
  [36, -2, 112, 1],
  [-26, 13, 128, -1],
  [30, 23, 120, 1],
  [-40, 35, 136, -1],
  [22, 45, 128, 1],
  [-28, 57, 124, -1],
  [32, 67, 120, 1],
  [-20, 79, 130, -1],
  [26, 89, 118, 1],
];

function AwanSibak({ buka }: { buka: boolean }) {
  const d = T_SIBAK + 2.2 - T_AWAN;
  const tm = (t: number) => (t - T_AWAN) / d;
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-clip" aria-hidden="true">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(closest-side,#f8f4ec,#e6ebf1)]"
        initial={{ opacity: 0 }}
        animate={buka ? { opacity: [0, 0, 1, 1, 0] } : undefined}
        transition={{ duration: d, delay: T_AWAN, times: [0, tm(11.5), tm(T_TUTUP), tm(T_SIBAK + 0.1), tm(T_SIBAK + 1.3)] }}
      />
      {AWAN_SIBAK.map(([x, y, w, arah], i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${x}%`, top: `${y}%`, width: `${w}%` }}
          initial={{ opacity: 0, transform: `translate(${arah * 70}%, 70%) scale(0.6)` }}
          animate={
            buka
              ? {
                  opacity: [0, 1, 1, 0],
                  transform: [`translate(${arah * 70}%, 70%) scale(0.6)`, "translate(0%, 0%) scale(1)", "translate(0%, 0%) scale(1.05)", `translate(${arah * 100}%, -14%) scale(1.8)`],
                }
              : undefined
          }
          transition={{
            duration: d,
            delay: T_AWAN + (i % 3) * 0.08,
            times: [0, tm(T_TUTUP), tm(T_SIBAK), 1],
            ease: [[0.2, 0.6, 0.35, 1], "linear", [0.55, 0, 0.75, 0.45]],
            opacity: { duration: d, delay: T_AWAN + (i % 3) * 0.08, times: [0, tm(T_AWAN + 0.6), tm(T_SIBAK + 1), 1] },
          }}
        >
          <MegaMendung className="w-full" />
        </motion.div>
      ))}
    </div>
  );
}

/* ───────── Rumah panggung ───────── */

// Lubang pintu di dinding bilik: dinding selebar 100vmax di tiap sisi dipotong masker seukuran kotak pintu
const LUBANG_PINTU: CSSProperties = {
  maskImage: "linear-gradient(#000, #000), linear-gradient(#000, #000)",
  WebkitMaskImage: "linear-gradient(#000, #000), linear-gradient(#000, #000)",
  maskSize: "100% 100%, calc(100% - 200vmax) calc(100% - 200vmax)",
  WebkitMaskSize: "100% 100%, calc(100% - 200vmax) calc(100% - 200vmax)",
  maskPosition: "0 0, 100vmax 100vmax",
  WebkitMaskPosition: "0 0, 100vmax 100vmax",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskComposite: "exclude",
  WebkitMaskComposite: "xor",
};

function Imah({ buka }: { buka: boolean }) {
  // rumah: berputar menghadap pintu, diam, lalu membesar melewati layar (kamera melangkah keluar) & memudar
  const imah = jalur(
    [
      [0, "rotateY(-9deg) scale(1.06)"],
      [T_HADAP, "rotateY(-9deg) scale(1.06)"],
      [T_HADAP + 2.6, "rotateY(0deg) scale(1)"],
      [T_MASUK, "rotateY(0deg) scale(1)"],
      [T_MASUK + 2.2, "rotateY(0deg) scale(6)"],
    ],
    [0.5, 0, 0.3, 1],
  );
  const pudar = { duration: T_MASUK + 2.2, times: [0, (T_MASUK + 0.9) / (T_MASUK + 2.2), 1] };

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-clip [perspective:900px]" aria-hidden="true">
      <motion.div
        className="absolute inset-0 flex flex-col items-center"
        style={{ transformOrigin: "50% 37%" }}
        initial={{ opacity: 1, transform: imah.nilai[0] }}
        animate={buka ? { opacity: [1, 1, 0], transform: imah.nilai } : undefined}
        transition={{ ...imah.transition, opacity: pudar }}
      >
        <div className="h-[16%] min-h-[6.5rem] shrink-0" />

        <div className="relative w-[58%] max-w-[15.5rem] shrink-0">
          <div className="relative aspect-[300/470] [perspective:700px]">
            {/* dinding bilik di sekeliling lubang pintu */}
            <div className={`${s.bilik} absolute -inset-[100vmax]`} style={LUBANG_PINTU} />
            {/* sinar pagi yang merembes dari celah pintu, lalu menyembur saat terbuka */}
            <motion.div
              className="absolute inset-y-[3%] left-1/2 w-[5px] -translate-x-1/2 rounded-full bg-[#fffaf0] shadow-[0_0_22px_9px_rgb(255_244_214/0.9)]"
              initial={{ opacity: 0 }}
              animate={buka ? { opacity: [0, 1, 1, 0] } : undefined}
              transition={{ duration: T_BUKA + 0.5 - T_CAHAYA, times: [0, 0.45, 0.8, 1], delay: T_CAHAYA }}
            />
            {[true, false].map((kiri) => (
              <DaunPintu key={String(kiri)} kiri={kiri} buka={buka} />
            ))}
            <motion.div
              className="absolute -inset-[35%] bg-[radial-gradient(closest-side,rgb(255_251_238),rgb(255_244_214/0.7)_45%,transparent)]"
              initial={{ opacity: 0 }}
              animate={buka ? { opacity: [0, 0.95, 0] } : undefined}
              transition={{ duration: 1.9, times: [0, 0.25, 1], ease: "easeOut", delay: T_BUKA + 0.2 }}
            />
            <Kusen />
          </div>
          <Ukiran className="absolute bottom-[calc(100%+0.6rem)] left-[-14%] w-[128%]" />
        </div>

        <Lantai buka={buka} />

        {/* tiang kayu di kiri-kanan & langit-langit */}
        <div className="absolute inset-y-0 left-0 w-[5%] bg-[linear-gradient(90deg,#3a2314,#6b4428_60%,#4a2e1f)]" />
        <div className="absolute inset-y-0 right-0 w-[5%] bg-[linear-gradient(90deg,#4a2e1f,#6b4428_40%,#3a2314)]" />
        <div className="absolute inset-x-0 top-0 h-[7%] border-b-[7px] border-[#2e1b0f] bg-[repeating-linear-gradient(90deg,#4f3220_0_22px,#3b2416_22px_24px)] shadow-[0_8px_14px_rgb(30_18_10/0.5)]" />

        {/* bayangan di sudut-sudut ruangan */}
        <div className="absolute inset-0 bg-[radial-gradient(80%_62%_at_50%_40%,transparent_42%,rgb(45_26_14/0.55))]" />

        <Lampu />
        <Dudukuy className="absolute top-[27%] left-[6%] w-[24%]" />
        <Kendi className="absolute top-[52.5%] left-[6%] w-[17%]" />
        <Angklung className="absolute top-[42%] right-[6%] w-[19%]" />
      </motion.div>
    </div>
  );
}

// Daun pintu nila bermotif mega mendung dengan kujang di tepi temunya, berengsel di tepi luar; berayun masuk ke rumah
function DaunPintu({ kiri, buka }: { kiri: boolean; buka: boolean }) {
  return (
    <motion.div
      className={`${s.nila} absolute inset-y-0 w-1/2 overflow-clip border-[3px] border-[#3a2314] ${kiri ? "left-0" : "right-0"}`}
      style={{ transformOrigin: kiri ? "0% 50%" : "100% 50%", backfaceVisibility: "visible" }}
      initial={{ transform: "rotateY(0deg)" }}
      animate={
        buka
          ? {
              transform: ["rotateY(0deg)", `rotateY(${kiri ? -9 : 9}deg)`, `rotateY(${kiri ? -116 : 116}deg)`, `rotateY(${kiri ? -102 : 102}deg)`],
            }
          : undefined
      }
      transition={{
        duration: 2.2,
        times: [0, 0.18, 0.72, 1],
        ease: [
          [0.4, 0, 0.6, 1],
          [0.3, 0, 0.2, 1],
          [0.4, 0, 0.4, 1],
        ],
        delay: T_BUKA,
      }}
    >
      <MegaMendung warna="emas" className={`absolute top-[8%] w-[96%] opacity-45 ${kiri ? "-left-[34%]" : "-right-[34%]"}`} />
      <MegaMendung warna="emas" className={`absolute bottom-[9%] w-[86%] opacity-40 ${kiri ? "-left-[24%]" : "-right-[24%]"}`} />
      {/* panel berbingkai emas */}
      <span className={`absolute inset-x-[11%] top-[4%] h-[42%] border border-[#d9bd85]/75 ${kiri ? "rounded-tl-[60%_30%]" : "rounded-tr-[60%_30%]"}`} />
      <span className="absolute inset-x-[11%] bottom-[4%] h-[46%] border border-[#d9bd85]/75" />
      {/* kujang di tepi temu, berkilau sebelum pintu dibuka */}
      <div className={`absolute top-1/2 h-[44%] -translate-y-1/2 ${kiri ? "right-[9%]" : "left-[9%]"}`}>
        <motion.div
          className="absolute -inset-[45%] rounded-full bg-[radial-gradient(closest-side,rgb(255_232_170/0.95),transparent)]"
          initial={{ opacity: 0 }}
          animate={buka ? { opacity: [0, 1, 0.35] } : undefined}
          transition={{ duration: 1.4, times: [0, 0.4, 1], delay: T_KUJANG }}
        />
        <Kujang className={`relative h-full w-auto drop-shadow-[0_6px_8px_rgb(0_0_0/0.45)] ${kiri ? "-scale-x-100" : ""}`} />
      </div>
      <span className={`absolute inset-y-0 w-[2px] bg-[#d9bd85]/85 ${kiri ? "right-0" : "left-0"}`} />
      <span className={`absolute top-[60%] size-3 rounded-full border-2 border-[#d9bd85] ${kiri ? "right-[4%]" : "left-[4%]"}`} />
    </motion.div>
  );
}

// Kusen kayu jati di sekeliling pintu dengan ambang (bangbarung) di kakinya
function Kusen() {
  return (
    <svg viewBox="0 0 300 470" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <path d="M-11 470V-11H311V470" fill="none" stroke="#4f3220" strokeWidth="22" style={{ filter: "drop-shadow(0 6px 8px rgb(30 18 10 / 0.45))" }} />
      <path d="M-20 470V-20H320V470" fill="none" stroke="#7d5232" strokeWidth="2" />
      <path d="M-1 470V-1H301V470" fill="none" stroke="#a4703f" strokeWidth="1.6" opacity=".8" />
      <rect x="-34" y="462" width="368" height="15" rx="2" fill="#3f2718" />
      <path d="M-34 463.5H334" stroke="#8a5a36" strokeWidth="1.6" />
    </svg>
  );
}

// Panel ukiran di atas pintu (lubang angin): sulur di kiri-kanan dan bunga kawung di tengah
function Ukiran({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 380 86" className={`${className} drop-shadow-[0_5px_6px_rgb(30_18_10/0.4)]`} aria-hidden="true">
      <rect width="380" height="86" rx="3" fill="#5b3a22" />
      <rect x="7" y="7" width="366" height="72" rx="2" fill="#2e1b0f" />
      <g fill="none" stroke="#b3804c" strokeWidth="4.5" strokeLinecap="round">
        {[false, true].map((cermin) => (
          <g key={String(cermin)} transform={cermin ? "translate(380 0) scale(-1 1)" : undefined}>
            <path d="M22 66C20 38 48 18 76 26C100 33 98 62 78 62C64 62 62 46 74 44" />
            <path d="M92 70C108 48 136 40 156 52" />
            <path d="M112 22C128 14 148 18 152 32" />
            <path d="M40 22C34 26 30 32 30 38" />
          </g>
        ))}
      </g>
      <g transform="translate(190 43)" fill="#c9a45c" stroke="#7a5a2c" strokeWidth="1.2">
        {[0, 90, 180, 270].map((r) => (
          <ellipse key={r} cx="0" cy="-15" rx="9" ry="13" transform={`rotate(${r + 45})`} />
        ))}
        <circle r="5" fill="#8a4b35" />
      </g>
    </svg>
  );
}

// Lantai palupuh (bilah bambu) yang menjauh ke arah pintu, dengan tikar pandan bergaris & cahaya pagi dari pintu
function Lantai({ buka }: { buka: boolean }) {
  return (
    <div className="relative -mt-px w-full flex-1 overflow-clip bg-[#7a5634]">
      <div className="absolute inset-x-[-60%] top-0 h-[90%] origin-top bg-[repeating-linear-gradient(90deg,#caa673_0_15px,#9c784a_15px_16.5px,#d6b582_16.5px_31px,#a8834f_31px_32px)] [transform:perspective(380px)_rotateX(62deg)]">
        <div className="absolute top-[3%] left-1/2 h-[58%] w-[17%] -translate-x-1/2 bg-[repeating-linear-gradient(90deg,#ecdcb8_0_9px,#8a4b35_9px_12px,#ecdcb8_12px_19px,#2f4560_19px_21px)] shadow-[0_0_0_3px_#8a4b35]" />
        <motion.div
          className="absolute top-0 left-1/2 h-[80%] w-[20%] -translate-x-1/2 bg-[linear-gradient(rgb(255_242_208/0.85),transparent)]"
          initial={{ opacity: 0 }}
          animate={buka ? { opacity: 1 } : undefined}
          transition={{ duration: 1.4, delay: T_BUKA + 0.4 }}
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgb(40_24_12/0.5),transparent_28%,transparent_60%,rgb(40_24_12/0.5))]" />
    </div>
  );
}

// Lampu gantung (cempor) yang berayun pelan dari langit-langit
function Lampu() {
  return (
    <div className={`${s.ayun} absolute top-[7%] right-[13%] w-[9%]`}>
      <div
        className={`${s.nyala} absolute top-[46%] left-1/2 aspect-square w-[260%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_214_140/0.75),rgb(255_200_120/0.25)_50%,transparent)]`}
      />
      <svg viewBox="0 0 40 92" className="relative w-full" aria-hidden="true">
        <path d="M20 0V30" stroke="#2e1b0f" strokeWidth="1.6" />
        <path d="M8 38L20 28L32 38Z" fill="#b8934f" stroke="#6e5326" strokeWidth="1.2" />
        <rect x="13" y="38" width="14" height="26" rx="6" fill="#fff3d2" fillOpacity=".75" stroke="#c9a45c" strokeWidth="1" />
        <path d="M20 44C23 49 23 54 20 57C17 54 17 49 20 44Z" fill="#ffb84a" />
        <path d="M7 64H33L30 74H10Z" fill="#b8934f" stroke="#6e5326" strokeWidth="1.2" />
        <path d="M14 74L20 92L26 74" fill="#8a6a33" />
      </svg>
    </div>
  );
}

// Dudukuy (caping anyaman bambu) tergantung di paku dinding
function Dudukuy({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 -24 120 90" className={`${className} drop-shadow-[0_8px_6px_rgb(40_24_12/0.4)]`} aria-hidden="true">
      <path d="M60 6L48 -18H72Z" fill="none" stroke="#5a3f22" strokeWidth="1.2" />
      <circle cx="60" cy="-19" r="2.4" fill="#3a2314" />
      <path d="M60 4L117 50Q60 66 3 50Z" fill="#dcbc7c" stroke="#8c6a35" strokeWidth="1.6" strokeLinejoin="round" />
      <g stroke="#a9874e" strokeWidth="1" fill="none">
        {[10, 24, 38, 52, 68, 82, 96, 110].map((x) => (
          <path key={x} d={`M60 5L${x} ${52 + Math.sin(((x - 3) / 114) * Math.PI) * 5}`} />
        ))}
        <path d="M30 28Q60 36 90 28M17 39Q60 50 103 39" />
      </g>
      <path d="M3 50Q60 66 117 50" fill="none" stroke="#7a5a2c" strokeWidth="3" />
      <circle cx="60" cy="5" r="3.2" fill="#8c6a35" />
    </svg>
  );
}

// Kendi tanah liat berisi setangkai melati, di atas dingklik kayu
function Kendi({ className = "" }: { className?: string }) {
  const m = ASET.melati2;
  return (
    <div className={className}>
      <Image src={m.src} alt="" width={m.w} height={m.h} sizes="60px" className="relative left-[18%] -mb-[34%] h-auto w-[64%] -rotate-6" />
      <svg viewBox="0 0 60 92" className="relative w-full drop-shadow-[0_8px_6px_rgb(40_24_12/0.45)]" aria-hidden="true">
        <path d="M24 6H36V14C47 17 55 26 55 39C55 53 44 63 30 63S5 53 5 39C5 26 13 17 24 14Z" fill="#a85a3a" stroke="#6e3420" strokeWidth="1.4" />
        <path d="M47 30L58 22L59.5 26L51 35Z" fill="#a85a3a" stroke="#6e3420" strokeWidth="1.2" />
        <path d="M8 37H52M10 44H50" stroke="#e7c49a" strokeWidth="1.3" />
        <path d="M14 22C18 18 24 16 30 16" stroke="#d58a63" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M2 64H58V70H2Z" fill="#6b4428" />
        <path d="M8 70V90M52 70V90" stroke="#4f3220" strokeWidth="4" />
      </svg>
    </div>
  );
}

// Angklung bersandar di dinding: rangka bambu dengan dua tabung bernada
function Angklung({ className = "" }: { className?: string }) {
  const id = "sd-angklung";
  return (
    <svg viewBox="0 0 90 170" className={`${className} drop-shadow-[0_10px_8px_rgb(40_24_12/0.45)]`} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" x2="1">
          <stop offset="0" stopColor="#b48a43" />
          <stop offset=".45" stopColor="#ecd08e" />
          <stop offset="1" stopColor="#a8803d" />
        </linearGradient>
      </defs>
      {/* rangka */}
      <path d="M10 14V160M80 14V160" stroke="#9c7333" strokeWidth="6" strokeLinecap="round" />
      <path d="M8 40H82M8 126H82" stroke="#9c7333" strokeWidth="5" strokeLinecap="round" />
      <rect x="4" y="152" width="82" height="12" rx="3" fill={`url(#${id})`} stroke="#7a5626" strokeWidth="1.2" />
      {/* tabung besar & kecil: badan bawah dan lidah di atasnya */}
      <path d="M22 18H40V60H44V150H18V60H22Z" fill={`url(#${id})`} stroke="#7a5626" strokeWidth="1.2" />
      <path d="M52 48H66V82H70V150H48V82H52Z" fill={`url(#${id})`} stroke="#7a5626" strokeWidth="1.2" />
      <path d="M18 108H44M48 122H70" stroke="#8a6531" strokeWidth="2" />
      <path d="M25 22V56M55 52V78" stroke="#fff3c9" strokeWidth="1.4" opacity=".7" />
    </svg>
  );
}

/* ───────── Foto mempelai bersiger ───────── */

// Ronce melati: untaian kuncup melati yang terjuntai dari siger di sisi lengkung (kurva Bézier dalam koordinat bingkai
// 300 × 410). Titik-titik kuncupnya dihitung sekali dari kurva yang sama.
const RONCE = "M118 -4C44 4 -18 110 -9 282";
const kubik = (a: number, b: number, c: number, d: number, t: number) => (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t ** 2 * c + t ** 3 * d;
const KUNCUP = Array.from({ length: 13 }, (_, i) => {
  const t = (i + 1) / 13.4;
  // dibulatkan: hasil hitungan desimal panjang bisa beda tipis di server & browser (hydration mismatch)
  return [Math.round(kubik(118, 44, -18, -9, t) * 100) / 100, Math.round(kubik(-4, 4, 110, 282, t) * 100) / 100] as const;
});

function Kuncup({ x, y, r = 1, mulai }: { x: number; y: number; r?: number; mulai: number | false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${r})`}>
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
        initial={{ scale: 0, rotate: -40 }}
        animate={mulai !== false ? { scale: 1, rotate: 0 } : undefined}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: mulai || 0 }}
      >
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="0" cy="-3.6" rx="2.6" ry="3.8" fill="#fffdf6" stroke="#d8cfbd" strokeWidth=".5" transform={`rotate(${a})`} />
        ))}
        <circle r="1.6" fill="#efe2b8" />
      </motion.g>
    </g>
  );
}

function FotoSiger({ src, alt, mulai }: { src: string; alt: string; mulai: number | false }) {
  const jalan = mulai !== false;
  const t = mulai || 0;
  const tepi = { borderRadius: "50% 50% 14px 14px / 36.6% 36.6% 14px 14px" };
  const dalam = { inset: "3.3% 4.5%", borderRadius: "50% 50% 9px 9px / 35.6% 35.6% 9px 9px" };
  return (
    <div className="relative aspect-[300/410] w-full">
      {/* cahaya lembut di belakang bingkai */}
      <motion.div
        className="absolute -inset-[24%] rounded-full bg-[radial-gradient(closest-side,rgb(255_249_234/0.95),rgb(255_244_222/0.5)_55%,transparent)]"
        initial={{ opacity: 0, transform: "scale(0.5)" }}
        animate={jalan ? { opacity: 1, transform: "scale(1)" } : undefined}
        transition={{ duration: 1.8, ease, delay: t }}
      />

      {/* kujang pengapit: terbang berputar dari luar layar */}
      {[true, false].map((kiri) => (
        <motion.div
          key={String(kiri)}
          className={`absolute top-[24%] h-[54%] ${kiri ? "-left-[31%]" : "-right-[31%]"}`}
          initial={{ opacity: 0, transform: `translateX(${kiri ? -150 : 150}px) rotate(${kiri ? -250 : 250}deg) scale(0.4)` }}
          animate={
            jalan
              ? {
                  opacity: 1,
                  transform: `translateX(0px) rotate(${kiri ? -7 : 7}deg) scale(1)`,
                }
              : undefined
          }
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: t + (kiri ? 0 : 0.12), opacity: { duration: 0.4, delay: t + (kiri ? 0 : 0.12) } }}
        >
          <div className={`${s.melayang} h-full`} style={{ animationDelay: kiri ? "0s" : "-2.5s" }}>
            <Kujang className={`h-full w-auto drop-shadow-[0_8px_8px_rgb(47_69_96/0.35)] ${kiri ? "" : "-scale-x-100"}`} />
          </div>
        </motion.div>
      ))}

      {/* lempeng krem bingkai */}
      <motion.div
        className="absolute inset-0 bg-[#fbf7ef] shadow-[0_22px_40px_-18px_rgb(47_69_96/0.75)]"
        style={tepi}
        initial={{ opacity: 0 }}
        animate={jalan ? { opacity: 1 } : undefined}
        transition={{ duration: 0.8, delay: t + 1 }}
      />

      {/* potret di balik tirai mega mendung yang tersibak */}
      <div className="absolute overflow-clip" style={dalam}>
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, transform: "scale(1.18)" }}
          animate={jalan ? { opacity: 1, transform: "scale(1)" } : undefined}
          transition={{ opacity: { duration: 0.3, delay: t + 1.1 }, transform: { duration: 3.4, ease, delay: t + 1.7 } }}
        >
          <Image src={src} alt={alt} fill preload sizes="(min-width: 440px) 210px, 50vw" className="object-cover object-[50%_28%]" />
        </motion.div>
        {[true, false].map((kiri) => (
          <motion.div
            key={String(kiri)}
            className={`${s.nila} absolute inset-y-0 w-1/2 overflow-clip ${kiri ? "left-0" : "right-0"}`}
            initial={{ opacity: 0, transform: "translateX(0%)" }}
            animate={jalan ? { opacity: 1, transform: `translateX(${kiri ? -102 : 102}%)` } : undefined}
            transition={{ opacity: { duration: 0.4, delay: t + 1 }, transform: { duration: 1.5, ease: [0.65, 0, 0.35, 1], delay: t + 1.8 } }}
          >
            <MegaMendung warna="emas" className={`absolute top-[18%] w-[120%] opacity-60 ${kiri ? "-left-[40%]" : "-right-[40%]"}`} />
            <MegaMendung warna="emas" className={`absolute bottom-[14%] w-[100%] opacity-50 ${kiri ? "-left-[10%]" : "-right-[10%]"}`} />
            <span className={`absolute inset-y-0 w-px bg-[#d9bd85] ${kiri ? "right-0" : "left-0"}`} />
          </motion.div>
        ))}
        {/* kilau yang menyapu potret */}
        <motion.div
          className="pointer-events-none absolute inset-y-0 left-0 w-[70%] bg-[linear-gradient(100deg,transparent_20%,rgb(255_247_222/0.6)_50%,transparent_80%)]"
          initial={{ opacity: 0, transform: "translateX(-110%)" }}
          animate={jalan ? { opacity: [0, 1, 0], transform: "translateX(160%)" } : undefined}
          transition={{ duration: 1.3, ease: "easeInOut", delay: t + 4.7 }}
        />
      </div>

      {/* garis bingkai emas & bata yang tergambar dari kaki ke puncak lengkung */}
      <svg viewBox="0 0 300 410" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        {[
          ["M150 407H17A14 14 0 0 1 3 393V150A147 147 0 0 1 150 3", "#c9a45c", 3, 0.5],
          ["M150 407H283A14 14 0 0 0 297 393V150A147 147 0 0 0 150 3", "#c9a45c", 3, 0.5],
          ["M150 400H20A12 12 0 0 1 8 388V150A142 142 0 0 1 150 8", "#8a4b35", 1.3, 0.8],
          ["M150 400H280A12 12 0 0 0 292 388V150A142 142 0 0 0 150 8", "#8a4b35", 1.3, 0.8],
        ].map(([d, warna, tebal, j]) => (
          <motion.path
            key={d as string}
            d={d as string}
            fill="none"
            stroke={warna as string}
            strokeWidth={tebal as number}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={jalan ? { pathLength: 1, opacity: 1 } : undefined}
            transition={{ pathLength: { duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: t + (j as number) }, opacity: { duration: 0.2, delay: t + (j as number) } }}
          />
        ))}

        {/* ronce melati di kedua sisi */}
        {[false, true].map((cermin) => (
          <g key={String(cermin)} transform={cermin ? "translate(300 0) scale(-1 1)" : undefined}>
            {[
              ["#ddd3bd", 7],
              ["#fffdf6", 4.2],
            ].map(([warna, tebal]) => (
              <motion.path
                key={warna}
                d={RONCE}
                fill="none"
                stroke={warna as string}
                strokeWidth={tebal as number}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={jalan ? { pathLength: 1, opacity: 1 } : undefined}
                transition={{ pathLength: { duration: 1.5, ease: [0.45, 0, 0.3, 1], delay: t + 3.3 }, opacity: { duration: 0.2, delay: t + 3.3 } }}
              />
            ))}
            {KUNCUP.map(([x, y], i) => (
              <Kuncup key={i} x={x} y={y} mulai={jalan ? t + 3.4 + i * 0.1 : false} />
            ))}
            {/* rumbai di ujung untaian */}
            {[
              [-18, 300, 0.9],
              [-9, 308, 1],
              [0, 300, 0.9],
            ].map(([x, y, r], i) => (
              <g key={i}>
                <motion.path
                  d={`M-9 282L${x} ${y}`}
                  stroke="#ddd3bd"
                  strokeWidth="1.4"
                  initial={{ opacity: 0 }}
                  animate={jalan ? { opacity: 1 } : undefined}
                  transition={{ duration: 0.3, delay: t + 4.7 }}
                />
                <Kuncup x={x} y={y} r={r} mulai={jalan ? t + 4.8 + i * 0.08 : false} />
              </g>
            ))}
          </g>
        ))}
      </svg>

      {/* siger turun di puncak lengkung */}
      <motion.div
        className="absolute -top-[11%] left-[25%] w-[50%]"
        initial={{ opacity: 0, transform: "translateY(-70px) scale(0.5) rotate(-14deg)" }}
        animate={jalan ? { opacity: 1, transform: "translateY(0px) scale(1) rotate(0deg)" } : undefined}
        transition={{ duration: 1.3, ease: [0.34, 1.4, 0.64, 1], delay: t + 2.8, opacity: { duration: 0.4, delay: t + 2.8 } }}
      >
        <Siger className="w-full drop-shadow-[0_4px_6px_rgb(92_67_32/0.45)]" />
      </motion.div>

      {/* kilau emas berkelip di sekeliling bingkai */}
      {[
        [50, -14],
        [18, 4],
        [82, 8],
        [-6, 42],
        [106, 48],
        [50, 102],
      ].map(([x, y], i) => (
        <motion.svg
          key={i}
          viewBox="-6 -6 12 12"
          className="absolute size-3.5"
          style={{ left: `${x}%`, top: `${y}%` }}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={jalan ? { opacity: [0, 1, 0], scale: [0.3, 1.3, 0.3] } : undefined}
          transition={{ duration: 1.2, delay: t + 3.6 + i * 0.2 }}
          aria-hidden="true"
        >
          <path d="M0-6C.7-1.4 1.4-.7 6 0 1.4.7.7 1.4 0 6-.7 1.4-1.4.7-6 0-1.4-.7-.7-1.4 0-6Z" fill="#f3dfa6" />
        </motion.svg>
      ))}
    </div>
  );
}

/* ───────── Beranda ───────── */

export function Beranda({ u, buka }: { u: Undangan; buka: boolean }) {
  // bagian pembuka dilepas dari halaman sesudah lewat, supaya tidak membebani scroll
  const [lewat, setLewat] = useState({ imah: false, desa: false, awan: false, kota: false, diam: false });
  useEffect(() => {
    if (!buka) return;
    const ids = [
      setTimeout(() => setLewat((l) => ({ ...l, imah: true })), (T_MASUK + 2.6) * 1000),
      setTimeout(() => setLewat((l) => ({ ...l, kota: true })), (T_TUTUP - 0.3) * 1000),
      setTimeout(() => setLewat((l) => ({ ...l, desa: true })), (T_TUTUP + 1) * 1000),
      setTimeout(() => setLewat((l) => ({ ...l, awan: true })), (T_SIBAK + 2.6) * 1000),
      setTimeout(() => setLewat((l) => ({ ...l, diam: true })), (T_DIAM + 0.3) * 1000),
    ];
    return () => ids.forEach(clearTimeout);
  }, [buka]);
  // "kurangi gerakan": gerak transform dilewati motion, jadi perjalanannya langsung dilompati ke Bandung
  const kurangi = useReducedMotion();
  const lompat = kurangi && buka;
  const pada = (detik: number) => (kurangi ? 0 : detik);

  return (
    <section id="beranda" className="relative h-svh min-h-[44rem] overflow-clip bg-[#e9e3d6]">
      <Bandung buka={buka} mekar={pada(T_MEKAR)} tampak={lewat.kota || !!kurangi} datar={lewat.diam || !!lompat} />
      {!lewat.desa && !lompat && <Priangan buka={buka} />}

      {/* kuncup melati beterbangan selama perjalanan */}
      {!lewat.awan && !lompat && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={buka ? { opacity: [0, 1, 1, 0] } : undefined}
          transition={{ duration: T_AWAN + 1 - T_MASUK, times: [0, 0.15, 0.8, 1], delay: T_MASUK }}
        >
          <MelatiJatuh n={10} />
        </motion.div>
      )}

      {!lewat.awan && !lompat && <AwanSibak buka={buka} />}

      {/* nama di langit, muncul setelah kamera hampir diam */}
      <div className={`${s.keluarTeks} pointer-events-none absolute inset-0`}>
        <div className="absolute inset-x-0 top-[6%] flex flex-col items-center px-8 text-center">
          <motion.div
            className="absolute inset-x-[4%] -inset-y-6 rounded-[50%] bg-[radial-gradient(closest-side,rgb(246_241_231/0.9),rgb(246_241_231/0.5)_60%,transparent)]"
            initial={{ opacity: 0 }}
            animate={buka ? { opacity: 1 } : undefined}
            transition={{ duration: 1.4, delay: pada(T_TEKS - 0.2) }}
            aria-hidden="true"
          />
          {[
            <p key="a" className="text-[10px] tracking-[0.42em] text-[#2f4560] uppercase">
              The Wedding of
            </p>,
            <h1 key="b" className={`${rozha} mt-1 text-[2.55rem] leading-[1.1] text-[#8a4b35] [text-shadow:0_2px_12px_rgb(246_241_231/0.9)]`}>
              {u.wanita.panggilan} <span className="text-[#c9a45c]">&amp;</span> {u.pria.panggilan}
            </h1>,
            <p key="c" className="mt-2 text-[12px] tracking-[0.28em] text-[#2f4560] uppercase">
              {u.tanggal}
            </p>,
          ].map((el, i) => (
            <motion.div
              key={i}
              className="relative"
              initial={{ opacity: 0, transform: "translateY(18px)" }}
              animate={buka ? { opacity: 1, transform: "translateY(0px)" } : undefined}
              transition={{ duration: 1.3, ease, delay: pada(T_TEKS + i * 0.18) }}
            >
              {el}
            </motion.div>
          ))}
        </div>
      </div>

      {/* foto mempelai bersiger (urutan animasinya di FotoSiger) */}
      <div className={`${s.keluarFoto} pointer-events-none absolute inset-0`}>
        <div className="absolute inset-x-0 top-[max(26%,12.5rem)] flex justify-center">
          <div className="w-[50%] max-w-[13rem]">
            <FotoSiger src={u.foto.sampul} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} mulai={buka ? pada(T_FOTO) : false} />
          </div>
        </div>
      </div>

      {/* petunjuk gulir */}
      <motion.div
        className="absolute inset-x-0 bottom-[calc(5.5rem+var(--demo-h,0px))] flex justify-center"
        initial={{ opacity: 0 }}
        animate={buka ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: pada(T_SELESAI) }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className={`${s.petunjuk} size-6 text-[#fbf7ef] drop-shadow-[0_1px_3px_rgb(0_0_0/0.6)]`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </motion.div>

      {!lewat.imah && !lompat && <Imah buka={buka} />}
    </section>
  );
}
