"use client";

import { AnimatePresence, MotionConfig, motion, type Variants } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useBukaUndangan, useParalaks } from "../../pakai";
import { SlotMusik, useMusik } from "../../musik";
import type { Undangan } from "../../types";
import { Awan, Bingkai, Burung, Kabut, Kunang, Kupu, Latar, Rumpun, Sinar } from "./alam";
import { ASET, RUMPUN_ATAS, RUMPUN_BAWAH } from "./aset";
import { Isi } from "./bagian";
import { tombolEmas } from "./interaktif";
import s from "./rimba.module.css";
import { TombolMusik } from "./musik";

// Kerangka tema Rimba: sampul "Buka Undangan", latar hutan yang diam di tempat, navigasi bawah.
// Tampilan khusus HP; di layar lebar undangan tetap selebar HP di tengah.

const cinzel = "font-[family-name:var(--font-cinzel)]";

export function Rimba({ data: u, tamu }: { data: Undangan; tamu?: string }) {
  const { opened, open } = useBukaUndangan({ halus: false });
  const musik = useMusik(u.musik);
  // lagu dimulai di dalam klik "Buka Undangan" (browser hanya mengizinkan audio sesudah ada interaksi)
  const buka = () => {
    open();
    musik.mulai();
  };
  const paralaks = useParalaks();

  return (
    <MotionConfig reducedMotion="user">
      <div data-paralaks={paralaks ? "" : undefined} className="relative min-h-svh bg-[#0b1610] font-[family-name:var(--font-montserrat)] text-[#f3ede0] selection:bg-[#c9a45c]/40">
        <Latar />

        <AnimatePresence>{!opened && <Sampul key="sampul" u={u} tamu={tamu} onOpen={buka} />}</AnimatePresence>

        <SlotMusik muncul={opened}>{u.musik && <TombolMusik main={musik.main} onUbah={musik.ubah} lagu={u.musik} />}</SlotMusik>

        <main className="relative z-10 mx-auto w-full max-w-[440px] overflow-x-clip">
          <Isi u={u} opened={opened} tamu={tamu} />
        </main>

        {opened && (
          <>
            {/* garis emas di atas yang memanjang sesuai posisi scroll */}
            <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center" aria-hidden="true">
              <div className={`${s.progres} h-[2px] w-full max-w-[440px] origin-left bg-gradient-to-r from-[#9b7231] via-[#f3dfa6] to-[#c9a45c]`} />
            </div>
            <Navigasi />
          </>
        )}
        <div id="rb-lapis" />
      </div>
    </MotionConfig>
  );
}

/* ───────── Sampul ───────── */

// Saat dibuka, kamera seolah masuk ke dalam hutan: isi naik & memudar, tanaman menyingkir, latar membesar
const isi: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.4 + d } }),
  exit: { opacity: 0, y: -40, transition: { duration: 0.5 } },
};

function Sampul({ u, tamu, onOpen }: { u: Undangan; tamu?: string; onOpen: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex justify-center" initial="hidden" animate="show" exit="exit">
      <motion.div
        variants={{ exit: { opacity: 0, transition: { duration: 0.6, delay: 0.75 } } }}
        className="relative h-full w-full max-w-[440px] overflow-hidden bg-[#0b1610]"
      >
        <motion.div
          className="absolute inset-0"
          variants={{
            hidden: { scale: 1.25 },
            show: { scale: 1.05, transition: { duration: 6, ease: "easeOut" } },
            exit: { scale: 1.9, opacity: 0.4, transition: { duration: 1.3, ease: [0.6, 0, 0.4, 1] } },
          }}
        >
          <Image src={ASET.hutan.src} alt="" fill preload sizes="440px" className="object-cover object-[42%_50%]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1610]/55 via-[#0b1610]/30 to-[#0b1610]/80" />
        </motion.div>
        <Sinar />
        <Kabut className="top-[45%] h-1/2" />
        <Kunang n={14} />
        <Awan className={`${s.awan} top-[1%] left-0 w-48 opacity-45`} style={{ animationDelay: "-48s" }} />
        <Burung className="top-[10%] left-0" delay={-10} />

        <motion.div
          className="absolute inset-x-0 -top-2 aspect-[1/0.55]"
          variants={{ hidden: { y: "-40%", opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 1.6, ease: [0.22, 1, 0.36, 1] } }, exit: { y: "-70%", opacity: 0, transition: { duration: 0.9 } } }}
        >
          <Rumpun items={RUMPUN_ATAS} dari="atas" className="inset-0" muncul={false} />
        </motion.div>
        <motion.div
          className="absolute inset-x-0 bottom-[var(--demo-h,0px)] aspect-[1/0.62]"
          variants={{ hidden: { y: "40%", opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 } }, exit: { y: "80%", opacity: 0, transition: { duration: 0.9 } } }}
        >
          <Rumpun items={RUMPUN_BAWAH} className="inset-0" muncul={false} />
        </motion.div>
        <Kupu className="top-[38%] left-[10%]" delay={-4} w={32} />

        <div className="relative flex h-full flex-col items-center justify-center px-6 pb-[calc(9rem+var(--demo-h,0px))] text-center">
          <motion.p custom={0} variants={isi} className={`${cinzel} text-xs tracking-[0.35em] text-[#e9d7a6]`}>
            The Wedding Of
          </motion.p>
          <motion.div
            className="mt-5"
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              show: { opacity: 1, scale: 1, transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 } },
              exit: { opacity: 0, scale: 1.15, transition: { duration: 0.6 } },
            }}
          >
            <Bingkai src={u.foto.sampul} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} className="aspect-[3/4] h-[34svh] max-h-[19rem]" sizes="240px" preload />
          </motion.div>
          <motion.h1 custom={0.25} variants={isi} className={`${cinzel} mt-6 text-[2.1rem] leading-none tracking-[0.08em] text-[#e9d7a6] [text-shadow:0_2px_16px_rgb(0_0_0/0.7)]`}>
            {u.wanita.panggilan} &amp; {u.pria.panggilan}
          </motion.h1>
          <motion.div custom={0.4} variants={isi} className="mt-5 text-sm">
            <p className="text-[#f3ede0]/75">Kepada Yth.</p>
            {tamu ? <p className={`${cinzel} mt-1 text-lg tracking-wide`}>{tamu}</p> : <p className="mt-0.5">Bapak/Ibu/Saudara/i</p>}
          </motion.div>
          <motion.button custom={0.55} variants={isi} type="button" onClick={onOpen} whileTap={{ scale: 0.95 }} className={`${tombolEmas} mt-6`}>
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
      initial={{ y: 90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.6, type: "spring", stiffness: 120, damping: 16 }}
      className="pointer-events-none fixed inset-x-0 bottom-[calc(0.75rem+var(--demo-h,0px))] z-40 flex justify-center px-3"
    >
      <ul className="pointer-events-auto flex items-center gap-1 rounded-2xl border border-[#c9a45c]/30 bg-[#13251b]/92 p-1.5 shadow-[0_12px_30px_-10px_rgb(0_0_0/0.8)]">
        {MENU.map(({ id, label }) => (
          <li key={id} className="relative">
            <AnimatePresence>
              {active === id && (
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-[#13251b]/90 px-2 py-1 text-[10px] whitespace-nowrap text-[#e9d7a6]"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
            <a href={`#${id}`} aria-label={label} className="relative grid size-10 place-items-center rounded-xl text-[#e9dcc0]">
              {active === id && <motion.span layoutId="rb-nav" transition={{ type: "spring", stiffness: 380, damping: 30 }} className="absolute inset-0 rounded-xl bg-[#c9a45c]" />}
              <svg
                viewBox="0 0 24 24"
                className={`relative size-[19px] transition-colors ${active === id ? "text-[#13251b]" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {ikon[id]}
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
