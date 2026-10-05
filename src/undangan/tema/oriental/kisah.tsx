"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { type CSSProperties, useRef } from "react";
import type { Undangan } from "../../types";
import { HALUS, Muncul, Pembatas, naskah, yuji } from "./hias";
import s from "./oriental.module.css";

// Kisah cinta "Benang Merah Takdir": menurut legenda Tionghoa, dua orang yang berjodoh sudah terikat benang merah sejak
// lahir. Tiap bab berupa kipas lipat berisi foto yang mengembang dari kiri ke kanan (atau sebaliknya) saat terlihat,
// lalu judul & ceritanya naik. Antarbab disambung benang merah yang tergambar turun dengan simpul
// keberuntungan di tengahnya. Semua animasi berbasis waktu (sekali saat terlihat), bukan mengikuti scroll.
// "Kurangi gerakan": kipas langsung terbuka.

export function Kisah({ u }: { u: Undangan }) {
  const foto = (i: number) => u.foto.galeri[(i * 2 + 1) % u.foto.galeri.length];
  return (
    <div className="relative">
      <div className="relative z-10 px-6 text-center">
        <Muncul>
          <p className={`${yuji} text-[10.5px] tracking-[0.42em] text-[#9e1c22] uppercase`}>Benang merah takdir</p>
        </Muncul>
        <Muncul jeda={0.1} dari="scale(0.82)">
          <h2 className={`${naskah} text-[3.7rem] leading-tight text-[#9e1c22]`}>Love Story</h2>
        </Muncul>
        <Muncul jeda={0.25}>
          <Pembatas />
        </Muncul>
      </div>
      <div className="relative mt-6">
        <Benang />
        {u.cerita.map((c, i) => (
          <div key={c.tahun}>
            <Bab c={c} i={i} foto={foto(i)} />
            {i < u.cerita.length - 1 && <Benang />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────── Satu bab: kipas foto + cerita ───────── */

function Bab({ c, i, foto }: { c: Undangan["cerita"][number]; i: number; foto: Undangan["foto"]["galeri"][number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const terlihat = useInView(ref, { once: true, amount: 0.55 });
  const kurangi = !!useReducedMotion();
  const buka = terlihat || kurangi;
  const balik = i % 2 === 1; // bab genap mengembang dari kanan
  const anim = buka ? "buka" : "tutup";

  return (
    <div ref={ref} className="relative px-6 text-center">
      <Kipas src={foto.src} alt={foto.alt} buka={buka} balik={balik} />

      <motion.div
        className="relative mt-[4.25rem]"
        initial={false}
        animate={anim}
        variants={{ tutup: { opacity: 0, transform: "translateY(22px)" }, buka: { opacity: 1, transform: "translateY(0px)", transition: { duration: 1, ease: HALUS, delay: 1.1 } } }}
      >
        <p className={`${yuji} text-[10.5px] tracking-[0.35em] text-[#9e1c22] uppercase`}>
          Bab {i + 1} · {c.tahun}
        </p>
        <h3 className={`${naskah} mt-1 text-[2.8rem] leading-none text-[#9e1c22]`}>{c.judul}</h3>
        <p className="mx-auto mt-2 max-w-[18rem] text-[15px] leading-relaxed text-[#3b1d16]">{c.isi}</p>
      </motion.div>
    </div>
  );
}

/* ───────── Kipas lipat berisi foto ───────── */

// Setengah lingkaran berporos di tengah bawah. Kipas "mengembang" dengan mask conic-gradient yang sudutnya (--a)
// dianimasikan 0° → 180°; foto, rusuk bambu & tepi kipas ikut tersingkap bersama. balik: mengembang dari kanan.
function Kipas({ src, alt, buka, balik }: { src: string; alt: string; buka: boolean; balik: boolean }) {
  const kipas = {
    maskImage: "conic-gradient(from 270deg at 50% 100%, #000 var(--a), transparent var(--a)), radial-gradient(circle at 50% 100%, transparent 15%, #000 15.5%)",
    WebkitMaskImage: "conic-gradient(from 270deg at 50% 100%, #000 var(--a), transparent var(--a)), radial-gradient(circle at 50% 100%, transparent 15%, #000 15.5%)",
    maskComposite: "intersect",
    WebkitMaskComposite: "source-in",
  } as CSSProperties;
  const rusuk = Array.from({ length: 13 }, (_, k) => 180 + k * 15); // sudut rusuk (derajat, 180 = kiri)
  return (
    <div className={`relative mx-auto w-[92%] ${balik ? "-scale-x-100" : ""}`}>
      <motion.div
        className="relative aspect-[2/1] drop-shadow-[0_16px_18px_rgb(60_15_10/0.35)]"
        initial={false}
        animate={buka ? { "--a": "180deg" } : { "--a": "0deg" }}
        transition={{ duration: 1.5, ease: [0.55, 0, 0.25, 1], delay: 0.2 }}
        style={{ "--a": "0deg" } as CSSProperties}
      >
        <div className="absolute inset-0" style={kipas}>
          {/* kertas kipas (tepi merah) lalu fotonya */}
          <div className="absolute inset-0 rounded-t-full bg-[#9e1c22]" />
          <div className="absolute inset-[3.5%_3.5%_0] overflow-hidden rounded-t-full bg-[#f8efdc]">
            <Image src={src} alt={alt} fill sizes="(min-width: 440px) 400px, 92vw" className={`object-cover object-[50%_35%] ${balik ? "-scale-x-100" : ""}`} />
            {/* lipatan kipas: bilah terang-gelap bergantian */}
            <div className="absolute inset-0 bg-[repeating-conic-gradient(from_270deg_at_50%_100%,rgb(255_255_255/0.1)_0deg_7.5deg,rgb(60_15_10/0.1)_7.5deg_15deg)]" />
          </div>
          {/* rusuk bambu & tepi emas */}
          <svg viewBox="0 0 200 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
            {rusuk.map((a) => {
              const r = (a * Math.PI) / 180;
              return (
                <line
                  key={a}
                  x1={100 + Math.round(Math.cos(r) * 15 * 100) / 100}
                  y1={100 + Math.round(Math.sin(r) * 15 * 100) / 100}
                  x2={100 + Math.round(Math.cos(r) * 96.5 * 100) / 100}
                  y2={100 + Math.round(Math.sin(r) * 96.5 * 100) / 100}
                  stroke="#f6dc94"
                  strokeOpacity=".45"
                  strokeWidth=".5"
                />
              );
            })}
            <path d="M3.5 100A96.5 96.5 0 0 1 196.5 100" fill="none" stroke="#f6dc94" strokeWidth="1.1" />
            <path d="M1 100A99 99 0 0 1 199 100" fill="none" stroke="#c99a3e" strokeWidth=".8" />
            <path d="M85 100A15 15 0 0 1 115 100" fill="none" stroke="#f6dc94" strokeWidth="1" />
          </svg>
        </div>
      </motion.div>
      {/* poros kipas & rumbai merah yang berayun */}
      <div className="absolute bottom-0 left-1/2 w-[12%] -translate-x-1/2 translate-y-1/2">
        <svg viewBox="0 0 24 24" className="relative z-10 w-full" aria-hidden="true">
          <circle cx="12" cy="12" r="7" fill="#9e1c22" stroke="#f6dc94" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="2.2" fill="#f6dc94" />
        </svg>
        <motion.div
          className="absolute top-[70%] left-1/2 w-[46%] -translate-x-1/2"
          initial={false}
          animate={buka ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <div className={s.ayunA} style={{ transformOrigin: "50% 0%" }}>
            <svg viewBox="0 0 10 40" className="w-full" aria-hidden="true">
              <path d="M5 0V12" stroke="#c99a3e" strokeWidth="1.2" />
              <circle cx="5" cy="13" r="2.4" fill="#c99a3e" />
              <path d="M2.5 15h5l1 25h-7Z" fill="#b3242b" />
              <path d="M3.5 16v22M5 16v23M6.5 16v22" stroke="#7d1418" strokeWidth=".4" />
            </svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ───────── Benang merah antarbab ───────── */

// Benang merah berkelok yang tergambar turun saat terlihat, dengan simpul keberuntungan (中国结) di tengahnya
function Benang() {
  const ref = useRef<HTMLDivElement>(null);
  const terlihat = useInView(ref, { once: true, amount: 0.8 });
  const kurangi = !!useReducedMotion();
  const tampil = terlihat || kurangi;
  return (
    <div ref={ref} className="relative mx-auto my-3 h-28 w-16" aria-hidden="true">
      <svg viewBox="0 0 64 112" className="absolute inset-0 h-full w-full overflow-visible">
        <motion.path
          d="M32 0C52 18 12 36 32 56S12 94 32 112"
          fill="none"
          stroke="#b3242b"
          strokeWidth="1.8"
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: tampil ? 1 : 0 }}
          transition={{ duration: 1.3, ease: "easeInOut" }}
        />
      </svg>
      <motion.div
        className="absolute top-1/2 left-1/2 w-8"
        initial={false}
        animate={tampil ? { opacity: 1, transform: "translate(-50%, -50%) scale(1) rotate(0deg)" } : { opacity: 0, transform: "translate(-50%, -50%) scale(0.3) rotate(-90deg)" }}
        transition={{ duration: 0.9, ease: HALUS, delay: 0.5 }}
      >
        <svg viewBox="0 0 32 32" className="w-full">
          <g transform="rotate(45 16 16)">
            <rect x="8" y="8" width="16" height="16" rx="3" fill="none" stroke="#b3242b" strokeWidth="2.2" />
            <rect x="11.5" y="11.5" width="9" height="9" rx="2" fill="#b3242b" stroke="#f6dc94" strokeWidth=".9" />
            {[
              [8, 16],
              [24, 16],
              [16, 8],
              [16, 24],
            ].map(([x, y]) => (
              <circle key={`${x}${y}`} cx={x} cy={y} r="2.4" fill="none" stroke="#b3242b" strokeWidth="1.8" />
            ))}
          </g>
          <circle cx="16" cy="16" r="1.6" fill="#f6dc94" />
        </svg>
      </motion.div>
    </div>
  );
}
