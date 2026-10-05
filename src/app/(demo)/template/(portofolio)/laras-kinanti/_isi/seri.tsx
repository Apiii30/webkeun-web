"use client";

import { motion, type MotionValue, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { type Seri as TSeri, seri } from "./data";
import { JUDUL, MONO, SERIF } from "./gaya";
import { useDiam } from "./diam";
import s from "./laras.module.css";

// Lembaran "Seri": naik menutupi pembuka (margin negatif = tinggi satu layar), lalu kartu-kartu seri yang
// sticky dan saling menumpuk. Kartu yang sedang tertutup mengecil & meredup; fotonya bergerak lebih lambat
// dari kartunya (parallax). Tiap kartu bisa dibuka jadi galeri layar penuh.
// Foto sampul dimuat eager: lazy loading bawaan Chrome tidak terpicu untuk kartu sticky yang di-scale.

export function Seri({ onBuka }: { onBuka: (seri: number) => void }) {
  const diam = useDiam();
  const tumpuk = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: tumpuk, offset: ["start start", "end end"] });
  return (
    <section id="seri" className={`relative z-10 ${diam ? "" : "-mt-[100svh]"}`}>
      <div className={s.tepiFilm} aria-hidden="true" />
      <Pengantar />
      <div ref={tumpuk} className="relative bg-[#0d0b09]">
        {seri.map((x, i) => (
          <Kartu key={x.no} x={x} i={i} n={seri.length} p={p} diam={diam} onBuka={() => onBuka(i)} />
        ))}
      </div>
    </section>
  );
}

function Pengantar() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const geser = useTransform(p, [0, 1], ["8vw", "-10vw"]);
  return (
    <div ref={ref} className="overflow-hidden bg-[#ece5d8] px-[4vw] pt-14 pb-16 text-[#16130f] md:pt-20 md:pb-24">
      <div className={`${MONO} flex justify-between text-[11px] tracking-[0.12em] uppercase md:text-xs`}>
        <span>Karya pilihan</span>
        <span>2022 — 2025</span>
      </div>
      <motion.h2 style={{ x: geser }} className={`${JUDUL} mt-6 text-[30vw] leading-[0.78] whitespace-nowrap md:text-[19vw]`}>
        Seri foto
      </motion.h2>
      <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[1fr_1.4fr]">
        <p className={`${SERIF} max-w-[24ch] text-[1.75rem] leading-[1.15] md:text-[2.4vw]`}>
          Proyek pribadi yang saya kerjakan pelan-pelan, di sela pesanan.
        </p>
        <ol className={`${MONO} text-xs uppercase md:text-[13px]`}>
          {seri.map((x) => (
            <li key={x.no}>
              <a href={`#seri-${x.no}`} className="group flex items-baseline gap-3 border-t border-[#16130f]/25 py-3.5 last:border-b">
                <span className="text-[#c9361f]">{x.no}</span>
                <span className="font-medium transition-transform duration-300 group-hover:translate-x-1.5">{x.judul}</span>
                <span className="flex-1 translate-y-[-0.2em] border-b border-dotted border-[#16130f]/30" />
                <span className="text-[#16130f]/60">
                  {x.tahun} · {x.frame} frame
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Kartu({ x, i, n, p, diam, onBuka }: { x: TSeri; i: number; n: number; p: MotionValue<number>; diam: boolean; onBuka: () => void }) {
  // Titik progres harus di dalam 0..1 (motion menjalankannya lewat Web Animations). Kartu pertama sudah di
  // tempat sejak awal; kartu terakhir tidak pernah tertutup.
  const a = (i - 1) / (n - 1);
  const b = i / (n - 1);
  const c = (i + 1) / (n - 1);
  const akhir = i === n - 1;
  const skala = useTransform(p, akhir ? [0, 1] : [b, c], akhir ? [1, 1] : [1, 0.9]);
  const redup = useTransform(p, akhir ? [0, 1] : [b, c], akhir ? [0, 0] : [0, 0.6]);
  const fotoY = useTransform(
    p,
    i === 0 ? [0, c] : akhir ? [a, 1] : [a, b, c],
    i === 0 ? ["0%", "9%"] : akhir ? ["-14%", "0%"] : ["-14%", "0%", "9%"],
  );
  return (
    <motion.article
      id={`seri-${x.no}`}
      style={{ scale: diam ? 1 : skala, backgroundColor: x.warna.bg, color: x.warna.fg }}
      className="sticky top-0 h-svh origin-top overflow-hidden"
    >
      <div className="flex h-full flex-col gap-5 px-[4vw] pt-[4.4rem] pb-5 md:grid md:grid-cols-[1.15fr_1fr] md:gap-[4vw] md:pt-24 md:pb-[3.5vw]">
        <div className="relative min-h-0 flex-1 overflow-hidden md:h-full">
          <motion.div style={diam ? undefined : { y: fotoY }} className="absolute inset-x-0 -inset-y-[12%]">
            <Image src={x.sampul.src} alt={x.sampul.alt} fill loading="eager" sizes="(min-width: 768px) 55vw, 92vw" className="object-cover" />
          </motion.div>
          <p className={`${MONO} absolute bottom-3 left-3 bg-black/45 px-2 py-1 text-[10px] tracking-[0.1em] text-white uppercase`}>
            {x.no}A · {x.tempat}
          </p>
        </div>

        <div className="flex shrink-0 flex-col md:justify-between">
          <div className={`${MONO} flex justify-between text-[11px] tracking-[0.12em] uppercase opacity-75 md:text-xs`}>
            <span>
              Seri {x.no} / {String(n).padStart(2, "0")}
            </span>
            <span>
              {x.tahun} · {x.frame} frame
            </span>
          </div>
          <div className="mt-3 md:mt-0">
            <h3 className={`${JUDUL} text-[14vw] leading-[0.84] md:text-[6.6vw]`}>{x.judul}</h3>
            <p className={`${SERIF} mt-2 text-[1.6rem] leading-none md:mt-3 md:text-[2.1vw]`} style={{ color: x.warna.aksen }}>
              {x.tempat}
            </p>
            <p className="mt-3 max-w-[42ch] text-[14.5px] leading-relaxed opacity-80 md:mt-5 md:text-[1.05rem]">{x.isi}</p>
          </div>
          <div className="mt-5 flex items-end justify-between gap-4 md:mt-0">
            <LembarKontak x={x} />
            <button
              type="button"
              onClick={onBuka}
              className={`${MONO} group flex shrink-0 items-center gap-2 border-b-2 pb-1 text-xs font-medium tracking-[0.1em] uppercase md:text-sm`}
              style={{ borderColor: x.warna.aksen }}
            >
              Lihat seri · {x.foto.length}
              <svg viewBox="0 0 14 14" className="size-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M3 11 11 3M4.5 3H11v6.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {!diam && <motion.div style={{ opacity: redup }} className="pointer-events-none absolute inset-0 bg-black" />}
    </motion.article>
  );
}

// Tiga frame kecil seperti lembar kontak; satu dilingkari spidol saat terlihat
function LembarKontak({ x }: { x: TSeri }) {
  return (
    <div className="flex gap-1.5" aria-hidden="true">
      {x.foto.slice(1, 4).map((f, k) => (
        <div key={f.src} className="relative">
          <div className="relative aspect-[4/5] w-11 overflow-hidden md:w-16">
            <Image src={f.src} alt="" fill sizes="64px" className="object-cover" />
          </div>
          <p className={`${MONO} mt-1 text-[9px] opacity-60`}>
            {x.no}
            {String.fromCharCode(66 + k)}
          </p>
          {k === 1 && (
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute -inset-x-2.5 -top-2.5 -bottom-1 overflow-visible">
              <motion.path
                d="M54 5C82 3 97 22 96 50 95 80 73 97 46 95 19 93 3 75 5 47 7 21 27 6 60 9"
                fill="none"
                stroke={x.warna.aksen}
                strokeWidth="2.6"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 1 }}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
