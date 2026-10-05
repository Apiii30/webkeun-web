"use client";

import { motion, type MotionValue, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import s from "./bahtera.module.css";
import { armada } from "./data";
import { useDiam } from "./diam";
import { MONO, STENSIL } from "./gaya";

// Armada: truk trailer (digambar SVG) melaju melintasi jalan mengikuti scroll; rodanya berputar dan marka
// jalan bergeser berlawanan arah, jadi terasa bergerak walau scroll pelan.

const total = armada.reduce((a, [, n]) => a + n, 0);

export function Armada() {
  const ref = useRef<HTMLElement>(null);
  const diam = useDiam();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const truk = useTransform(p, [0.15, 0.85], ["-60%", "130%"]);
  const marka = useTransform(p, [0, 1], ["0rem", "-36rem"]);
  const roda = useTransform(p, [0, 1], [0, 1440]);

  return (
    <section ref={ref} id="armada" className="relative overflow-hidden bg-[#18212d] pt-20 text-[#eeeae1] md:pt-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[1fr_1.1fr] md:px-8">
        <div>
          <p className={`${MONO} text-[11px] tracking-[0.16em] text-[#f2b33d] uppercase md:text-xs`}>● Armada</p>
          <h2 className={`${STENSIL} mt-3 text-[12vw] leading-[0.88] md:text-[5vw]`}>
            Truk sendiri,
            <br />
            sopir sendiri
          </h2>
          <p className="mt-5 max-w-[42ch] text-[15px] leading-relaxed text-[#eeeae1]/70 md:text-base">
            Semua unit milik perusahaan, dirawat di bengkel kami di Margomulyo, dan terpantau GPS 24 jam. Kalau ada kendala di jalan, kami yang
            pertama tahu.
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-px self-end overflow-hidden rounded border border-[#eeeae1]/15 bg-[#eeeae1]/15 sm:grid-cols-3">
          {armada.map(([nama, n]) => (
            <div key={nama} className="bg-[#18212d] p-4">
              <dt className={`${MONO} text-[11px] text-[#eeeae1]/60 uppercase`}>{nama}</dt>
              <dd className={`${STENSIL} mt-1 text-4xl leading-none`}>{n}</dd>
            </div>
          ))}
          <div className="bg-[#f2b33d] p-4 text-[#10213a]">
            <dt className={`${MONO} text-[11px] uppercase`}>Total unit</dt>
            <dd className={`${STENSIL} mt-1 text-4xl leading-none`}>{total}</dd>
          </div>
        </dl>
      </div>

      {/* jalan */}
      <div className="relative mt-16 h-44 md:mt-20 md:h-56" aria-hidden="true">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[#252f3d] md:h-28">
          <motion.div style={diam ? undefined : { x: marka }} className={`${s.marka} absolute inset-y-[46%] -right-[40rem] left-0 opacity-70`} />
          <span className="absolute inset-x-0 top-0 h-1 bg-[#eeeae1]/25" />
        </div>
        <motion.div style={diam ? { x: "30%" } : { x: truk }} className="absolute bottom-[3.4rem] left-0 w-[88vw] max-w-[620px] md:bottom-[4.2rem] md:w-[46vw]">
          <Truk roda={diam ? undefined : roda} />
        </motion.div>
      </div>

      <div className="grid grid-cols-2">
        {["truk-kota", "gudang-gelap"].map((n, i) => (
          <div key={n} className="relative aspect-[4/3] md:aspect-[16/9]">
            <Image src={`/company-profile/bahtera/${n}.webp`} alt={i ? "Forklift di gudang yang remang" : "Truk boks di jalan kota"} fill sizes="50vw" className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}

function Truk({ roda }: { roda?: MotionValue<number> }) {
  return (
    <svg viewBox="0 0 520 160" className="h-auto w-full overflow-visible">
      <defs>
        <pattern id="bh-seng" width="12" height="10" patternUnits="userSpaceOnUse">
          <rect width="12" height="10" fill="#b8432f" />
          <rect width="4" height="10" fill="#9c3624" />
        </pattern>
      </defs>
      {/* trailer kontainer */}
      <rect x="118" y="16" width="394" height="108" rx="3" fill="url(#bh-seng)" />
      <rect x="118" y="16" width="394" height="8" fill="#6e2518" />
      <rect x="118" y="116" width="394" height="8" fill="#6e2518" />
      <text x="315" y="84" textAnchor="middle" className="font-[family-name:var(--font-stensil)] text-[44px] font-bold" fill="#eeeae1" letterSpacing="3">
        BAHTERA
      </text>
      <text x="315" y="104" textAnchor="middle" className="font-[family-name:var(--font-jetbrains)] text-[11px]" fill="#eeeae1" opacity="0.8">
        BHTU 260451 3 · 40 FT
      </text>
      {/* sasis */}
      <rect x="40" y="124" width="472" height="9" fill="#10213a" />
      {/* kabin */}
      <path d="M14 132 L14 62 Q16 40 42 38 L92 38 Q108 38 110 54 L112 132 Z" fill="#1f3a5f" />
      <path d="M24 50 L64 50 L64 80 L22 80 Z" fill="#9fb6cc" />
      <rect x="74" y="50" width="28" height="30" rx="2" fill="#163050" />
      <rect x="8" y="96" width="14" height="10" rx="2" fill="#f2b33d" />
      <rect x="112" y="60" width="6" height="64" fill="#10213a" />
      {/* roda */}
      {[54, 164, 196, 424, 456, 488].map((x) => (
        <Roda key={x} x={x} putar={roda} />
      ))}
    </svg>
  );
}

function Roda({ x, putar }: { x: number; putar?: MotionValue<number> }) {
  return (
    <g transform={`translate(${x} 138)`}>
      <motion.g style={putar ? { rotate: putar } : undefined}>
        <circle r="17" fill="#0d1520" />
        <circle r="9" fill="#8b96a1" />
        <path d="M0 -9V9M-9 0H9" stroke="#0d1520" strokeWidth="2.5" />
      </motion.g>
    </g>
  );
}
