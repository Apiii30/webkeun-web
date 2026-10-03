"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { type CSSProperties, type ReactNode, useId } from "react";
import { ASET, type NamaAset } from "./aset";
import s from "./garden.module.css";

// Ornamen tema Garden Premium: bingkai kameo oval, monogram dalam karangan laurel, tiang pergola,
// pintu taman berkisi, pembatas emas, burung, kelopak jatuh. Gerak masuk memakai `transform` utuh + opacity
// (dijalankan mesin animasi browser di GPU).

export const italiana = "font-[family-name:var(--font-italiana)]";
export const cormorant = "font-[family-name:var(--font-cormorant)]";
export const LEMBUT = [0.22, 1, 0.36, 1] as const;

// Muncul saat terlihat: naik pelan (default), atau membesar dari tengah
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
  const akhir = dari.startsWith("scale") ? "scale(1)" : dari.startsWith("rotate") ? "rotate(0deg)" : "translateY(0px)";
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, transform: dari }}
      whileInView={{ opacity: 1, transform: akhir }}
      viewport={{ once: true, amount }}
      transition={{ duration: durasi, ease: LEMBUT, delay: jeda }}
    >
      {children}
    </motion.div>
  );
}

export function Gambar({ a, className = "", sizes = "200px", flip = false, preload }: { a: NamaAset; className?: string; sizes?: string; flip?: boolean; preload?: boolean }) {
  const g = ASET[a];
  return <Image src={g.src} alt="" width={g.w} height={g.h} sizes={sizes} preload={preload} className={`h-auto w-full ${flip ? "-scale-x-100" : ""} ${className}`} />;
}

// Untaian wisteria yang menggantung & bergoyang dari titik gantungnya
export function Wisteria({ className = "", jeda = 0, sizes = "90px" }: { className?: string; jeda?: number; sizes?: string }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <div className={s.gantung} style={{ animationDelay: `${jeda}s` }}>
        <Gambar a="wisteria" sizes={sizes} />
      </div>
    </div>
  );
}

export function Burung({ className = "", delay = 0, size = 15, warna = "#34596a" }: { className?: string; delay?: number; size?: number; warna?: string }) {
  return (
    <div className={`${s.burung} pointer-events-none absolute ${className}`} style={{ animationDelay: `${delay}s` }} aria-hidden="true">
      <svg viewBox="0 0 20 8" className={s.kepak} style={{ width: size }}>
        <path d="M0 6Q5 0 10 5 15 0 20 6" fill="none" stroke={warna} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// Kelopak peony merah muda yang jatuh berputar
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
          <svg viewBox="0 0 20 24" style={{ width: `${(9 + rnd(i + 7) * 7).toFixed(1)}px` }}>
            <path d="M10 1C16 4 19 11 17 17s-7 7-7 7-6-1-8-7S4 4 10 1Z" fill={i % 2 ? "#e7a3a6" : "#f3c6c4"} opacity=".9" />
          </svg>
        </span>
      ))}
    </div>
  );
}

/* ───────── Gradien emas (dipakai beberapa SVG) ───────── */

function DefsEmas({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#8a6a33" />
        <stop offset=".3" stopColor="#ecd8a2" />
        <stop offset=".55" stopColor="#a8843f" />
        <stop offset=".78" stopColor="#f2e3b5" />
        <stop offset="1" stopColor="#8f6d34" />
      </linearGradient>
    </defs>
  );
}

// Angka SVG dibulatkan: hasil sin/cos bisa beda di digit terakhir antara server & browser (hydration mismatch)
const b2 = (n: number) => Math.round(n * 100) / 100;

// Daun laurel di sepanjang lengkung elips (sudut dalam derajat, 90 = bawah)
function daunLaurel(cx: number, cy: number, rx: number, ry: number, dari: number, ke: number, langkah: number) {
  const out: { x: number; y: number; r: number }[] = [];
  for (let t = dari; dari < ke ? t <= ke : t >= ke; t += dari < ke ? langkah : -langkah) {
    const a = (t * Math.PI) / 180;
    const x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
    const tangen = (Math.atan2(ry * Math.cos(a), -rx * Math.sin(a)) * 180) / Math.PI;
    out.push({ x: b2(x), y: b2(y), r: b2(tangen) });
  }
  return out;
}

/* ───────── Bingkai kameo oval: cincin emas bermanik, ranting laurel menyilang di bawah, pita di atas ───────── */

export function Kameo({ src, alt, sizes, className = "", posisi = "50% 25%", preload }: { src: string; alt: string; sizes: string; className?: string; posisi?: string; preload?: boolean }) {
  const id = useId().replace(/:/g, "");
  const emas = `url(#e${id})`;
  const manik = Array.from({ length: 56 }, (_, i) => {
    const a = (i / 56) * Math.PI * 2;
    return [b2(150 + 121 * Math.cos(a)), b2(190 + 161 * Math.sin(a))];
  });
  const kiri = daunLaurel(150, 190, 142, 182, 100, 168, 7);
  const kanan = daunLaurel(150, 190, 142, 182, 80, 12, 7);
  return (
    <div className={`relative aspect-[300/380] ${className}`}>
      <div className="absolute inset-[7%_8%] overflow-hidden rounded-[50%]">
        <div className={`${s.geserLambat} absolute inset-x-0 inset-y-[-10%]`}>
          <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className="object-cover" style={{ objectPosition: posisi }} />
        </div>
      </div>
      <svg viewBox="0 0 300 380" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible drop-shadow-[0_10px_14px_rgb(36_67_78/0.35)]" aria-hidden="true">
        <DefsEmas id={`e${id}`} />
        <ellipse cx="150" cy="190" rx="131" ry="171" fill="none" stroke={emas} strokeWidth="9" />
        <ellipse cx="150" cy="190" rx="137" ry="177" fill="none" stroke="#34596a" strokeWidth="1" opacity=".5" />
        {manik.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.3" fill="#f6ecc9" stroke="#8a6a33" strokeWidth=".6" />
        ))}
        {[...kiri, ...kanan].map((d, i) => (
          <g key={i} transform={`translate(${d.x} ${d.y}) rotate(${d.r})`}>
            <ellipse cx="0" cy={i % 2 ? -7 : 7} rx="11" ry="4.6" transform={`rotate(${i % 2 ? -28 : 28})`} fill={emas} stroke="#7a5c2a" strokeWidth=".6" />
          </g>
        ))}
        {/* pita di puncak */}
        <g transform="translate(150 18)">
          <path d="M0 0c-14-14-38-16-40-4s22 14 40 4Zm0 0c14-14 38-16 40-4S18 14 0 0Z" fill={emas} stroke="#7a5c2a" strokeWidth=".8" />
          <path d="M-3 2l-14 30 9-4 4 9 7-33Zm6 0 14 30-9-4-4 9-7-33Z" fill={emas} stroke="#7a5c2a" strokeWidth=".8" />
          <circle r="5" fill="#f2e3b5" stroke="#7a5c2a" strokeWidth=".8" />
        </g>
      </svg>
    </div>
  );
}

/* ───────── Monogram dalam karangan laurel ───────── */

export function Monogram({ a, b, className = "", terang = false }: { a: string; b: string; className?: string; terang?: boolean }) {
  const id = useId().replace(/:/g, "");
  const daun = [...daunLaurel(60, 60, 50, 50, 100, 250, 12), ...daunLaurel(60, 60, 50, 50, 80, -70, 12)];
  return (
    <div className={`relative mx-auto aspect-square w-28 ${className}`}>
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <DefsEmas id={`m${id}`} />
        {daun.map((d, i) => (
          <g key={i} transform={`translate(${d.x} ${d.y}) rotate(${d.r})`}>
            <ellipse cx="0" cy={i % 2 ? -4 : 4} rx="7" ry="2.8" transform={`rotate(${i % 2 ? -30 : 30})`} fill={`url(#m${id})`} />
          </g>
        ))}
      </svg>
      <p className={`${italiana} absolute inset-0 flex items-center justify-center text-[2.1rem] leading-none ${terang ? "text-[#f3efe3]" : "text-[#2f5563]"}`}>
        {a}
        <span className="mx-0.5 text-[1.1rem] text-[#b9975b]">&amp;</span>
        {b}
      </p>
    </div>
  );
}

/* ───────── Pembatas: sulur emas dengan kuntum di tengah ───────── */

export function Pembatas({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 220 24" className={`mx-auto h-6 w-52 ${className}`} aria-hidden="true">
      <DefsEmas id={`p${id}`} />
      <g fill="none" stroke={`url(#p${id})`} strokeWidth="1.4" strokeLinecap="round">
        <path d="M110 12C96 2 80 2 70 12S44 22 30 12 8 6 2 12M110 12c14-10 30-10 40 0s26 10 40 0 22-6 28 0" />
        <path d="M70 12c-6-8-14-8-16-2M150 12c6-8 14-8 16-2M30 12c-4 6-10 6-12 1M190 12c4 6 10 6 12 1" />
      </g>
      <g transform="translate(110 12)" fill={`url(#p${id})`}>
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} cx="0" cy="-5" rx="2.6" ry="5" transform={`rotate(${r})`} />
        ))}
        <circle r="2.2" fill="#fff4d6" />
      </g>
    </svg>
  );
}

/* ───────── Tiang pergola (untuk kartu acara) ───────── */

export function Tiang({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute flex w-[22px] flex-col items-center ${className}`} aria-hidden="true">
      <svg viewBox="0 0 30 20" className="w-[30px] shrink-0">
        <path d="M1 2h28v4H1Z" fill="#e7ece8" stroke="#34596a" strokeWidth="1.2" />
        <circle cx="5" cy="11" r="4.5" fill="#e7ece8" stroke="#34596a" strokeWidth="1.2" />
        <circle cx="25" cy="11" r="4.5" fill="#e7ece8" stroke="#34596a" strokeWidth="1.2" />
        <path d="M9 8h12v6H9Z" fill="#e7ece8" stroke="#34596a" strokeWidth="1.2" />
        <path d="M3 11a2 2 0 1 1 2 2M27 11a2 2 0 1 0-2 2" fill="none" stroke="#34596a" strokeWidth=".9" />
      </svg>
      <div className="w-[18px] flex-1 border-x border-[#34596a] bg-[repeating-linear-gradient(90deg,#e7ece8_0_3px,#34596a_3px_3.8px)] shadow-[inset_-5px_0_0_rgb(52_89_106/0.18)]" />
      <svg viewBox="0 0 30 16" className="w-[30px] shrink-0">
        <path d="M5 1h20v4H5ZM2 5h26v10H2Z" fill="#e7ece8" stroke="#34596a" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

/* ───────── Pintu taman berkisi yang terbuka saat terlihat ───────── */

// Dua daun pintu menutupi isi, lalu berayun terbuka ke luar (berputar pada engselnya di sisi kiri & kanan).
// Bagian belakang pintu disembunyikan, jadi setelah lewat 90° pintu menghilang dengan sendirinya.
export function PintuTaman({ jeda = 0.15 }: { jeda?: number }) {
  const id = useId().replace(/:/g, "");
  const pola = (
    <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <pattern id={`k${id}`} width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="22" height="22" fill="#e7ece8" />
          <path d="M0 0H22M0 0V22" stroke="#34596a" strokeWidth="2.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#k${id})`} />
    </svg>
  );
  return (
    <div className="pointer-events-none absolute inset-0 z-20 [perspective:1400px]" aria-hidden="true">
      {[true, false].map((kiri) => (
        <motion.div
          key={String(kiri)}
          className={`absolute inset-y-0 w-1/2 overflow-hidden border-2 border-[#34596a] [backface-visibility:hidden] ${kiri ? "left-0 rounded-tl-[999px]" : "right-0 rounded-tr-[999px]"}`}
          style={{ transformOrigin: kiri ? "0% 50%" : "100% 50%" }}
          initial={{ transform: "rotateY(0deg)" }}
          whileInView={{ transform: `rotateY(${kiri ? -112 : 112}deg)` }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 1.7, ease: [0.65, 0, 0.25, 1], delay: jeda }}
        >
          {pola}
          {/* gagang pintu & bingkai dalam */}
          <span className={`absolute top-1/2 size-3 -translate-y-1/2 rounded-full border-2 border-[#34596a] bg-[#dcc58f] ${kiri ? "right-3" : "left-3"}`} />
          <span className={`absolute inset-2 border border-[#34596a]/60 ${kiri ? "rounded-tl-[999px]" : "rounded-tr-[999px]"}`} />
        </motion.div>
      ))}
    </div>
  );
}
