"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { type CSSProperties, type ReactNode, useId } from "react";
import { tepiPudar } from "../../tepi";
import { ASET, GUNUNGAN, MASKER_GUNUNGAN, type NamaAset } from "./aset";
import s from "./porselen.module.css";

// Ornamen tema Biru Porselen: jendela gunungan bertepi timbul, bingkai kapsul berpita kawung, piring porselen,
// pembatas, air danau beriak, perahu, burung, kelopak jatuh. Gerak masuk memakai `transform` utuh + opacity
// (dijalankan mesin animasi browser di GPU).

export const naskah = "font-[family-name:var(--font-naskah)]"; // Imperial Script
export const gilda = "font-[family-name:var(--font-gilda)]"; // Gilda Display
export const HALUS = [0.22, 1, 0.36, 1] as const;

// Muncul saat terlihat: naik pelan (default), membesar, atau dari samping
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
    <Image src={g.src} alt="" width={g.w} height={g.h} sizes={sizes} preload={preload} style={tepiPudar(g)} className={`h-auto w-full ${flip ? "-scale-x-100" : ""} ${className}`} />
  );
}

// Bunga yang bergoyang pelan dari pangkalnya
export function Bunga({ a, className = "", sizes = "200px", flip, varian = "A", asal = "50% 100%" }: { a: NamaAset; className?: string; sizes?: string; flip?: boolean; varian?: "A" | "B"; asal?: string }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <div className={varian === "A" ? s.ayunA : s.ayunB} style={{ transformOrigin: asal }}>
        <Gambar a={a} sizes={sizes} flip={flip} />
      </div>
    </div>
  );
}

export function Burung({ className = "", delay = 0, size = 15, warna = "#27427a" }: { className?: string; delay?: number; size?: number; warna?: string }) {
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
// angka dibulatkan: hasil sin/cos bisa beda di digit terakhir antara server & browser (hydration mismatch)
const b2 = (n: number) => Math.round(n * 100) / 100;

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
            <path d="M10 1C16 4 19 11 17 17s-7 7-7 7-6-1-8-7S4 4 10 1Z" fill={i % 2 ? "#c7d6ef" : "#fbfaf6"} stroke="#27427a" strokeWidth=".6" strokeOpacity=".4" />
          </svg>
        </span>
      ))}
    </div>
  );
}

/* ───────── Air danau: gradien biru, dua lapis riak yang bergeser, kilau, bayangan ───────── */

export function Danau({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-[#a9bfe2] via-[#6f8fc6] to-[#2f4c86]" />
      <div className={`${s.riak} ${s.alirA} absolute inset-y-0 left-0 w-[calc(100%+120px)] opacity-70`} />
      <div className={`${s.riak} ${s.alirB} absolute inset-y-0 left-0 w-[calc(100%+120px)] translate-y-[13px] opacity-40`} />
      {Array.from({ length: 10 }, (_, i) => (
        <span
          key={i}
          className={`${s.kilauAir} absolute h-[2px] rounded-full bg-white`}
          style={{ left: `${(rnd(i + 40) * 86 + 4).toFixed(1)}%`, top: `${(rnd(i + 60) * 80 + 8).toFixed(1)}%`, width: `${Math.round(14 + rnd(i + 80) * 26)}px`, "--d": `${(2.4 + rnd(i + 90) * 2.6).toFixed(1)}s`, animationDelay: `${(-rnd(i + 99) * 4).toFixed(1)}s` } as CSSProperties}
        />
      ))}
      <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-white/50 to-transparent" />
    </div>
  );
}

// Perahu layar kecil yang hanyut & terombang-ambing
export function Perahu({ className = "", jeda = 0 }: { className?: string; jeda?: number }) {
  return (
    <div className={`${s.hanyut} pointer-events-none absolute ${className}`} style={{ animationDelay: `${jeda}s` }} aria-hidden="true">
      <div className={s.ombang} style={{ animationDelay: `${jeda / 2}s` }}>
        <Gambar a="perahu" sizes="70px" />
      </div>
    </div>
  );
}

/* ───────── Gradien emas ───────── */

function DefsEmas({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#9a7638" />
        <stop offset=".35" stopColor="#ecd7a0" />
        <stop offset=".6" stopColor="#ae8a46" />
        <stop offset=".82" stopColor="#f3e3b4" />
        <stop offset="1" stopColor="#9a7638" />
      </linearGradient>
    </defs>
  );
}

/* ───────── Bingkai jendela gunungan bertepi timbul ───────── */

// Cincin bertingkat di sekeliling jendela gunungan, seperti ukiran timbul di kertas (dipakai di gerbang & penutup)
export function TepiGunungan({ className = "", emas = false }: { className?: string; emas?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="-40 -40 380 500" className={`pointer-events-none absolute overflow-visible ${className}`} aria-hidden="true">
      {emas && <DefsEmas id={`t${id}`} />}
      <path d={GUNUNGAN} fill="none" stroke="#fbfaf6" strokeWidth="58" strokeLinejoin="round" style={{ filter: "drop-shadow(0 8px 12px rgb(39 66 122 / 0.22))" }} />
      <path d={GUNUNGAN} fill="none" stroke="#ebe6da" strokeWidth="38" strokeLinejoin="round" />
      <path d={GUNUNGAN} fill="none" stroke="#fbfaf6" strokeWidth="24" strokeLinejoin="round" />
      <path d={GUNUNGAN} fill="none" stroke="#d9d1c0" strokeWidth="9" strokeLinejoin="round" />
      <path d={GUNUNGAN} fill="none" stroke={emas ? `url(#t${id})` : "#fdfcf8"} strokeWidth={emas ? 4 : 3} strokeLinejoin="round" />
    </svg>
  );
}

// Foto di dalam jendela gunungan (beranda & penutup). singkap: detik mulai foto tersingkap dari bawah ke atas
// (false = belum, undefined = langsung tampil), disusul kilau emas yang menyapu kacanya.
export function FotoGunungan({
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
      <div className="absolute inset-0 overflow-hidden bg-[#dfe6f1]" style={{ maskImage: MASKER_GUNUNGAN, WebkitMaskImage: MASKER_GUNUNGAN, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }}>
        <motion.div
          className="absolute inset-0"
          initial={animasi ? { clipPath: "inset(100% 0% 0% 0%)" } : false}
          animate={animasi && singkap !== false ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
          transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1], delay: singkap || 0 }}
        >
          <div className={`${s.geserLambat} absolute inset-x-0 inset-y-[-10%]`}>
            <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className="object-cover" style={{ objectPosition: posisi }} />
          </div>
        </motion.div>
        {animasi && (
          <motion.div
            className="pointer-events-none absolute inset-y-0 left-0 w-[70%] bg-[linear-gradient(100deg,transparent_20%,rgb(255_247_222/0.75)_50%,transparent_80%)]"
            initial={{ opacity: 0, transform: "translateX(-110%)" }}
            animate={singkap !== false ? { opacity: [0, 1, 0], transform: "translateX(160%)" } : undefined}
            transition={{ duration: 1.1, ease: "easeInOut", delay: (singkap || 0) + 1.1 }}
            aria-hidden="true"
          />
        )}
      </div>
      <TepiGunungan className="top-[-9.52%] left-[-13.33%] h-[119.05%] w-[126.67%]" emas />
    </div>
  );
}

/* ───────── Bingkai kapsul berpita kawung ───────── */

export function Kapsul({ src, alt, sizes, className = "", posisi = "50% 22%", preload }: { src: string; alt: string; sizes: string; className?: string; posisi?: string; preload?: boolean }) {
  return (
    <div className={`relative aspect-[3/4.4] ${className}`}>
      <div className={`${s.kawung} absolute inset-0 rounded-full p-[9px] shadow-[0_18px_30px_-18px_rgb(35_60_112/0.9)]`}>
        <div className="h-full w-full rounded-full bg-[#fbfaf6] p-[3px]">
          <div className="relative h-full w-full overflow-hidden rounded-full">
            <div className={`${s.geserLambat} absolute inset-x-0 inset-y-[-10%]`}>
              <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className="object-cover" style={{ objectPosition: posisi }} />
            </div>
          </div>
        </div>
      </div>
      <span className="pointer-events-none absolute -inset-[5px] rounded-full border border-[#b8934f]/80" aria-hidden="true" />
    </div>
  );
}

/* ───────── Piring porselen: foto bundar di dalam tepi bergerigi bermotif ───────── */

export function Piring({ src, alt, sizes, className = "" }: { src: string; alt: string; sizes: string; className?: string }) {
  const id = useId().replace(/:/g, "");
  const N = 32;
  // tepi bergerigi (scallop): busur kecil di sekeliling lingkaran
  let d = "";
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * Math.PI * 2;
    const x = b2(100 + 96 * Math.cos(a)), y = b2(100 + 96 * Math.sin(a));
    d += i === 0 ? `M${x} ${y}` : `A9.6 9.6 0 0 1 ${x} ${y}`;
  }
  const daun = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * 360;
    return a;
  });
  return (
    <div className={`relative aspect-square ${className}`}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full drop-shadow-[0_16px_20px_rgb(35_60_112/0.3)]" aria-hidden="true">
        <DefsEmas id={`p${id}`} />
        <path d={`${d}Z`} fill="#fbfaf6" stroke="#27427a" strokeWidth="1.4" />
        <circle cx="100" cy="100" r="86" fill="none" stroke="#27427a" strokeWidth="1" />
        <circle cx="100" cy="100" r="80" fill="none" stroke={`url(#p${id})`} strokeWidth="2.2" />
        {daun.map((a) => (
          <g key={a} transform={`rotate(${a} 100 100)`}>
            <path d="M100 7c4 3 4 7 0 9-4-2-4-6 0-9Z" fill="#27427a" />
            <circle cx="100" cy="17.5" r="1.1" fill="#27427a" />
          </g>
        ))}
      </svg>
      <div className="absolute inset-[11.5%] overflow-hidden rounded-full">
        <div className={`${s.zoomKeluar} absolute inset-0`}>
          <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
        </div>
      </div>
    </div>
  );
}

/* ───────── Monogram & pembatas ───────── */

export function Monogram({ a, b, className = "", terang = false }: { a: string; b: string; className?: string; terang?: boolean }) {
  return (
    <div className={`relative mx-auto grid aspect-square w-24 place-items-center ${className}`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx="50" cy="50" r="46" fill="none" stroke={terang ? "#dbe5f3" : "#27427a"} strokeWidth="1" />
        <circle cx="50" cy="50" r="41" fill="none" stroke="#b8934f" strokeWidth="1" strokeDasharray="1.5 3.5" />
        {[0, 90, 180, 270].map((r) => (
          <path key={r} d="M50 2c3 2 3 5 0 7-3-2-3-5 0-7Z" transform={`rotate(${r} 50 50)`} fill="#b8934f" />
        ))}
      </svg>
      <p className={`${naskah} relative text-[2.3rem] leading-none ${terang ? "text-[#f6f3ec]" : "text-[#27427a]"}`}>
        {a}
        <span className="text-[#b8934f]">&amp;</span>
        {b}
      </p>
    </div>
  );
}

export function Pembatas({ className = "", terang = false }: { className?: string; terang?: boolean }) {
  const w = terang ? "#dbe5f3" : "#27427a";
  return (
    <svg viewBox="0 0 200 20" className={`mx-auto h-5 w-44 ${className}`} aria-hidden="true">
      <path d="M8 10h70M122 10h70" stroke={w} strokeWidth="1" strokeLinecap="round" opacity=".7" />
      <g transform="translate(100 10)">
        <ellipse cx="0" cy="-4.5" rx="3" ry="4.5" fill="none" stroke={w} strokeWidth="1" />
        <ellipse cx="0" cy="4.5" rx="3" ry="4.5" fill="none" stroke={w} strokeWidth="1" />
        <ellipse cx="-4.5" cy="0" rx="4.5" ry="3" fill="none" stroke={w} strokeWidth="1" />
        <ellipse cx="4.5" cy="0" rx="4.5" ry="3" fill="none" stroke={w} strokeWidth="1" />
        <circle r="1.4" fill="#b8934f" />
      </g>
      {[84, 116].map((x) => (
        <circle key={x} cx={x} cy="10" r="1.8" fill="#b8934f" />
      ))}
    </svg>
  );
}
