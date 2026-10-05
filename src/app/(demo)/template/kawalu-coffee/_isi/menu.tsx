"use client";

import { AnimatePresence, motion, type MotionValue, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { andalan, type Item, menu } from "./data";
import { useDiam } from "./diam";
import { JUDUL, MONO, TANGAN } from "./gaya";
import s from "./kawalu.module.css";

// Menu di atas "kolam espresso": tepi atas berupa permukaan kopi yang beriak, tepi bawah meneteskan kopi ke
// bagian berikutnya (tetesannya memanjang saat digulir). Tiga kartu andalan bergerak beda kecepatan; papan
// menu punya tab kategori, dan di laptop foto menu yang disorot muncul di samping.

export function Menu() {
  const ref = useRef<HTMLElement>(null);
  const diam = useDiam();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <section ref={ref} id="menu" className="relative z-10 bg-[#22140e] pt-16 pb-20 text-[#f3ead8] md:pt-24 md:pb-28">
      {/* permukaan kopi */}
      <div className="absolute inset-x-0 -top-[27px] h-7 overflow-hidden" aria-hidden="true">
        <div className={`${s.ombak} flex h-full w-[200%]`}>
          {[0, 1].map((k) => (
            <svg key={k} viewBox="0 0 720 28" preserveAspectRatio="none" className="h-full w-1/2">
              <path d="M0 28 V16 Q45 2 90 16 T180 16 T270 16 T360 16 T450 16 T540 16 T630 16 T720 16 V28Z" fill="#22140e" />
            </svg>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className={`${MONO} text-[11px] tracking-[0.16em] text-[#c98a3c] uppercase md:text-xs`}>● Menu</p>
            <h2 className={`${JUDUL} mt-3 text-[15vw] leading-[0.82] md:text-[7.5vw]`}>
              Diseduh pas
              <br />
              kamu pesan
            </h2>
          </div>
          <p className={`${TANGAN} max-w-[16ch] -rotate-2 text-[1.9rem] leading-[1.05] text-[#e7a865] md:pb-4 md:text-[2.3rem]`}>
            harga dalam ribuan, udah termasuk pajak
          </p>
        </div>

        {/* tiga andalan */}
        <div className="mt-12 grid grid-cols-2 gap-3 md:mt-16 md:grid-cols-3 md:gap-6">
          {andalan.map((a, i) => (
            <Andalan key={a.nama} a={a} i={i} p={p} diam={diam} />
          ))}
        </div>

        <Papan />
      </div>

      <Tetesan p={p} diam={diam} />
    </section>
  );
}

const GESER = [
  ["40px", "-50px"],
  ["-30px", "60px"],
  ["90px", "-20px"],
];

function Andalan({ a, i, p, diam }: { a: (typeof andalan)[number]; i: number; p: MotionValue<number>; diam: boolean }) {
  const y = useTransform(p, [0.05, 0.6], GESER[i]);
  return (
    <motion.figure style={diam ? undefined : { y }} className={`relative ${i === 2 ? "col-span-2 md:col-span-1" : ""}`}>
      <div className={`relative overflow-hidden rounded-[1.4rem] ${i === 2 ? "aspect-[16/10] md:aspect-[3/4]" : "aspect-[3/4]"}`}>
        <Image src={a.f.src} alt={a.f.alt} fill sizes="(min-width: 768px) 30vw, 46vw" className="object-cover transition-transform duration-700 hover:scale-105" />
        <span className={`${MONO} absolute top-3 right-3 rounded-full bg-[#f3ead8] px-2.5 py-1 text-xs font-bold text-[#22140e] md:text-sm`}>{a.harga}</span>
      </div>
      <figcaption className="mt-3 flex flex-col gap-1 md:flex-row md:items-start md:justify-between md:gap-2">
        <span className={`${JUDUL} text-xl leading-[0.95] md:text-3xl`}>{a.nama}</span>
        <span className={`${TANGAN} rotate-[-3deg] text-lg leading-none text-[#e7a865] md:shrink-0 md:text-2xl`}>{a.catatan}</span>
      </figcaption>
    </motion.figure>
  );
}

function Papan() {
  const [tab, setTab] = useState(0);
  const daftar = menu[tab].item;
  const pertama = daftar.find((x) => x.f)?.f ?? menu[0].item[0].f!;
  const [sorot, setSorot] = useState<Item | null>(null);
  const foto = sorot?.f ?? pertama;

  return (
    <div className="mt-20 md:mt-28">
      <div role="tablist" aria-label="Kategori menu" className="flex flex-wrap gap-2">
        {menu.map((m, i) => (
          <button
            key={m.kategori}
            role="tab"
            aria-selected={tab === i}
            onClick={() => {
              setTab(i);
              setSorot(null);
            }}
            className={`relative rounded-full px-5 py-2.5 text-sm font-bold transition-colors md:text-base ${tab === i ? "text-[#22140e]" : "text-[#f3ead8]/70 hover:text-[#f3ead8]"}`}
          >
            {tab === i && <motion.span layoutId="kw-tab" className="absolute inset-0 rounded-full bg-[#f3ead8]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
            <span className="relative">{m.kategori}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
        {/* foto menu yang disorot (laptop) */}
        <div className="relative hidden md:block">
          <div className="sticky top-24 aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-[#3a2418]">
            <AnimatePresence initial={false}>
              <motion.div
                key={foto.src}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image src={foto.src} alt={foto.alt} fill sizes="34vw" className="object-cover" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.ul key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} role="tabpanel">
            {daftar.map((x) => (
              <li
                key={x.nama}
                onPointerEnter={(e) => e.pointerType === "mouse" && x.f && setSorot(x)}
                className="group flex gap-4 border-b border-[#f3ead8]/15 py-5 first:pt-0"
              >
                {x.f && (
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl md:hidden">
                    <Image src={x.f.src} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-lg leading-tight font-bold transition-colors group-hover:text-[#e7a865] md:text-xl">{x.nama}</h3>
                    <span className="flex-1 translate-y-[-0.25em] border-b-2 border-dotted border-[#f3ead8]/25" />
                    <span className={`${MONO} text-base font-bold md:text-lg`}>{x.harga}</span>
                  </div>
                  {x.isi && <p className="mt-1 text-[15px] text-[#f3ead8]/60">{x.isi}</p>}
                  {x.andalan && (
                    <p className={`${TANGAN} mt-1 flex items-center gap-1.5 text-xl leading-none text-[#e7a865]`}>
                      <svg viewBox="0 0 30 14" className="h-3 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <path d="M28 4C20 10 10 11 3 6M3 6l5-4M3 6l6 3" />
                      </svg>
                      {x.andalan}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Tetesan kopi di tepi bawah; memanjang saat bagian ini mulai keluar layar
const TETES: [number, number, number][] = [
  // [kiri %, lebar px, panjang svh]
  [4, 26, 9],
  [13, 16, 5],
  [27, 34, 13],
  [41, 18, 6],
  [56, 28, 10],
  [68, 14, 4],
  [79, 30, 12],
  [92, 20, 7],
];

function Tetesan({ p, diam }: { p: MotionValue<number>; diam: boolean }) {
  const panjang = useTransform(p, [0.55, 0.95], [0.25, 1]);
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[calc(100%-1px)] h-[14svh]" aria-hidden="true">
      {TETES.map(([kiri, lebar, tinggi]) => (
        <motion.span
          key={kiri}
          style={{ left: `${kiri}%`, width: lebar, height: `${tinggi}svh`, scaleY: diam ? 1 : panjang }}
          className="absolute top-0 origin-top rounded-b-full bg-[#22140e]"
        />
      ))}
    </div>
  );
}
