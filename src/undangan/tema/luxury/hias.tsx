"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import s from "./luxury.module.css";

// Hiasan tema Luxury: monogram inisial, daun putih di latar, label tegak bergaris, garis emas, titik kerlip.

export const bodoni = "font-[family-name:var(--font-bodoni)]";
export const script = "font-[family-name:var(--font-script)]";

// Daun putih (siluet ilustrasi botani lama, domain publik) sebagai hiasan latar
const DAUN = {
  1: { src: "/undangan/luxury/daun-1.webp", w: 478, h: 700 },
  2: { src: "/undangan/luxury/daun-2.webp", w: 558, h: 700 },
  3: { src: "/undangan/luxury/daun-3.webp", w: 624, h: 700 },
} as const;

export function Daun({ n = 1, className = "", flip = false, delay = 0 }: { n?: 1 | 2 | 3; className?: string; flip?: boolean; delay?: number }) {
  const d = DAUN[n];
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <div className={s.goyang} style={{ animationDelay: `${delay}s` }}>
        <Image src={d.src} alt="" width={d.w} height={d.h} sizes="240px" className={`h-auto w-full ${flip ? "-scale-x-100" : ""}`} />
      </div>
    </div>
  );
}

// Monogram: dua inisial bersilang dalam lingkaran bergaris emas ganda
export function Monogram({ a, b, className = "", terang = false }: { a: string; b: string; className?: string; terang?: boolean }) {
  const warna = terang ? "border-[#e9d5a1]/80" : "border-[#b48d4b]/70";
  return (
    <div className={`relative grid aspect-square place-items-center rounded-full border ${warna} ${className}`} aria-hidden="true">
      <div className={`absolute inset-[5px] rounded-full border border-dashed ${warna}`} />
      <p className={`${bodoni} relative flex items-baseline text-[2.4em] leading-none italic ${terang ? "text-[#f6f1e9]" : "text-[#8f7f68]"}`}>
        <span className="-mr-[0.12em]">{a}</span>
        <span className={`${script} -mx-[0.1em] text-[0.7em] not-italic ${terang ? "text-[#e9d5a1]" : "text-[#b48d4b]"}`}>&amp;</span>
        <span className="translate-y-[0.18em]">{b}</span>
      </p>
    </div>
  );
}

// Label tegak raksasa bergaris (mis. "THE BRIDE")
export function LabelTegak({ children, className = "", style }: { children: string; className?: string; style?: CSSProperties }) {
  return (
    <p className={`${bodoni} ${s.garis} pointer-events-none text-[3.4rem] leading-none tracking-[0.06em] whitespace-nowrap uppercase [writing-mode:vertical-rl] ${className}`} style={style} aria-hidden="true">
      {children}
    </p>
  );
}

// Garis emas tipis dengan berlian di tengah
export function GarisEmas({ className = "", terang = false }: { className?: string; terang?: boolean }) {
  const g = terang ? "via-[#e9d5a1]" : "via-[#b48d4b]";
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`} aria-hidden="true">
      <span className={`h-px w-14 bg-gradient-to-r from-transparent ${g} to-transparent`} />
      <span className={`${s.emas} size-1.5 rotate-45`} />
      <span className={`${s.emas} size-2.5 rotate-45`} />
      <span className={`${s.emas} size-1.5 rotate-45`} />
      <span className={`h-px w-14 bg-gradient-to-r from-transparent ${g} to-transparent`} />
    </div>
  );
}

// Titik cahaya keemasan yang berkelip
const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export function Kerlip({ n = 10, className = "" }: { n?: number; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <span
          key={i}
          className={`${s.kerlip} absolute size-1 rounded-full bg-[#f1dfae] shadow-[0_0_8px_2px_rgb(241_223_174/0.5)]`}
          style={
            {
              left: `${(rnd(i + 5) * 94 + 3).toFixed(1)}%`,
              top: `${(rnd(i + 25) * 90 + 5).toFixed(1)}%`,
              "--d": `${(2 + rnd(i + 45) * 3).toFixed(1)}s`,
              animationDelay: `${(-rnd(i + 65) * 4).toFixed(1)}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
