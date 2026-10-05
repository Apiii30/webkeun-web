"use client";

import { motion, type MotionValue, useMotionTemplate, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { rol } from "./data";
import { JUDUL, MONO, SERIF } from "./gaya";
import { useDiam } from "./diam";
import s from "./laras.module.css";

// Potret pesanan sebagai satu pita film. Panggungnya sticky; scroll ke bawah menggeser pita ke kiri (sejauh
// lebar pita dikurangi lebar layar, dihitung CSS lewat calc(100cqw - 100%)), sementara tulisan raksasa di
// belakangnya bergeser berlawanan arah dan foto di tiap frame bergeser pelan di dalam bingkainya.
// "Kurangi gerakan": pita jadi deretan biasa yang bisa digeser manual.

export function Rol() {
  const ref = useRef<HTMLElement>(null);
  const diam = useDiam();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const geser = useMotionTemplate`translateX(calc(${p} * (100cqw - 100%)))`;
  const latar = useTransform(p, [0, 1], ["4%", "-38%"]);
  const fotoX = useTransform(p, [0, 1], ["-7%", "7%"]);

  return (
    <section ref={ref} id="potret" className={`relative bg-[#ece5d8] text-[#16130f] ${diam ? "" : "h-[380svh]"}`}>
      <div className={`${diam ? "py-24" : "sticky top-0 h-svh"} flex flex-col justify-center overflow-hidden [container-type:inline-size]`}>
        {/* tulisan raksasa di belakang */}
        <motion.p
          style={diam ? undefined : { x: latar }}
          className={`${JUDUL} ${s.garis} pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 text-[42vw] leading-none whitespace-nowrap text-[#16130f]/18 md:text-[30vw]`}
          aria-hidden="true"
        >
          Potret pesanan
        </motion.p>

        <div className="relative px-[4vw]">
          <p className={`${MONO} flex justify-between text-[11px] tracking-[0.12em] uppercase md:text-xs`}>
            <span>
              <span className="text-[#c9361f]">●</span> Rol 07 — Potret pesanan
            </span>
            <span className="hidden md:inline">Geser terus ke bawah</span>
          </p>
        </div>

        <div className={`mt-6 -rotate-[2.5deg] md:mt-8 ${diam ? "overflow-x-auto" : ""}`}>
          <motion.div style={diam ? undefined : { transform: geser }} className={`${s.film} flex w-max items-stretch gap-3 pr-[4vw] pl-[4vw] md:gap-4`}>
            <div className="flex w-[64vw] shrink-0 flex-col justify-between py-2 pr-4 text-[#ece5d8] md:w-[26vw]">
              <p className={`${MONO} text-[10px] tracking-[0.14em] text-[#e39b3a] uppercase`}>WK 400 · 36 exp</p>
              <div>
                <h2 className={`${JUDUL} text-[15vw] leading-[0.82] md:text-[6.4vw]`}>Potret pesanan</h2>
                <p className={`${SERIF} mt-3 text-xl leading-snug text-[#ece5d8]/80 md:text-[1.7vw]`}>
                  Orang-orang yang minta dipotret, dan tetap jadi diri mereka sendiri.
                </p>
              </div>
            </div>
            {rol.map((r, i) => (
              <Frame key={r.f.src} r={r} i={i} x={diam ? undefined : fotoX} />
            ))}
            <a
              href="#layanan"
              className="group flex w-[56vw] shrink-0 flex-col justify-between bg-[#c9361f] p-5 text-[#ece5d8] md:w-[20vw] md:p-6"
            >
              <span className={`${MONO} text-[10px] tracking-[0.14em] uppercase`}>Frame 37</span>
              <span className={`${JUDUL} text-[11vw] leading-[0.85] md:text-[4.2vw]`}>
                Giliran
                <br />
                kamu?
              </span>
              <span className={`${MONO} flex items-center gap-2 text-xs uppercase`}>
                Lihat harga
                <svg viewBox="0 0 14 14" className="size-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M1 7h11M8 3l4 4-4 4" />
                </svg>
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Frame({ r, i, x }: { r: (typeof rol)[number]; i: number; x?: MotionValue<string> }) {
  const no = 8 + i;
  return (
    <figure className="flex w-[66vw] shrink-0 flex-col md:w-[24vw]">
      <div className={`${MONO} flex justify-between pb-1.5 text-[10px] tracking-[0.1em] text-[#e39b3a]`}>
        <span>▸ {no}</span>
        <span>{no}A</span>
      </div>
      <div className="relative h-[46svh] overflow-hidden md:h-[52svh]">
        <motion.div style={x ? { x } : undefined} className="absolute inset-y-0 -inset-x-[9%]">
          <Image src={r.f.src} alt={r.f.alt} fill loading="eager" sizes="(min-width: 768px) 30vw, 80vw" className="object-cover" />
        </motion.div>
      </div>
      <figcaption className={`${MONO} pt-2 text-[10px] tracking-[0.08em] text-[#ece5d8]/75 uppercase md:text-[11px]`}>{r.ket}</figcaption>
    </figure>
  );
}
