"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { type CSSProperties, type ReactNode, useId } from "react";
import { tepiPudar } from "../../tepi";
import { ASET, BINGKAI, MASKER_BINGKAI, type NamaAset } from "./aset";
import s from "./delima.module.css";

// Ornamen tema Merah Delima: bingkai cermin bergelombang bertepi emas, foto lengkung, medali, segel lilin,
// kawanan burung, kelopak mawar jatuh, pembatas bermotif delima. Gerak masuk memakai `transform` utuh + opacity
// (dijalankan mesin animasi browser di GPU).

export const naskah = "font-[family-name:var(--font-allura)]"; // Allura
export const prata = "font-[family-name:var(--font-prata)]"; // Prata
export const HALUS = [0.22, 1, 0.36, 1] as const;

export const MARUN = "#4a1219";
export const ANGGUR = "#7b2431";
export const EMAS = "#c9a35c";

// Muncul saat terlihat: naik pelan (default), membesar, berputar, atau dari samping
export function Muncul({
  jeda = 0,
  durasi = 1.2,
  dari = "translateY(36px)",
  amount = 0.3,
  className,
  style,
  children,
}: {
  jeda?: number;
  durasi?: number;
  dari?: string;
  amount?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const akhir = dari.startsWith("scale") ? "scale(1)" : dari.startsWith("translateX") ? "translateX(0px)" : dari.startsWith("rotate") ? "rotate(0deg)" : "translateY(0px)";
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, transform: dari }}
      whileInView={{ opacity: 1, transform: akhir }}
      viewport={{ once: true, amount }}
      transition={{ duration: durasi, ease: HALUS, delay: jeda }}
    >
      {children}
    </motion.div>
  );
}

export function Gambar({ a, className = "", sizes = "200px", flip = false, preload }: { a: NamaAset; className?: string; sizes?: string; flip?: boolean; preload?: boolean }) {
  const g: (typeof ASET)[NamaAset] & { tepi?: string; pudar?: number } = ASET[a];
  return (
    <Image src={g.src} alt="" width={g.w} height={g.h} sizes={sizes} preload={preload} loading={preload ? "eager" : undefined} style={tepiPudar(g)} className={`h-auto w-full ${flip ? "-scale-x-100" : ""} ${className}`} />
  );
}

// Bunga yang bergoyang pelan dari pangkalnya
export function Bunga({
  a,
  className = "",
  sizes = "200px",
  flip,
  varian = "A",
  asal = "50% 100%",
}: {
  a: NamaAset;
  className?: string;
  sizes?: string;
  flip?: boolean;
  varian?: "A" | "B";
  asal?: string;
}) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <div className={varian === "A" ? s.ayunA : s.ayunB} style={{ transformOrigin: asal }}>
        <Gambar a={a} sizes={sizes} flip={flip} />
      </div>
    </div>
  );
}

// Merak putih bertengger; ekornya pudar ke bawah supaya tidak tampak terpotong
export function Merak({ className = "", sizes = "220px", flip }: { className?: string; sizes?: string; flip?: boolean }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <div className={`${s.napas} [mask-image:linear-gradient(to_bottom,black_62%,transparent_96%)]`}>
        <Gambar a="merak" sizes={sizes} flip={flip} />
      </div>
    </div>
  );
}

const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
// angka dibulatkan: hasil sin/cos bisa beda di digit terakhir antara server & browser (hydration mismatch)
const b2 = (n: number) => Math.round(n * 100) / 100;

// Kawanan burung kecil yang terbang bersama melintasi langit
export function Kawanan({ className = "", jeda = 0, warna = "#5a1520", n = 9 }: { className?: string; jeda?: number; warna?: string; n?: number }) {
  return (
    <div className={`${s.kawanan} pointer-events-none absolute w-[46%] ${className}`} style={{ animationDelay: `${jeda}s` }} aria-hidden="true">
      <div className="relative aspect-[3/1]">
        {Array.from({ length: n }, (_, i) => (
          <svg
            key={i}
            viewBox="0 0 20 8"
            className={`${s.kepak} absolute`}
            style={{ left: `${b2(rnd(i + 2) * 86)}%`, top: `${b2(rnd(i + 21) * 70)}%`, width: `${b2(8 + rnd(i + 5) * 8)}%`, animationDelay: `${b2(-rnd(i + 9) * 0.4)}s` }}
          >
            <path d="M0 6Q5 0 10 5 15 0 20 6" fill="none" stroke={warna} strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        ))}
      </div>
    </div>
  );
}

export function KelopakJatuh({ n = 7 }: { n?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <span
          key={i}
          className={`${s.kelopak} absolute top-0`}
          style={
            {
              left: `${(rnd(i + 3) * 92).toFixed(1)}%`,
              "--x": `${Math.round((rnd(i + 9) - 0.3) * 110)}px`,
              "--d": `${(14 + rnd(i + 11) * 10).toFixed(1)}s`,
              animationDelay: `${(-rnd(i + 13) * 22).toFixed(1)}s`,
            } as CSSProperties
          }
        >
          <svg viewBox="0 0 20 24" style={{ width: `${(9 + rnd(i + 7) * 8).toFixed(1)}px` }}>
            <path d="M10 1C16 4 19 11 17 17s-7 7-7 7-6-1-8-7S4 4 10 1Z" fill={i % 3 === 0 ? "#f3d6d3" : i % 3 === 1 ? "#b5404f" : "#7b2431"} />
          </svg>
        </span>
      ))}
    </div>
  );
}

/* ───────── Gradien emas ───────── */

export function DefsEmas({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#9a7638" />
        <stop offset=".35" stopColor="#eed9a4" />
        <stop offset=".6" stopColor="#ae8a46" />
        <stop offset=".82" stopColor="#f5e6ba" />
        <stop offset="1" stopColor="#9a7638" />
      </linearGradient>
    </defs>
  );
}

/* ───────── Bingkai cermin bergelombang ───────── */

// Mahkota ukir kecil di puncak & kaki bingkai: dua ikal emas dan setetes delima
function Mahkota({ y, balik, emas }: { y: number; balik?: boolean; emas: string }) {
  return (
    <g transform={`translate(150 ${y}) ${balik ? "scale(1 -1)" : ""}`}>
      <path d="M0 -4C-8 -16 -26 -18 -32 -8C-36 0 -28 6 -22 2C-17 -2 -21 -8 -25 -6" fill="none" stroke={emas} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M0 -4C8 -16 26 -18 32 -8C36 0 28 6 22 2C17 -2 21 -8 25 -6" fill="none" stroke={emas} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M0 -26C6 -18 7 -10 0 -4C-7 -10 -6 -18 0 -26Z" fill={ANGGUR} stroke={emas} strokeWidth="1.4" />
      <circle cy="-29" r="2.2" fill={emas} />
    </g>
  );
}

// Tepi bingkai bertingkat: pita marun, garis emas, renda krem. Kotak gambarnya lebih besar 30 satuan di tiap sisi.
export function TepiBingkai({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const id = useId().replace(/:/g, "");
  const emas = `url(#e${id})`;
  return (
    <svg viewBox="-30 -30 360 480" className={`pointer-events-none absolute overflow-visible ${className}`} style={style} aria-hidden="true">
      <DefsEmas id={`e${id}`} />
      <path d={BINGKAI} fill="none" stroke="#f7ece8" strokeWidth="34" strokeLinejoin="round" style={{ filter: "drop-shadow(0 10px 14px rgb(74 18 25 / 0.28))" }} />
      <path d={BINGKAI} fill="none" stroke={MARUN} strokeWidth="18" strokeLinejoin="round" />
      <path d={BINGKAI} fill="none" stroke={emas} strokeWidth="3.5" strokeLinejoin="round" />
      <path d={BINGKAI} fill="none" stroke="#f3dcd6" strokeWidth="1" strokeDasharray="2 5" strokeLinejoin="round" transform="translate(150 210) scale(1.06) translate(-150 -210)" />
      <path d={BINGKAI} fill="none" stroke={emas} strokeWidth="1.2" strokeLinejoin="round" transform="translate(150 210) scale(0.955) translate(-150 -210)" />
      <Mahkota y={-6} emas={emas} />
      <Mahkota y={426} balik emas={emas} />
      {[
        [10, 100],
        [290, 100],
        [10, 320],
        [290, 320],
      ].map(([x, y]) => (
        <g key={`${x}${y}`} transform={`translate(${x} ${y})`}>
          <circle r="7" fill={MARUN} stroke={emas} strokeWidth="2" />
          <circle r="2.4" fill={emas} />
        </g>
      ))}
    </svg>
  );
}

// Foto di dalam bingkai cermin (beranda & penutup). singkap: detik mulai foto tersingkap melingkar dari tengah
// seperti kabut di cermin yang menghilang (false = belum, undefined = langsung tampil), disusul kilau emas.
export function FotoBingkai({
  src,
  alt,
  sizes,
  className = "",
  posisi = "50% 50%",
  preload,
  singkap,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  posisi?: string;
  preload?: boolean;
  singkap?: number | false;
}) {
  const animasi = singkap !== undefined;
  return (
    <div className={`relative aspect-[300/420] ${className}`}>
      <div className="absolute inset-0 overflow-hidden bg-[#f3e1dc]" style={{ maskImage: MASKER_BINGKAI, WebkitMaskImage: MASKER_BINGKAI, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }}>
        <motion.div
          className="absolute inset-0"
          initial={animasi ? { clipPath: "circle(0% at 50% 45%)" } : false}
          animate={animasi && singkap !== false ? { clipPath: "circle(80% at 50% 45%)" } : undefined}
          transition={{ duration: 1.5, ease: [0.5, 0, 0.3, 1], delay: singkap || 0 }}
        >
          <div className={`${s.geserLambat} absolute inset-x-0 inset-y-[-10%]`}>
            <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className="object-cover" style={{ objectPosition: posisi }} />
          </div>
        </motion.div>
        {animasi && (
          <motion.div
            className="pointer-events-none absolute inset-y-0 left-0 w-[70%] bg-[linear-gradient(100deg,transparent_20%,rgb(255_240_225/0.7)_50%,transparent_80%)]"
            initial={{ opacity: 0, transform: "translateX(-110%)" }}
            animate={singkap !== false ? { opacity: [0, 1, 0], transform: "translateX(160%)" } : undefined}
            transition={{ duration: 1.1, ease: "easeInOut", delay: (singkap || 0) + 1.2 }}
            aria-hidden="true"
          />
        )}
      </div>
      <TepiBingkai className="top-[-7.14%] left-[-10%] h-[114.29%] w-[120%]" />
    </div>
  );
}

/* ───────── Foto lengkung: oval tinggi bertepi putih & emas ───────── */

export function Lengkung({ src, alt, sizes, className = "", posisi = "50% 22%", preload }: { src: string; alt: string; sizes: string; className?: string; posisi?: string; preload?: boolean }) {
  return (
    <div className={`relative aspect-[3/4.6] ${className}`}>
      <div className="absolute inset-0 rounded-full bg-[#fbf4f1] p-[7px] shadow-[0_22px_34px_-20px_rgb(74_18_25/0.85)]">
        <div className="relative h-full w-full overflow-hidden rounded-full">
          <div className={`${s.geserLambat} absolute inset-x-0 inset-y-[-10%]`}>
            <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className="object-cover" style={{ objectPosition: posisi }} />
          </div>
        </div>
      </div>
      <span className="pointer-events-none absolute inset-[3px] rounded-full border border-[#c9a35c]" aria-hidden="true" />
      <span className="pointer-events-none absolute -inset-[7px] rounded-full border border-[#c9a35c]/60" aria-hidden="true" />
    </div>
  );
}

/* ───────── Medali: foto bundar dalam cincin emas berputar ───────── */

export function Medali({ src, alt, sizes, className = "" }: { src: string; alt: string; sizes: string; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <div className={`relative aspect-square ${className}`}>
      <svg viewBox="0 0 200 200" className={`${s.putar} absolute inset-0 h-full w-full`} aria-hidden="true">
        <DefsEmas id={`m${id}`} />
        <circle cx="100" cy="100" r="96" fill="none" stroke={`url(#m${id})`} strokeWidth="1.4" strokeDasharray="1 5" strokeLinecap="round" />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d="M100 2c3 3 3 6 0 8-3-2-3-5 0-8Z" fill={EMAS} transform={`rotate(${i * 30} 100 100)`} />
        ))}
      </svg>
      <div className="absolute inset-[7%] rounded-full bg-[linear-gradient(135deg,#9a7638,#eed9a4_35%,#ae8a46_60%,#f5e6ba_82%,#9a7638)] p-[3px] shadow-[0_18px_30px_-16px_rgb(0_0_0/0.6)]">
        <div className="relative h-full w-full overflow-hidden rounded-full">
          <div className={`${s.zoomKeluar} absolute inset-0`}>
            <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── Segel lilin merah ───────── */

export function Segel({ huruf, className = "" }: { huruf: string; className?: string }) {
  // tepi lilin tidak rata: lingkaran bergelombang kecil
  let d = "";
  const N = 22;
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * Math.PI * 2;
    const r = 46 + (i % 2 ? 2.6 : -1.2) + rnd(i + 50) * 2;
    const x = b2(50 + r * Math.cos(a)),
      y = b2(50 + r * Math.sin(a));
    d += i === 0 ? `M${x} ${y}` : `L${x} ${y}`;
  }
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="segelLilin" cx=".38" cy=".32" r=".8">
          <stop offset="0" stopColor="#c0414f" />
          <stop offset=".55" stopColor="#8e1f2c" />
          <stop offset="1" stopColor="#5e0f19" />
        </radialGradient>
      </defs>
      <path d={`${d}Z`} fill="url(#segelLilin)" style={{ filter: "drop-shadow(0 3px 4px rgb(40 5 10 / 0.5))" }} />
      <circle cx="50" cy="50" r="33" fill="none" stroke="#5e0f19" strokeWidth="2.4" opacity=".7" />
      <circle cx="50" cy="50" r="33" fill="none" stroke="#e7a3a9" strokeWidth=".8" opacity=".45" transform="translate(-.8 -.8)" />
      <text x="50" y="62" textAnchor="middle" fontSize="34" fill="#5e0f19" opacity=".85" style={{ fontFamily: "var(--font-allura)" }}>
        {huruf}
      </text>
      <text x="49.2" y="61.2" textAnchor="middle" fontSize="34" fill="#e9a8ae" opacity=".55" style={{ fontFamily: "var(--font-allura)" }}>
        {huruf}
      </text>
    </svg>
  );
}

/* ───────── Monogram & pembatas ───────── */

export function Monogram({ a, b, className = "", terang = false }: { a: string; b: string; className?: string; terang?: boolean }) {
  const w = terang ? "#f3dcd6" : MARUN;
  return (
    <div className={`relative mx-auto grid aspect-square w-24 place-items-center ${className}`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx="50" cy="50" r="46" fill="none" stroke={w} strokeWidth="1" />
        <circle cx="50" cy="50" r="41" fill="none" stroke={EMAS} strokeWidth="1" strokeDasharray="1.5 3.5" />
        {[0, 90, 180, 270].map((r) => (
          <path key={r} d="M50 2c3 2 3 5 0 7-3-2-3-5 0-7Z" transform={`rotate(${r} 50 50)`} fill={EMAS} />
        ))}
      </svg>
      <p className={`${naskah} relative text-[2.6rem] leading-none ${terang ? "text-[#f7ece8]" : "text-[#4a1219]"}`}>
        {a}
        <span className="text-[#c9a35c]">&amp;</span>
        {b}
      </p>
    </div>
  );
}

// Garis tipis dengan buah delima kecil di tengah
export function Pembatas({ className = "", terang = false }: { className?: string; terang?: boolean }) {
  const w = terang ? "#f3dcd6" : MARUN;
  return (
    <svg viewBox="0 0 200 22" className={`mx-auto h-[22px] w-44 ${className}`} aria-hidden="true">
      <path d="M6 12h66M128 12h66" stroke={w} strokeWidth="1" strokeLinecap="round" opacity=".6" />
      <path d="M78 12h8M114 12h8" stroke={EMAS} strokeWidth="1.4" strokeLinecap="round" />
      <g transform="translate(100 12)">
        <path d="M0 -8.5C6 -8.5 9.5 -4 9.5 1S5.5 9.5 0 9.5-9.5 6-9.5 1-6-8.5 0-8.5Z" fill={terang ? "#b5404f" : ANGGUR} />
        <path d="M-3 -8.5 0 -12.5 3 -8.5" fill="none" stroke={EMAS} strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M-4 1C-2 4 2 4 4 1" fill="none" stroke="#f3c6c6" strokeWidth=".9" strokeLinecap="round" opacity=".8" />
      </g>
      {[90, 110].map((x) => (
        <circle key={x} cx={x} cy="12" r="1.6" fill={EMAS} />
      ))}
    </svg>
  );
}

// Tepi renda bergerigi di puncak bagian, berwarna sama dengan bagiannya, menimpa bagian sebelumnya
export function Renda({ warna }: { warna: string }) {
  const enc = encodeURIComponent(warna);
  return (
    <div
      className={`${s.renda} pointer-events-none absolute inset-x-0 top-0 h-[14px] -translate-y-[13px]`}
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='14'><path d='M0 14V8a7 7 0 0 1 14 0 7 7 0 0 1 14 0v6Z' fill='${enc}'/><circle cx='14' cy='9' r='1.6' fill='%23c9a35c'/></svg>")`,
      }}
      aria-hidden="true"
    />
  );
}
