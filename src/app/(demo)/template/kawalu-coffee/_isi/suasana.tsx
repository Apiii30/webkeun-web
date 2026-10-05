"use client";

import { motion, type MotionValue, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { fasilitas, suasana } from "./data";
import { useDiam } from "./diam";
import { JUDUL, MONO, TANGAN } from "./gaya";

// Suasana kedai: tiga kolom foto yang bergerak beda arah & kecepatan saat digulir (di HP dua kolom).

const GERAK = [
  ["4%", "-14%"],
  ["-12%", "6%"],
  ["10%", "-20%"],
];

export function Suasana() {
  const ref = useRef<HTMLElement>(null);
  const diam = useDiam();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <section ref={ref} id="suasana" className="relative overflow-hidden bg-[#f3ead8] py-20 text-[#22140e] md:py-28">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 md:grid-cols-[1fr_1fr] md:items-end md:px-8">
        <div>
          <p className={`${MONO} text-[11px] tracking-[0.16em] uppercase md:text-xs`}>
            <span className="text-[#c3312b]">●</span> Suasana
          </p>
          <h2 className={`${JUDUL} mt-3 text-[15vw] leading-[0.82] md:text-[7vw]`}>
            Betah
            <br />
            lama-lama
          </h2>
          <p className={`${TANGAN} mt-3 text-[1.7rem] leading-tight text-[#c3312b]`}>nugas, meeting, atau cuma bengong. bebas.</p>
        </div>
        <ul className="flex flex-wrap gap-2 md:justify-end">
          {fasilitas.map((f) => (
            <li key={f} className="rounded-full border-2 border-[#22140e]/80 px-4 py-2 text-sm font-semibold">
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-3 px-5 md:mt-16 md:grid-cols-3 md:gap-5 md:px-8">
        {suasana.map((kolom, i) => (
          <Kolom key={i} i={i} p={p} diam={diam} foto={kolom} />
        ))}
      </div>
    </section>
  );
}

function Kolom({ i, p, diam, foto }: { i: number; p: MotionValue<number>; diam: boolean; foto: (typeof suasana)[number] }) {
  const y = useTransform(p, [0, 1], GERAK[i]);
  return (
    <motion.div style={diam ? undefined : { y }} className={`flex flex-col gap-3 md:gap-5 ${i === 2 ? "hidden md:flex" : ""} ${i === 1 ? "pt-16" : ""}`}>
      {foto.map((f, k) => (
        <div key={f.src} className={`relative overflow-hidden rounded-[1.2rem] ${k === 1 ? "aspect-[4/5]" : "aspect-[3/4]"}`}>
          <Image src={f.src} alt={f.alt} fill sizes="(min-width: 768px) 30vw, 46vw" className="object-cover" />
        </div>
      ))}
    </motion.div>
  );
}
