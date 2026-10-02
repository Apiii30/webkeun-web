"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { ASET, type NamaAset, RUMPUN_BINGKAI, type Tanaman } from "./aset";
import s from "./rimba.module.css";

// Elemen alam tema Rimba: latar lukisan hutan, awan, kabut, sinar, kunang-kunang, kelopak jatuh, burung,
// kupu-kupu, rumpun bunga, tanaman di depan layar, bingkai emas.
// Semua gerakan terus-menerus memakai CSS (transform & opacity saja) supaya dijalankan GPU dan tidak membebani scroll.

// Angka acak yang selalu sama untuk seed yang sama, supaya hasil server & browser identik
const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const v = (o: Record<string, string | number>) => o as CSSProperties;

export function Awan({ className = "", style, varian = 1 }: { className?: string; style?: CSSProperties; varian?: 1 | 2 }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} style={style} aria-hidden="true">
      <Image src={varian === 1 ? ASET.awan1.src : ASET.awan2.src} alt="" width={ASET.awan1.w} height={ASET.awan1.h} sizes="200px" className="h-auto w-full" />
    </div>
  );
}

export function Burung({ className = "", delay = 0, size = 16 }: { className?: string; delay?: number; size?: number }) {
  return (
    <div className={`${s.burung} pointer-events-none absolute ${className}`} style={{ animationDelay: `${delay}s` }} aria-hidden="true">
      <svg viewBox="0 0 20 8" className={s.kepakBurung} style={{ width: size }}>
        <path d="M0 6Q5 0 10 5 15 0 20 6" fill="none" stroke="#0c1810" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// dekat: ikut parallax, bergerak lebih cepat dari halaman seolah terbang di depan layar
export function Kupu({ a = "kupuMonarch", className = "", delay = 0, w = 38, dekat = false }: { a?: NamaAset; className?: string; delay?: number; w?: number; dekat?: boolean }) {
  const img = ASET[a];
  return (
    <div className={`pointer-events-none absolute z-20 ${dekat ? s.pDekat : ""} ${className}`} aria-hidden="true">
      <div className={s.terbang} style={{ animationDelay: `${delay}s` }}>
        <div className={s.kepak} style={{ animationDelay: `${delay / 4}s` }}>
          <Image src={img.src} alt="" width={img.w} height={img.h} sizes={`${w * 2}px`} style={{ width: w, height: "auto" }} />
        </div>
      </div>
    </div>
  );
}

// Kabut tipis yang bergeser pelan
export function Kabut({ className = "" }: { className?: string }) {
  return (
    <div
      className={`${s.kabut} pointer-events-none absolute -inset-x-1/4 ${className}`}
      style={{
        background:
          "radial-gradient(ellipse 45% 38% at 30% 60%, rgb(214 226 219 / 0.2), transparent 70%), radial-gradient(ellipse 40% 30% at 72% 42%, rgb(214 226 219 / 0.16), transparent 70%)",
      }}
      aria-hidden="true"
    />
  );
}

// Kunang-kunang: titik cahaya keemasan yang berkelip sambil melayang
export function Kunang({ n = 14, className = "" }: { n?: number; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => {
        const size = 3 + rnd(i) * 4;
        return (
          <span
            key={i}
            className={`${s.kunang} absolute rounded-full`}
            style={v({
              left: `${(rnd(i + 20) * 92 + 4).toFixed(1)}%`,
              top: `${(rnd(i + 40) * 80 + 10).toFixed(1)}%`,
              width: size.toFixed(1) + "px",
              height: size.toFixed(1) + "px",
              background: "radial-gradient(circle, #fff6c9 0%, #f3d77a 35%, rgb(243 215 122 / 0) 70%)",
              boxShadow: "0 0 10px 3px rgb(243 215 122 / 0.35)",
              "--x": `${Math.round((rnd(i + 60) - 0.5) * 80)}px`,
              "--y": `${Math.round((rnd(i + 80) - 0.6) * 90)}px`,
              "--d": `${(7 + rnd(i + 100) * 8).toFixed(1)}s`,
              "--k": `${(1.6 + rnd(i + 120) * 2.4).toFixed(1)}s`,
              animationDelay: `${(-rnd(i + 140) * 10).toFixed(1)}s`,
            })}
          />
        );
      })}
    </div>
  );
}

// Berkas cahaya miring dari atas, seperti matahari yang menembus dedaunan
export function Sinar({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 h-[70%] overflow-hidden ${className}`} aria-hidden="true">
      {[
        { l: "8%", w: "16%", d: "0s" },
        { l: "34%", w: "10%", d: "-3s" },
        { l: "58%", w: "20%", d: "-6s" },
      ].map((b) => (
        <span
          key={b.l}
          className={`${s.sinar} absolute -top-10 h-full origin-top skew-x-[-18deg]`}
          style={{ left: b.l, width: b.w, animationDelay: b.d, background: "linear-gradient(to bottom, rgb(255 244 205 / 0.35), rgb(255 244 205 / 0))" }}
        />
      ))}
    </div>
  );
}

// Kelopak mawar yang jatuh berputar
export function Kelopak({ n = 7, className = "" }: { n?: number; className?: string }) {
  const warna = [
    ["#f4b7b0", "#d9706a"],
    ["#f7cfc4", "#e08f86"],
    ["#e88b8b", "#b8434e"],
  ];
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => {
        const [a, b] = warna[i % warna.length];
        const size = 10 + rnd(i + 7) * 9;
        return (
          <span
            key={i}
            className={`${s.kelopak} absolute top-0`}
            style={v({
              left: `${(rnd(i + 3) * 90).toFixed(1)}%`,
              "--x": `${Math.round((rnd(i + 9) - 0.3) * 120)}px`,
              "--d": `${(13 + rnd(i + 11) * 10).toFixed(1)}s`,
              animationDelay: `${(-rnd(i + 13) * 20).toFixed(1)}s`,
            })}
          >
            <svg viewBox="0 0 20 24" className={s.kelopakPutar} style={{ width: `${size.toFixed(1)}px`, animationDelay: `${(-rnd(i) * 2).toFixed(1)}s` }}>
              <defs>
                <radialGradient id={`rb-kelopak-${i}`} cx="0.35" cy="0.3" r="0.9">
                  <stop offset="0" stopColor={a} />
                  <stop offset="1" stopColor={b} />
                </radialGradient>
              </defs>
              <path d="M10 1C16 4 19 11 17 17s-7 7-7 7-6-1-8-7S4 4 10 1Z" fill={`url(#rb-kelopak-${i})`} opacity="0.92" />
            </svg>
          </span>
        );
      })}
    </div>
  );
}

// Latar lukisan hutan yang diam di tempat selama konten di-scroll, pelan-pelan mendekat
export function Latar() {
  return (
    <>
      {/* di layar lebar: versi redup lukisan yang sama memenuhi sisi kiri-kanan */}
      <div className="pointer-events-none fixed inset-0 hidden overflow-hidden min-[480px]:block" aria-hidden="true">
        <div className={`${s.latarSisi} absolute inset-0`}>
          <Image src={ASET.hutan.src} alt="" fill sizes="100vw" className="object-cover opacity-25" />
        </div>
      </div>
      <div className="pointer-events-none fixed inset-y-0 left-1/2 w-full max-w-[440px] -translate-x-1/2 overflow-hidden" aria-hidden="true">
        <div className={`${s.latarGerak} absolute inset-0`}>
          <Image src={ASET.hutan.src} alt="" fill preload sizes="440px" className="object-cover object-[42%_50%]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1610]/60 via-[#0b1610]/40 to-[#0b1610]/80" />
        <Sinar />
        <Kabut className="top-[35%] h-1/2" />
        <Awan className={`${s.awan} top-[3%] left-0 w-48 opacity-45`} style={{ animationDelay: "-25s" }} />
        <Awan varian={2} className={`${s.awan} top-[20%] left-0 w-32 opacity-30`} style={{ animationDelay: "-60s", animationDuration: "95s" }} />
        <Burung className="top-[12%] left-0" delay={-6} />
        <Burung className="top-[14%] left-0" delay={-8} size={11} />
        <Kunang n={16} />
        <Kelopak n={6} />
      </div>
    </>
  );
}

// Rumpun tanaman dari ilustrasi botani. dari="bawah": tumbuh dari dasar; "atas": menjuntai dari atas.
// Saat pertama terlihat, tiap tanaman "tumbuh": memanjang dari pangkalnya sambil sedikit berayun.
export function Rumpun({ items, className = "", dari = "bawah", muncul = true }: { items: Tanaman[]; className?: string; dari?: "bawah" | "atas"; muncul?: boolean }) {
  const bawah = dari === "bawah";
  return (
    <motion.div
      className={`pointer-events-none absolute ${className}`}
      aria-hidden="true"
      initial={muncul ? "hidden" : false}
      whileInView="show"
      viewport={{ once: true, amount: 0.05 }}
    >
      {items.map((t, i) => {
        const a = ASET[t.a];
        return (
          <div key={i} className="absolute" style={{ left: `${t.x}%`, width: `${t.w}%`, rotate: `${t.r ?? 0}deg`, ...(bawah ? { bottom: `${t.b}%` } : { top: `${t.b}%` }) }}>
            <motion.div
              style={{ originY: bawah ? 1 : 0 }}
              variants={{
                hidden: { scaleY: 0.35, scaleX: 0.7, rotate: i % 2 ? 14 : -14, opacity: 0 },
                show: { scaleY: 1, scaleX: 1, rotate: 0, opacity: 1, transition: { type: "spring", stiffness: 60, damping: 11, delay: i * 0.08 } },
              }}
            >
              <div className={bawah ? s.goyang : s.ayun} style={{ animationDelay: `${-i * 1.7}s`, animationDuration: `${6 + (i % 3) * 1.5}s` }}>
                <Image src={a.src} alt="" width={a.w} height={a.h} sizes={`${Math.round(t.w * 4.4)}px`} className={`h-auto w-full ${t.flip ? "-scale-x-100" : ""}`} />
              </div>
            </motion.div>
          </div>
        );
      })}
    </motion.div>
  );
}

// Satu tanaman besar di depan layar, di tepi kiri/kanan, bergerak lebih cepat dari halaman saat di-scroll
export function Depan({ a, sisi = "kiri", className = "", w = "48%" }: { a: NamaAset; sisi?: "kiri" | "kanan"; className?: string; w?: string }) {
  const img = ASET[a];
  return (
    <div className={`${s.wadahDepan} pointer-events-none relative z-30 h-0 ${className}`} aria-hidden="true">
      <div
        className={`${sisi === "kiri" ? s.depanKiri : s.depanKanan} absolute top-0`}
        style={{ width: w, [sisi === "kiri" ? "left" : "right"]: "-16%" }}
      >
        <Image src={img.src} alt="" width={img.w} height={img.h} sizes="220px" className={`h-auto w-full ${sisi === "kanan" ? "-scale-x-100" : ""}`} />
      </div>
    </div>
  );
}

// Foto dalam bingkai emas ganda, berbentuk oval atau lengkung (arch), dihiasi rumpun mawar kecil
export function Bingkai({
  src,
  alt,
  bentuk = "oval",
  className = "",
  sizes,
  preload,
  hiasan = true,
  cermin = false,
  posisi = "50% 30%",
  fotoClass = "",
}: {
  src: string;
  alt: string;
  bentuk?: "oval" | "lengkung";
  className?: string;
  sizes: string;
  preload?: boolean;
  hiasan?: boolean;
  cermin?: boolean; // hiasan bunga dibalik kiri-kanan (fotonya tetap)
  posisi?: string;
  fotoClass?: string; // mis. efek parallax pada foto di dalam bingkai
}) {
  const radius = bentuk === "oval" ? "rounded-[50%]" : "rounded-t-full rounded-b-[1.25rem]";
  return (
    <div className={`relative ${className}`}>
      <div className={`${s.emas} ${radius} relative h-full w-full p-[3px] shadow-[0_24px_50px_-18px_rgb(0_0_0/0.85)]`}>
        <div className={`${s.garisDalam} ${radius} relative h-full w-full overflow-hidden bg-[#0f1f16]`}>
          <div className={`absolute inset-y-[-8%] inset-x-0 ${fotoClass}`}>
            <Image src={src} alt={alt} fill preload={preload} sizes={sizes} className="object-cover" style={{ objectPosition: posisi }} />
          </div>
        </div>
      </div>
      {hiasan && <Rumpun items={RUMPUN_BINGKAI} className={`inset-x-0 bottom-0 h-1/2 ${cermin ? "-scale-x-100" : ""}`} />}
    </div>
  );
}
