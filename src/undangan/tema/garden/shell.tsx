"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useBukaUndangan, useParalaks } from "../../pakai";
import type { Undangan } from "../../types";
import { ASET } from "./aset";
import { Isi } from "./bagian";
import { Burung, Gambar, Kameo, LEMBUT, Wisteria, italiana } from "./hias";
import { tombolTeal } from "./interaktif";
import s from "./garden.module.css";

// Kerangka tema Garden Premium: sampul yang pergi berlapis saat dibuka (isi naik, wisteria terangkat, merak & peony
// turun, latar memudar) sementara adegan taman di baliknya mulai "kamera mundur". Kolom undangan selebar HP,
// latar redup di layar lebar, dan navigasi bawah. Khusus tampilan HP seperti tema lain.

export function Garden({ data: u, tamu }: { data: Undangan; tamu?: string }) {
  const { opened, open } = useBukaUndangan({ halus: false });
  const paralaks = useParalaks();

  return (
    <MotionConfig reducedMotion="user">
      <div
        data-paralaks={paralaks ? "" : undefined}
        className="relative min-h-svh bg-[#dfe5e0] font-[family-name:var(--font-jost)] text-[#24434e] selection:bg-[#dcc58f]/60"
      >
        <LatarSisi />

        <AnimatePresence>{!opened && <Sampul key="sampul" u={u} tamu={tamu} onOpen={open} />}</AnimatePresence>

        <main className={`${s.kertas} relative z-10 mx-auto w-full max-w-[440px] overflow-x-clip`}>
          <Isi u={u} opened={opened} tamu={tamu} />
        </main>

        <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center" aria-hidden="true">
          <div className={`${s.progres} h-[2px] w-full max-w-[440px] origin-left bg-gradient-to-r from-[#b9975b] via-[#f2e3b5] to-[#b9975b]`} />
        </div>
        {opened && <Navigasi />}
        <div id="gd-lapis" />
      </div>
    </MotionConfig>
  );
}

/* ───────── Latar di layar lebar ───────── */

function LatarSisi() {
  return (
    <div className="pointer-events-none fixed inset-0 hidden overflow-hidden min-[480px]:block" aria-hidden="true">
      <div className={`${s.latarSisi} absolute inset-0`}>
        <Image src={ASET.lembah.src} alt="" fill sizes="(min-width: 480px) 100vw, 1px" className="object-cover opacity-40" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#dfe5e0] via-[#dfe5e0]/55 to-[#dfe5e0]" />
    </div>
  );
}

/* ───────── Sampul ───────── */

const PERGI = [0.7, 0, 0.3, 1] as const;

// Saat dibuka, sampul pergi berlapis: isi naik & memudar, wisteria terangkat ke atas, merak & peony turun,
// lalu kertasnya memudar dan memperlihatkan adegan taman yang sedang "kamera mundur" di baliknya.
function Sampul({ u, tamu, onOpen }: { u: Undangan; tamu?: string; onOpen: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex justify-center" initial="ada" animate="ada" exit="pergi" variants={{ ada: { opacity: 1 }, pergi: { opacity: 1, transition: { duration: 1.6 } } }}>
      <div className="relative h-full w-full max-w-[440px] overflow-hidden">
        {/* kertas & lembah samar */}
        <motion.div className={`${s.kertas} absolute inset-0`} variants={{ ada: { opacity: 1 }, pergi: { opacity: 0, transition: { duration: 1.1, delay: 0.45, ease: "easeInOut" } } }}>
          <div className="absolute inset-0 opacity-[0.22] [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_60%,transparent)]">
            <Image src={ASET.lembah.src} alt="" fill preload sizes="(min-width: 440px) 440px, 100vw" className="object-cover object-[50%_38%]" />
          </div>
          <Burung className="top-[18%] left-0" delay={-3} />
          <Burung className="top-[21%] left-0" delay={-9} size={11} />
        </motion.div>

        {/* wisteria di sudut atas */}
        <motion.div className="absolute inset-x-0 top-0 h-[40%]" variants={{ ada: { transform: "translateY(0%)" }, pergi: { transform: "translateY(-110%)", transition: { duration: 1.3, ease: PERGI } } }}>
          <Wisteria className="top-[-4%] left-[2%] w-[13%]" sizes="60px" />
          <Wisteria className="top-[-8%] left-[13%] w-[10%]" sizes="46px" jeda={-1.5} />
          <Wisteria className="top-[-6%] right-[3%] w-[12%]" sizes="56px" jeda={-0.7} />
          <Wisteria className="top-[-9%] right-[14%] w-[9%]" sizes="42px" jeda={-2.2} />
        </motion.div>

        {/* isi sampul */}
        <motion.div
          className="absolute inset-x-0 top-[9%] flex flex-col items-center px-8 text-center"
          variants={{ ada: { opacity: 1, transform: "translateY(0px)" }, pergi: { opacity: 0, transform: "translateY(-90px)", transition: { duration: 0.9, ease: PERGI } } }}
        >
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.2 }} className="text-[10px] tracking-[0.45em] text-[#34596a] uppercase">
            The Wedding of
          </motion.p>
          <motion.div
            className="mt-4 w-[48%] min-w-[150px]"
            initial={{ opacity: 0, transform: "scale(0.85)" }}
            animate={{ opacity: 1, transform: "scale(1)" }}
            transition={{ duration: 1.6, ease: LEMBUT, delay: 0.3 }}
          >
            <Kameo src={u.foto.sampul} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} sizes="210px" preload />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, transform: "translateY(20px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 1.3, ease: LEMBUT, delay: 0.6 }}
            className={`${italiana} mt-5 text-[2.5rem] leading-tight text-[#24434e]`}
          >
            {u.wanita.panggilan} <span className="text-[#b9975b]">&amp;</span> {u.pria.panggilan}
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.9 }} className="mt-3 text-[13px] leading-snug font-light">
            <p>Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <p className="mt-1 text-base font-medium">{tamu ?? "Tamu Undangan"}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, transform: "translateY(14px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} transition={{ duration: 1, ease: LEMBUT, delay: 1.1 }} className="mt-5">
            <motion.button type="button" onClick={onOpen} whileTap={{ scale: 0.95 }} className={tombolTeal}>
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 7.5 12 13l8-5.5M5 5h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
              </svg>
              Buka Undangan
            </motion.button>
          </motion.div>
        </motion.div>

        {/* merak & peony di bawah */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-[var(--demo-h,0px)] h-[34%]"
          variants={{ ada: { opacity: 1, transform: "translateY(0%)" }, pergi: { opacity: 0, transform: "translateY(45%)", transition: { duration: 1.2, ease: PERGI } } }}
        >
          <motion.div className="absolute right-0 bottom-0 w-[40%]" initial={{ opacity: 0, transform: "translateX(30%)" }} animate={{ opacity: 1, transform: "translateX(0%)" }} transition={{ duration: 1.6, ease: LEMBUT, delay: 0.5 }}>
            <Gambar a="merakSakura" sizes="180px" />
          </motion.div>
          <motion.div className="absolute bottom-[-10%] left-0 w-[50%]" initial={{ opacity: 0, transform: "translateY(30%)" }} animate={{ opacity: 1, transform: "translateY(0%)" }} transition={{ duration: 1.6, ease: LEMBUT, delay: 0.7 }}>
            <div className={s.ayunA} style={{ transformOrigin: "30% 100%" }}>
              <Gambar a="peony" sizes="220px" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ───────── Navigasi bawah ───────── */

const ikon = {
  beranda: <path d="M4 20V10a8 8 0 0 1 16 0v10M9 20v-6a3 3 0 0 1 6 0v6" />,
  mempelai: (
    <>
      <ellipse cx="12" cy="11" rx="6" ry="8" />
      <path d="M12 1.5v1M9.5 2.5 12 3l2.5-.5" />
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
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <rect x="7" y="7" width="10" height="10" />
    </>
  ),
  cerita: <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />,
  ucapan: <path d="M5 5h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H10l-5 4V6a1 1 0 0 1 1-1Z" />,
};

const MENU: { id: keyof typeof ikon; label: string }[] = [
  { id: "beranda", label: "Beranda" },
  { id: "mempelai", label: "Mempelai" },
  { id: "acara", label: "Acara" },
  { id: "galeri", label: "Galeri" },
  { id: "cerita", label: "Kisah" },
  { id: "ucapan", label: "Ucapan" },
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
      transition={{ delay: 3.6, duration: 0.9, ease: LEMBUT }}
      className="pointer-events-none fixed inset-x-0 bottom-[calc(0.75rem+var(--demo-h,0px))] z-40 flex justify-center px-3"
    >
      <ul className="pointer-events-auto flex items-center gap-1 rounded-full bg-[#24434e]/92 p-1.5 shadow-[0_12px_28px_-12px_rgb(20_40_48/0.9)] ring-1 ring-[#dcc58f]/40 backdrop-blur-sm">
        {MENU.map(({ id, label }) => (
          <li key={id} className="relative">
            <a href={`#${id}`} aria-label={label} className="relative grid size-10 place-items-center rounded-full text-[#f3efe3]">
              {active === id && <motion.span layoutId="gd-nav" className="absolute inset-0 rounded-full bg-[#dcc58f]" transition={{ type: "spring", stiffness: 320, damping: 30 }} />}
              <svg
                viewBox="0 0 24 24"
                className={`relative size-[19px] transition-colors ${active === id ? "text-[#24434e]" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
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
