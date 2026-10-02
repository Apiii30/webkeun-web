"use client";

import { AnimatePresence, MotionConfig, motion, type Variants } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useBukaUndangan, useParalaks } from "../../pakai";
import type { Undangan } from "../../types";
import { Isi } from "./bagian";
import { Daun, Kerlip, Monogram, bodoni } from "./hias";
import { tombolEmas } from "./interaktif";
import s from "./luxury.module.css";

// Kerangka tema Luxury: sampul foto penuh yang terangkat seperti tirai saat dibuka, kolom undangan,
// latar espresso di layar lebar, dan navigasi bawah. Tampilan khusus HP; di layar lebar tetap selebar HP.

const ease = [0.22, 1, 0.36, 1] as const;

export function Luxury({ data: u, tamu }: { data: Undangan; tamu?: string }) {
  const { opened, open } = useBukaUndangan({ halus: false });
  const paralaks = useParalaks();

  return (
    <MotionConfig reducedMotion="user">
      <div data-paralaks={paralaks ? "" : undefined} className="relative min-h-svh bg-[#1a1512] font-[family-name:var(--font-manrope)] text-[#2b2420] selection:bg-[#e9d5a1]/60">
        <LatarSisi u={u} />

        <AnimatePresence>{!opened && <Sampul key="sampul" u={u} tamu={tamu} onOpen={open} />}</AnimatePresence>

        <main className="relative z-10 mx-auto w-full max-w-[440px] overflow-x-clip bg-[#f6f1e9]">
          <Isi u={u} opened={opened} tamu={tamu} />
        </main>

        {opened && (
          <>
            <div className="pointer-events-none fixed inset-x-0 top-0 z-[90] flex justify-center" aria-hidden="true">
              <div className={`${s.progres} ${s.emas} h-[2px] w-full max-w-[440px] origin-left`} />
            </div>
            <Navigasi />
          </>
        )}
        <div id="lx-lapis" />
      </div>
    </MotionConfig>
  );
}

/* ───────── Latar di layar lebar: espresso dengan foto redup & daun ───────── */

function LatarSisi({ u }: { u: Undangan }) {
  return (
    <div className="pointer-events-none fixed inset-0 hidden overflow-hidden min-[480px]:block" aria-hidden="true">
      <Image src={u.foto.belakang} alt="" fill sizes="(min-width: 480px) 100vw, 1px" className="object-cover opacity-20 blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1512] via-[#1a1512]/70 to-[#1a1512]" />
      <Daun n={1} className="top-[8%] left-[8%] w-56 opacity-15" />
      <Daun n={3} className="right-[8%] bottom-[6%] w-64 opacity-15" flip delay={-4} />
    </div>
  );
}

/* ───────── Sampul ───────── */

const isi: Variants = {
  hidden: { opacity: 0, transform: "translateY(24px)" },
  show: (d: number) => ({ opacity: 1, transform: "translateY(0px)", transition: { duration: 1.2, ease, delay: 0.4 + d } }),
  exit: { opacity: 0, transform: "translateY(-16px)", transition: { duration: 0.4 } },
};

// Saat dibuka: isi memudar, lalu seluruh sampul terangkat ke atas dengan tepi bawah melengkung,
// fotonya tertinggal sedikit (parallax) sehingga terasa seperti tirai panggung yang ditarik.
function Sampul({ u, tamu, onOpen }: { u: Undangan; tamu?: string; onOpen: () => void }) {
  const foto = u.foto.galeri[1]?.src ?? u.foto.sampul;
  return (
    <motion.div className="fixed inset-0 z-50 flex justify-center" initial="hidden" animate="show" exit="exit">
      <motion.div
        variants={{ exit: { transform: "translateY(-106%)", transition: { duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.3 } } }}
        className="relative h-full w-full max-w-[440px] overflow-hidden rounded-b-[50%_7%] bg-[#241d18] shadow-[0_30px_60px_rgb(0_0_0/0.5)]"
      >
        <motion.div
          className="absolute inset-0"
          variants={{
            hidden: { transform: "scale(1.15) translateY(0%)" },
            show: { transform: "scale(1.04) translateY(0%)", transition: { duration: 6, ease: "easeOut" } },
            exit: { transform: "scale(1.04) translateY(40%)", transition: { duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.3 } },
          }}
        >
          <Image src={foto} alt="" fill preload sizes="440px" className="object-cover object-[50%_30%]" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#120e0b]/40 via-[#120e0b]/10 to-[#120e0b]/85" />
        <Kerlip n={12} />

        <div className="absolute inset-x-0 bottom-[calc(3rem+var(--demo-h,0px))] flex flex-col items-center px-8 text-center text-[#f6f1e9]">
          <motion.div custom={0} variants={isi}>
            <Monogram a={u.wanita.panggilan[0]} b={u.pria.panggilan[0]} terang className="size-20 text-[0.7rem]" />
          </motion.div>
          <motion.p custom={0.15} variants={isi} className="mt-5 text-[11px] tracking-[0.4em] uppercase">
            The Wedding Of
          </motion.p>
          <motion.h1 custom={0.3} variants={isi} className={`${bodoni} mt-2 text-[2.9rem] leading-none font-medium`}>
            {u.wanita.panggilan} &amp; {u.pria.panggilan}
          </motion.h1>
          <motion.div custom={0.45} variants={isi} className={`${s.emas} mt-4 h-px w-24`} />
          <motion.div custom={0.55} variants={isi} className="mt-4 text-sm">
            <p className="text-[#f6f1e9]/70">Kepada Yth.</p>
            {tamu ? <p className={`${bodoni} mt-1 text-xl italic`}>{tamu}</p> : <p className="mt-1">Bapak/Ibu/Saudara/i</p>}
          </motion.div>
          <motion.button custom={0.7} variants={isi} type="button" onClick={onOpen} whileTap={{ scale: 0.95 }} className={`${tombolEmas} mt-6`}>
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            Buka Undangan
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ───────── Navigasi bawah ───────── */

const ikon = {
  beranda: <path d="M3 11 12 4l9 7M5 10v10h14V10" />,
  mempelai: (
    <>
      <circle cx="8.5" cy="8" r="3" />
      <circle cx="15.5" cy="8" r="3" />
      <path d="M3 20c0-3.5 2.5-6 5.5-6s4 1.5 3.5 1.5S12.5 14 15.5 14 21 16.5 21 20" />
    </>
  ),
  acara: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </>
  ),
  galeri: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 16 5-5 4 4 3-3 6 6" />
    </>
  ),
  cerita: <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />,
  ucapan: <path d="M5 5h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H10l-5 4V6a1 1 0 0 1 1-1Z" />,
  kado: (
    <>
      <rect x="4" y="9" width="16" height="11" rx="1.5" />
      <path d="M3 9h18M12 9v11M12 9S10 4 7.5 5 9 9 12 9Zm0 0s2-5 4.5-4S15 9 12 9Z" />
    </>
  ),
};

const MENU: { id: keyof typeof ikon; label: string }[] = [
  { id: "beranda", label: "Beranda" },
  { id: "mempelai", label: "Mempelai" },
  { id: "acara", label: "Acara" },
  { id: "galeri", label: "Galeri" },
  { id: "cerita", label: "Kisah" },
  { id: "ucapan", label: "Ucapan" },
  { id: "kado", label: "Kado" },
];

function Navigasi() {
  const [active, setActive] = useState<string>("beranda");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const { id } of MENU) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, transform: "translateY(90px)" }}
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      transition={{ delay: 1.8, duration: 0.9, ease }}
      className="pointer-events-none fixed inset-x-0 bottom-[calc(0.75rem+var(--demo-h,0px))] z-[90] flex justify-center px-3"
    >
      <ul className="pointer-events-auto flex items-center gap-1 rounded-2xl border border-[#e9d5a1]/30 bg-[#241d18]/94 p-1.5 shadow-[0_12px_30px_-10px_rgb(0_0_0/0.7)]">
        {MENU.map(({ id, label }) => (
          <li key={id} className="relative">
            <AnimatePresence>
              {active === id && (
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-[#241d18]/94 px-2 py-1 text-[10px] tracking-wide whitespace-nowrap text-[#e9d5a1]"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
            <a href={`#${id}`} aria-label={label} className={`relative grid size-10 place-items-center rounded-xl transition-colors ${active === id ? "text-[#241d18]" : "text-[#f6f1e9]/85"}`}>
              {active === id && <motion.span layoutId="lx-nav" transition={{ type: "spring", stiffness: 380, damping: 30 }} className={`${s.emas} absolute inset-0 rounded-xl`} />}
              <svg viewBox="0 0 24 24" className="relative size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {ikon[id]}
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
