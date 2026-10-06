"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { type CSSProperties, type ReactNode, useId } from "react";
import { useParalaks } from "../../pakai";
import { ASET, type Kembang } from "./aset";
import s from "./sunda.module.css";

// Ornamen khas Sunda yang digambar sendiri (kujang, mega mendung, siger, kuntul) dan susunan aset
// (rumpun bunga, bingkai foto, Gedung Sate). Gerakan terus-menerusnya CSS (transform/opacity) di sunda.module.css.

const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const v = (o: Record<string, string | number>) => o as CSSProperties;

/* ───────── Kujang: senjata pusaka Sunda, lima mata, bilah keemasan ───────── */

export function Kujang({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const id = useId();
  return (
    <svg viewBox="0 0 120 360" className={className} style={style} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8d6a35" />
          <stop offset=".35" stopColor="#f3dfa6" />
          <stop offset=".55" stopColor="#c9a45c" />
          <stop offset="1" stopColor="#7a5a2c" />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4a2e1f" />
          <stop offset=".45" stopColor="#8a5a3c" />
          <stop offset="1" stopColor="#3d261a" />
        </linearGradient>
      </defs>
      <path
        d="M57 4 C70 28 79 54 80 78 l7 -4 l-5 10 l7 -3 l-5 10 l7 -3 l-5 10 l6 -2 l-6 9 C77 150 75 200 70 240 L50 240 C46 236 38 232 27 233 C34 226 41 220 45 212 C33 206 22 192 22 172 C22 146 40 124 51 104 C56 92 52 64 50 44 C49 28 52 14 57 4 Z"
        fill={`url(#${id}b)`}
        stroke="#5c4320"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M58 16 C66 60 66 150 61 236" fill="none" stroke="#fff3c9" strokeWidth="1.3" opacity=".65" />
      {[34, 54, 74, 94, 114].map((y, i) => (
        <circle key={y} cx={67 + (i > 2 ? 1 : 0)} cy={y} r="3.8" fill="#2f4560" stroke="#5c4320" strokeWidth="1.3" />
      ))}
      <rect x="45" y="238" width="30" height="13" rx="3" fill="#c9a45c" stroke="#5c4320" strokeWidth="1.8" />
      <path d="M47 244 h26" stroke="#f3dfa6" strokeWidth="1.2" />
      <path d="M50 251 L70 251 C71 290 68 322 64 346 C62 356 56 356 55 346 C52 322 49 290 50 251 Z" fill={`url(#${id}g)`} stroke="#2b1a10" strokeWidth="1.8" />
      <path d="M51 270 h18 M52 300 h16" stroke="#c9a45c" strokeWidth="2" />
    </svg>
  );
}

/* ───────── Mega mendung: awan bergradasi khas batik Jawa Barat ───────── */

const MEGA = "M14 78 C2 74 4 56 18 56 C14 46 24 38 34 44 C36 30 54 26 62 36 C70 20 96 18 104 32 C114 20 136 22 140 36 C150 28 168 32 168 46 C180 42 194 52 186 62 C198 66 196 82 182 82 C170 90 152 84 142 88 C128 96 110 88 98 92 C84 98 66 90 54 92 C40 96 26 88 14 78 Z";
const PITA_NILA = ["#c3d0de", "#a9bbcf", "#90a6bf", "#7790ad", "#5f7a9a", "#476283", "#2f4560"];
// versi untuk latar nila: pita keemasan pudar
const PITA_EMAS = ["#46607d", "#56708a", "#6b8197", "#8a93a0", "#a99f8c", "#c4ab7a", "#d9bd85"];
// versi krem bertepi bata, untuk awan krem yang naik di atas latar nila
const PITA_KREM = ["#f4eee2", "#efe5d1", "#e7d7b9", "#dcc49c", "#c9a57a", "#a8714f", "#8a4b35"];
const WARNA_MEGA = {
  nila: { pita: PITA_NILA, isi: "#e3e9f0", garis: "#24364d" },
  emas: { pita: PITA_EMAS, isi: "#3a5370", garis: "#e3c98f" },
  krem: { pita: PITA_KREM, isi: "#f4eee2", garis: "#7a3f2c" },
};

export function MegaMendung({ className = "", style, warna = "nila" }: { className?: string; style?: CSSProperties; warna?: keyof typeof WARNA_MEGA }) {
  const id = useId();
  const { pita, isi, garis } = WARNA_MEGA[warna];
  return (
    <svg viewBox="0 0 200 104" className={className} style={style} aria-hidden="true">
      <defs>
        <clipPath id={`${id}c`}>
          <path d={MEGA} />
        </clipPath>
      </defs>
      <path d={MEGA} fill={isi} />
      <g clipPath={`url(#${id}c)`} fill="none" strokeLinejoin="round">
        {pita.map((w, i) => (
          <path key={w} d={MEGA} stroke={w} strokeWidth={(pita.length - i) * 5} />
        ))}
      </g>
      <path d={MEGA} fill="none" stroke={garis} strokeWidth="1.4" />
    </svg>
  );
}

/* ───────── Siger: mahkota pengantin Sunda ───────── */

export function Siger({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 200 110" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}e`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6e4b0" />
          <stop offset=".5" stopColor="#c9a45c" />
          <stop offset="1" stopColor="#8d6a35" />
        </linearGradient>
      </defs>
      {Array.from({ length: 9 }, (_, i) => {
        const t = (i - 4) / 4;
        const h = 62 - Math.abs(t) * 18;
        return (
          <g key={i} transform={`rotate(${t * 62} 100 96)`}>
            <path
              d={`M100 ${96 - h} C108 ${96 - h * 0.65} 107 ${96 - h * 0.3} 100 80 C93 ${96 - h * 0.3} 92 ${96 - h * 0.65} 100 ${96 - h} Z`}
              fill={`url(#${id}e)`}
              stroke="#7a5a2c"
              strokeWidth="1.3"
            />
            <circle cx="100" cy={96 - h - 6} r="3.6" fill="#f3dfa6" stroke="#7a5a2c" strokeWidth="1.1" />
          </g>
        );
      })}
      <path d="M30 98 Q100 62 170 98 L164 106 Q100 74 36 106 Z" fill={`url(#${id}e)`} stroke="#7a5a2c" strokeWidth="1.5" />
      {[0.2, 0.35, 0.5, 0.65, 0.8].map((t) => (
        <circle key={t} cx={36 + t * 128} cy={106 - Math.sin(t * Math.PI) * 26 - 4} r="2.6" fill="#a3392c" stroke="#7a5a2c" strokeWidth=".8" />
      ))}
    </svg>
  );
}

/* ───────── Kuntul: bangau putih yang terbang di atas sawah ───────── */

export function Kuntul({ className = "", delay = 0, size = 26 }: { className?: string; delay?: number; size?: number }) {
  return (
    <div className={`${s.kuntul} pointer-events-none absolute ${className}`} style={{ animationDelay: `${delay}s` }} aria-hidden="true">
      <svg viewBox="0 0 40 20" style={{ width: size }}>
        <g className={s.kepak} style={{ animationDelay: `${delay / 5}s` }}>
          <path d="M2 9 Q10 0 20 10 Q30 0 38 9 Q30 5 20 13 Q10 5 2 9 Z" fill="#fbf8f1" stroke="#5b6574" strokeWidth=".8" />
        </g>
        <path d="M17 11 Q21 9 26 12 L31 11 L26 13.5 Q21 14 17 11 Z" fill="#fbf8f1" stroke="#5b6574" strokeWidth=".7" />
        <path d="M31 11 l4 0.6" stroke="#d1a43c" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// Kuntul tanpa gerak melintas sendiri, untuk digerakkan dari luar (kawanan di pembuka, kisah yang mengikuti scroll)
export function Burung({ w, jeda = 0 }: { w: number; jeda?: number }) {
  return (
    <svg viewBox="0 0 40 20" style={{ width: w }} aria-hidden="true">
      <g className={s.kepak} style={{ animationDelay: `${jeda}s` }}>
        <path d="M2 9Q10 0 20 10Q30 0 38 9Q30 5 20 13Q10 5 2 9Z" fill="#fbf8f1" stroke="#5b6574" strokeWidth=".8" />
      </g>
      <path d="M17 11Q21 9 26 12L31 11L26 13.5Q21 14 17 11Z" fill="#fbf8f1" stroke="#5b6574" strokeWidth=".7" />
      <path d="M31 11l4 .6" stroke="#d1a43c" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/* ───────── Kuncup melati yang jatuh pelan ───────── */

export function MelatiJatuh({ n = 7, className = "" }: { n?: number; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-clip ${className}`} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <span
          key={i}
          className={`${s.melati} absolute top-0`}
          style={v({
            left: `${(rnd(i + 3) * 90).toFixed(1)}%`,
            "--x": `${Math.round((rnd(i + 9) - 0.3) * 110)}px`,
            "--d": `${(14 + rnd(i + 11) * 10).toFixed(1)}s`,
            animationDelay: `${(-rnd(i + 13) * 22).toFixed(1)}s`,
          })}
        >
          <svg viewBox="0 0 20 20" style={{ width: `${(9 + rnd(i + 7) * 7).toFixed(1)}px` }}>
            {[0, 72, 144, 216, 288].map((r) => (
              <ellipse key={r} cx="10" cy="5" rx="3.2" ry="5" fill="#fffdf6" stroke="#d8cfbd" strokeWidth=".5" transform={`rotate(${r} 10 10)`} />
            ))}
            <circle cx="10" cy="10" r="2" fill="#efe2b8" />
          </svg>
        </span>
      ))}
    </div>
  );
}

/* ───────── Rumpun bunga dari ilustrasi botani ───────── */

// Saat pertama terlihat, tiap tanaman tumbuh dari pangkalnya. Gerak masuknya memakai `transform` utuh supaya
// dijalankan mesin animasi browser (bukan dihitung JavaScript tiap frame), lalu bergoyang pelan dengan CSS.
// tampil: dikendalikan dari luar (mis. baru tumbuh setelah undangan dibuka) alih-alih saat terlihat.
export function Rumpun({ items, className = "", muncul = true, jeda = 0, tampil }: { items: Kembang[]; className?: string; muncul?: boolean; jeda?: number; tampil?: boolean }) {
  const pemicu = tampil === undefined ? { whileInView: "show", viewport: { once: true, amount: 0.05 } } : { animate: tampil ? "show" : "hidden" };
  return (
    <motion.div className={`pointer-events-none absolute ${className}`} aria-hidden="true" initial={muncul ? "hidden" : false} {...pemicu}>
      {items.map((t, i) => {
        const a = ASET[t.a];
        return (
          <div key={i} className="absolute" style={{ left: `${t.x}%`, bottom: `${t.b}%`, width: `${t.w}%`, zIndex: t.z ?? 0, rotate: `${t.r ?? 0}deg` }}>
            <motion.div
              style={{ transformOrigin: "50% 100%" }}
              variants={{
                hidden: { opacity: 0, transform: `scale(0.55, 0.3) rotate(${i % 2 ? 12 : -12}deg)` },
                show: { opacity: 1, transform: "scale(1, 1) rotate(0deg)", transition: { duration: 1.3, ease: [0.22, 1.2, 0.36, 1], delay: jeda + i * 0.09 } },
              }}
            >
              <div className={s.goyang} style={{ animationDelay: `${-i * 1.7}s`, animationDuration: `${6 + (i % 3) * 1.5}s` }}>
                <Image src={a.src} alt="" width={a.w} height={a.h} sizes={`${Math.round(t.w * 4.4)}px`} className={`h-auto w-full ${t.flip ? "-scale-x-100" : ""}`} />
              </div>
            </motion.div>
          </div>
        );
      })}
    </motion.div>
  );
}

/* ───────── Gedung Sate ───────── */

export function GedungSate({ className = "", sizes = "440px", preload }: { className?: string; sizes?: string; preload?: boolean }) {
  const g = ASET.gedungSate;
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden="true">
      <Image src={g.src} alt="" width={g.w} height={g.h} sizes={sizes} preload={preload} className="h-auto w-full" />
    </div>
  );
}

/* ───────── Bingkai foto oval/lengkung: garis cokelat bata ganda, garis dalam putus-putus ───────── */

export function Bingkai({
  src,
  alt,
  bentuk = "oval",
  className = "",
  sizes,
  preload,
  posisi = "50% 30%",
  fotoClass = "",
  terang = false,
}: {
  src: string;
  alt: string;
  bentuk?: "oval" | "lengkung";
  className?: string;
  sizes: string;
  preload?: boolean;
  posisi?: string;
  fotoClass?: string;
  terang?: boolean; // garis keemasan untuk latar nila
}) {
  const r = bentuk === "oval" ? "rounded-[50%]" : "rounded-t-full rounded-b-2xl";
  return (
    <div className={`relative ${className}`}>
      <div className={`${r} relative h-full w-full border-[1.5px] ${terang ? "border-[#d9bd85]" : "border-[#8a4b35]"} p-[5px] shadow-[0_18px_40px_-20px_rgb(47_69_96/0.7)]`}>
        <div className={`${r} relative h-full w-full overflow-clip bg-[#e9e0cf]`}>
          <div className={`absolute inset-x-0 inset-y-[-8%] ${fotoClass}`}>
            <Image src={src} alt={alt} fill preload={preload} sizes={sizes} className="object-cover" style={{ objectPosition: posisi }} />
          </div>
          <div className={`${r} pointer-events-none absolute inset-[5px] border border-dashed border-[#f4eee2]/70`} />
        </div>
      </div>
    </div>
  );
}

/* ───────── Pembatas: garis dengan kujang kecil di tengah ───────── */

export function Pemisah({ className = "", terang = false }: { className?: string; terang?: boolean }) {
  const garis = terang ? "bg-[#d9bd85]/70" : "bg-[#8a4b35]/50";
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className={`h-px w-16 ${garis}`} />
      <Kujang className="h-7 w-auto rotate-90" />
      <span className={`h-px w-16 ${garis}`} />
    </div>
  );
}

/* ───────── Awan pembatas antarbagian ───────── */

// Tepi atas sebuah bagian: gugusan awan bergelombang berwarna latar bagian itu, menjorok ke bagian sebelumnya, dengan
// dua lapis mega mendung yang bergerak beda kecepatan saat di-scroll (awanJauh di belakang, awanDekat di depan).
const BUKIT_AWAN =
  "M0 96V62C14 50 34 46 50 56C58 34 92 26 112 44C124 24 160 18 180 38C194 22 226 22 238 42C252 28 286 30 296 50C310 36 342 38 352 56C366 44 394 44 406 58C418 50 434 52 440 58V96Z";

export function AwanBatas({ warna }: { warna: "nila" | "krem" }) {
  const isi = warna === "nila" ? "#2f4560" : "#f4eee2";
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[calc(100%-1px)] h-24" aria-hidden="true">
      <div className={`${s.awanJauh} absolute inset-0`}>
        <MegaMendung warna={warna} className="absolute bottom-[34%] -left-[4%] w-[30%] opacity-80" />
        <MegaMendung warna={warna} className="absolute bottom-[44%] left-[38%] w-[22%] opacity-70" />
        <MegaMendung warna={warna} className="absolute -right-[3%] bottom-[30%] w-[28%] opacity-80" />
      </div>
      <svg viewBox="0 0 440 96" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d={BUKIT_AWAN} fill={isi} />
      </svg>
      <div className={`${s.awanDekat} absolute inset-0`}>
        <MegaMendung warna={warna} className="absolute -bottom-[38%] left-[12%] w-[36%]" />
        <MegaMendung warna={warna} className="absolute -right-[8%] -bottom-[24%] w-[34%]" />
      </div>
    </div>
  );
}

/* ───────── Gerak masuk yang mengikuti scroll ───────── */

// k: kelas CSS scroll-driven animation (sunda.module.css) yang menggerakkan elemen dari `dari` ke posisi akhirnya.
// Browser yang tidak menjalankannya dengan mulus (lihat useParalaks) mendapat gerak yang sama berbasis waktu saat
// elemen terlihat. Kelas k tetap dipasang di keduanya untuk transform-origin-nya.
export function Gulir({ k, dari, ke, className = "", style, jeda = 0, children }: { k: string; dari: string; ke: string; className?: string; style?: CSSProperties; jeda?: number; children: ReactNode }) {
  const paralaks = useParalaks();
  if (paralaks) {
    return (
      <div className={`${k} ${className}`} style={style}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      className={`${k} ${className}`}
      style={style}
      initial={{ opacity: 0, transform: dari }}
      whileInView={{ opacity: 1, transform: ke }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: jeda }}
    >
      {children}
    </motion.div>
  );
}

/* ───────── Tumpal: deretan segitiga pucuk rebung, motif pinggiran kain Nusantara ───────── */

export function Tumpal({ className = "", warna = "#8a4b35" }: { className?: string; warna?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 440 14" preserveAspectRatio="none" className={`block h-3.5 w-full ${className}`} aria-hidden="true">
      <defs>
        <pattern id={`${id}t`} width="22" height="14" patternUnits="userSpaceOnUse">
          <path d="M0 14 L11 1 L22 14" fill="none" stroke={warna} strokeWidth="1.2" />
          <path d="M6 14 L11 7 L16 14" fill={warna} opacity=".55" />
        </pattern>
      </defs>
      <rect width="440" height="14" fill={`url(#${id}t)`} />
    </svg>
  );
}

/* ───────── Aksara Sunda ───────── */

// Teks hiasan dalam aksara Sunda (Unicode), selalu disertai teks Latin di dekatnya untuk pembaca.
export function Aksara({ children, className = "" }: { children: string; className?: string }) {
  return (
    <p lang="su" className={`font-[family-name:var(--font-aksara)] ${className}`} aria-hidden="true">
      {children}
    </p>
  );
}
