"use client";

import { motion, type MotionValue, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { biji, kedai, waPesan } from "./data";
import { useDiam } from "./diam";
import { JUDUL, MONO, TANGAN } from "./gaya";
import s from "./kawalu.module.css";

// Biji kopi untuk dibawa pulang. Kemasannya digambar dengan CSS (kertas kraft + label warna), naik dengan
// kecepatan berbeda saat digulir; tulisan raksasa di belakang bergeser ke samping.

export function Biji() {
  const ref = useRef<HTMLElement>(null);
  const diam = useDiam();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const latar = useTransform(p, [0, 1], ["6%", "-34%"]);

  return (
    <section ref={ref} id="biji" className="relative overflow-hidden bg-[#2f4b2f] py-20 text-[#f3ead8] md:py-28">
      <motion.p
        style={diam ? undefined : { x: latar }}
        className={`${JUDUL} ${s.garis} pointer-events-none absolute top-10 left-0 text-[38vw] leading-none whitespace-nowrap text-[#f3ead8]/15 md:text-[22vw]`}
        aria-hidden="true"
      >
        Sangrai tiap Senin
      </motion.p>

      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <p className={`${MONO} text-[11px] tracking-[0.16em] text-[#e7c27f] uppercase md:text-xs`}>● Biji kopi</p>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className={`${JUDUL} text-[15vw] leading-[0.82] md:text-[7vw]`}>
            Bawa pulang
            <br />
            bijinya
          </h2>
          <p className="max-w-sm text-[16px] leading-relaxed text-[#f3ead8]/75 md:pb-2">
            Biji yang sama dengan yang kami seduh di kedai, umur sangrai paling lama seminggu. Bisa digiling sesuai alat seduhmu.
          </p>
        </div>

        <div className="mt-14 grid gap-14 sm:grid-cols-2 md:mt-20 md:grid-cols-3 md:gap-8">
          {biji.map((b, i) => (
            <Kemasan key={b.nama} b={b} i={i} p={p} diam={diam} />
          ))}
        </div>
      </div>
    </section>
  );
}

const NAIK = [
  ["60px", "-40px"],
  ["130px", "-60px"],
  ["30px", "-20px"],
];

function Kemasan({ b, i, p, diam }: { b: (typeof biji)[number]; i: number; p: MotionValue<number>; diam: boolean }) {
  const y = useTransform(p, [0.1, 0.75], NAIK[i]);
  return (
    <motion.div style={diam ? undefined : { y }} className="flex flex-col items-center">
      <motion.div whileHover={{ y: -10, rotate: i === 1 ? 2 : -2 }} transition={{ type: "spring", stiffness: 260, damping: 18 }} className="relative w-full max-w-[290px]">
        {/* kantong kraft */}
        <div className={`${s.kraft} relative aspect-[3/4] w-full rounded-b-[14px] px-[9%] pt-[16%] pb-[8%] text-[#22140e] shadow-[0_30px_40px_-26px_rgb(0_0_0/0.7)]`}>
          <span className="absolute top-[7%] left-1/2 h-[3px] w-[78%] -translate-x-1/2 rounded-full bg-black/15" />
          <span className="absolute top-[9.5%] right-[12%] size-4 rounded-full border-2 border-black/20 bg-[#b8966c]" />
          {/* label */}
          <div className="flex h-full flex-col rounded-[6px] px-4 py-4 text-[#f3ead8]" style={{ backgroundColor: b.warna }}>
            <div className="flex items-baseline justify-between">
              <span className={`${JUDUL} text-sm`}>Kawalu</span>
              <span className={`${MONO} text-[10px]`}>200 g</span>
            </div>
            <p className={`${JUDUL} mt-3 text-[2.05rem] leading-[0.86]`}>{b.nama}</p>
            <p className={`${TANGAN} mt-1 text-lg leading-none text-[#f3ead8]/85`}>{b.jenis}</p>
            <dl className={`${MONO} mt-auto space-y-1 text-[10.5px] leading-snug`}>
              <div className="flex justify-between gap-2 border-t border-[#f3ead8]/30 pt-1.5">
                <dt className="opacity-70">Asal</dt>
                <dd className="text-right">{b.asal}</dd>
              </div>
              <div className="flex justify-between gap-2 border-t border-[#f3ead8]/30 pt-1.5">
                <dt className="opacity-70">Proses</dt>
                <dd>{b.proses}</dd>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-[#f3ead8]/30 pt-1.5">
                <dt className="opacity-70">Sangrai</dt>
                <dd className="flex gap-1" aria-label={`Tingkat sangrai ${b.sangrai} dari 5`}>
                  {Array.from({ length: 5 }, (_, k) => (
                    <span key={k} className={`size-2 rounded-full ${k < b.sangrai ? "bg-[#f3ead8]" : "border border-[#f3ead8]/60"}`} />
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 w-full max-w-[290px]">
        <p className="text-[15px] text-[#f3ead8]/75">{b.rasa.join(" · ")}</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className={`${MONO} text-xl font-bold`}>{b.harga}</p>
          <a
            href={waPesan(`Halo ${kedai.nama}! Aku mau pesan biji ${b.nama} 200 g. Digiling untuk: `)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#f3ead8] px-5 py-2.5 text-sm font-bold text-[#22140e] transition-transform hover:-translate-y-0.5"
          >
            Pesan biji
          </a>
        </div>
      </div>
    </motion.div>
  );
}
