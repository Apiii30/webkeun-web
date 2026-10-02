"use client";

import Lenis from "lenis";
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring, type Variants } from "motion/react";
import Image from "next/image";
import { type ReactNode, useEffect, useRef, useState } from "react";
import type { Undangan } from "../../types";
import { Isi } from "./bagian";
import { Bloom, BungaDefs, Cat, Daisy, Gerbera, Leaf, Sprig, Tulip } from "./bunga";
import s from "./floral.module.css";
import { cssVars } from "./warna";

// Kerangka tema Floral: sampul "Buka Undangan", scroll halus, progres, dan navigasi bawah.
// Tampilannya khusus HP; di layar lebar undangan tetap selebar HP di tengah, dengan latar bunga di sekitarnya.

const ease = [0.76, 0, 0.24, 1] as const;

export function Floral({ data: u, tamu }: { data: Undangan; tamu?: string }) {
  const [opened, setOpened] = useState(false);
  const lenis = useRef<Lenis | null>(null);

  // Mulai dari paling atas setiap kali dibuka, lalu nyalakan scroll halus
  useEffect(() => {
    const root = document.documentElement;
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.style.scrollBehavior = "auto"; // supaya tidak bentrok dengan Lenis
    const l = new Lenis({ autoRaf: true, anchors: true, lerp: 0.1 });
    lenis.current = l;
    return () => {
      l.destroy();
      lenis.current = null;
      root.style.scrollBehavior = "";
      history.scrollRestoration = "auto";
    };
  }, []);

  // Halaman dikunci sampai undangan dibuka
  useEffect(() => {
    if (opened) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    lenis.current?.stop();
    return () => {
      root.style.overflow = "";
      lenis.current?.start();
    };
  }, [opened]);

  function open() {
    window.scrollTo(0, 0);
    lenis.current?.scrollTo(0, { immediate: true, force: true });
    setOpened(true);
  }

  return (
    <MotionConfig reducedMotion="user">
      <div style={cssVars} className={`${s.grain} relative min-h-svh bg-(--hijau-tua) font-[family-name:var(--font-figtree)] text-(--hijau) selection:bg-(--mentega)`}>
        <BungaDefs />
        <Latar />

        <AnimatePresence>{!opened && <Sampul key="sampul" u={u} tamu={tamu ?? "Bapak/Ibu/Saudara/i"} onOpen={open} />}</AnimatePresence>

        <main className={`${s.grain} relative mx-auto min-h-svh w-full max-w-[440px] overflow-x-clip bg-(--kertas) shadow-[0_0_80px_rgb(0_0_0/0.35)]`}>
          <Isi u={u} opened={opened} tamu={tamu} />
        </main>

        {opened && (
          <>
            <Progres />
            <Navigasi />
          </>
        )}
      </div>
    </MotionConfig>
  );
}

/* ───────── Sampul ───────── */

// Bunga-bunga sampul muncul berputar, lalu terlempar keluar saat undangan dibuka
const bungaSampul: Variants = {
  hidden: { scale: 0, rotate: -140, opacity: 0 },
  show: (c: { d: number }) => ({ scale: 1, rotate: 0, opacity: 1, transition: { type: "spring", stiffness: 110, damping: 11, delay: 0.25 + c.d } }),
  exit: (c: { x: number; y: number }) => ({ x: c.x, y: c.y, scale: 1.8, rotate: 160, opacity: 0, transition: { duration: 0.7, ease: [0.5, 0, 0.75, 0] } }),
};
const isiSampul: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.5 + d } }),
  exit: { opacity: 0, y: -30, transition: { duration: 0.35 } },
};

function BungaSampul({ c, className, children }: { c: { d: number; x: number; y: number }; className: string; children: ReactNode }) {
  return (
    <motion.div custom={c} variants={bungaSampul} className={`absolute ${className}`}>
      {children}
    </motion.div>
  );
}

function Sampul({ u, tamu, onOpen }: { u: Undangan; tamu: string; onOpen: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-center"
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <motion.div
        variants={{ exit: { y: "-100%", borderBottomLeftRadius: "50% 18%", borderBottomRightRadius: "50% 18%", transition: { duration: 1, ease, delay: 0.3 } } }}
        className={`${s.grain} relative flex h-full w-full max-w-[440px] flex-col items-center overflow-hidden bg-(--hijau) px-6 pt-[max(2rem,6svh)] pb-[calc(1.5rem+var(--demo-h,0px))] text-center text-(--kertas)`}
      >
        <motion.p custom={0} variants={isiSampul} className="text-[11px] font-bold tracking-[0.35em] text-(--mentega) uppercase">
          The wedding of
        </motion.p>

        <div className="relative mt-6">
          <motion.div custom={0.1} variants={{ ...isiSampul, hidden: { opacity: 0, scale: 0.6 }, show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 80, damping: 14, delay: 0.2 } } }}>
            <Cat warna="kuning" className="absolute -top-12 -right-20 w-60" />
          </motion.div>
          <motion.div
            variants={{
              hidden: { clipPath: "inset(100% 0% 0% 0% round 999px 999px 0 0)" },
              show: { clipPath: "inset(0% 0% 0% 0% round 999px 999px 0 0)", transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.15 } },
              exit: { scale: 0.85, opacity: 0, transition: { duration: 0.5 } },
            }}
            className="relative aspect-[4/5] h-[36svh] max-h-[22rem] overflow-hidden rounded-t-full border-[5px] border-(--kertas)"
          >
            <Image src={u.foto.sampul} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} fill preload sizes="300px" className="object-cover object-[50%_30%]" />
          </motion.div>

          <BungaSampul c={{ d: 0.5, x: -260, y: 120 }} className="-bottom-8 -left-12 w-28">
            <Daisy className={`${s.spin} w-full`} />
          </BungaSampul>
          <BungaSampul c={{ d: 0.62, x: 240, y: -200 }} className="-top-6 -left-8 w-20">
            <Bloom className={`${s.float} w-full`} />
          </BungaSampul>
          <BungaSampul c={{ d: 0.74, x: 260, y: 140 }} className="-right-9 -bottom-4 w-16">
            <Tulip className={`${s.sway} w-full`} />
          </BungaSampul>
          <BungaSampul c={{ d: 0.86, x: 200, y: -260 }} className="top-10 -right-7 w-12">
            <Gerbera className={`${s.spin} w-full`} warna="putih" />
          </BungaSampul>
          <BungaSampul c={{ d: 0.4, x: -200, y: -240 }} className="top-1/3 -left-14 w-9">
            <Leaf className="w-full -rotate-[35deg]" />
          </BungaSampul>
        </div>

        <motion.h1 custom={0.35} variants={isiSampul} className="mt-8 font-[family-name:var(--font-fraunces)] text-[3.4rem] leading-[0.95] font-medium italic">
          {u.wanita.panggilan} <span className="text-(--mentega)">&</span> {u.pria.panggilan}
        </motion.h1>

        <motion.div custom={0.5} variants={isiSampul} className="mt-auto pt-6">
          <p className="text-sm text-(--kertas)/70">Kepada Yth.</p>
          <p className="mt-2 inline-block max-w-full truncate rounded-full border border-(--kertas)/25 bg-(--kertas)/10 px-5 py-2 font-[family-name:var(--font-fraunces)] text-xl">{tamu}</p>
        </motion.div>

        <motion.button
          custom={0.65}
          variants={isiSampul}
          type="button"
          onClick={onOpen}
          whileTap={{ scale: 0.94 }}
          className={`${s.pulse} mt-6 inline-flex items-center gap-2 rounded-full bg-(--mentega) px-7 py-3.5 font-bold text-(--hijau-tua)`}
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
          Buka undangan
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

/* ───────── Latar layar lebar ───────── */

function Latar() {
  return (
    <div className="pointer-events-none fixed inset-0 hidden overflow-hidden min-[480px]:block" aria-hidden="true">
      <Daisy className={`${s.spin} absolute -top-24 -left-24 w-80`} />
      <Bloom className={`${s.float} absolute bottom-[24%] left-[8%] w-56`} />
      <Gerbera className={`${s.spin} absolute top-[12%] right-[10%] w-40`} />
      <Tulip className={`${s.sway} absolute right-[4%] -bottom-6 w-40`} />
      <Sprig className={`${s.sway} absolute top-[22%] left-[20%] w-24`} />
      <Daisy className={`${s.spin} absolute right-[22%] bottom-[30%] w-24`} warna="biru" />
      <p className="absolute bottom-8 left-8 hidden max-w-48 text-sm text-(--kertas)/60 lg:block">
        Undangan ini dirancang untuk layar HP. Buka di HP untuk pengalaman terbaik.
      </p>
    </div>
  );
}

/* ───────── Progres scroll & navigasi bawah ───────── */

function Progres() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center">
      <motion.div style={{ scaleX }} className="h-1 w-full max-w-[440px] origin-left bg-gradient-to-r from-(--mentega) via-(--koral) to-(--biru)" />
    </div>
  );
}

const ikon = {
  beranda: <path d="M3 11 12 4l9 7M5 10v10h14V10" />,
  mempelai: <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />,
  cerita: <path d="M4 5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4Zm16 0h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6Z" />,
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
      <circle cx="16" cy="9" r="1.5" />
    </>
  ),
  kado: (
    <>
      <rect x="4" y="9" width="16" height="11" rx="1.5" />
      <path d="M3 9h18M12 9v11M12 9S10 4 7.5 5 9 9 12 9Zm0 0s2-5 4.5-4S15 9 12 9Z" />
    </>
  ),
  ucapan: <path d="M5 5h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H10l-5 4V6a1 1 0 0 1 1-1Z" />,
};

const MENU: { id: keyof typeof ikon; label: string }[] = [
  { id: "beranda", label: "Beranda" },
  { id: "mempelai", label: "Mempelai" },
  { id: "cerita", label: "Cerita" },
  { id: "acara", label: "Acara" },
  { id: "galeri", label: "Galeri" },
  { id: "kado", label: "Kado" },
  { id: "ucapan", label: "Ucapan" },
];

function Navigasi() {
  const [active, setActive] = useState("beranda");

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
      transition={{ delay: 1.4, type: "spring", stiffness: 120, damping: 16 }}
      className="pointer-events-none fixed inset-x-0 bottom-[calc(0.75rem+var(--demo-h,0px))] z-40 flex justify-center px-3"
    >
      <ul className="pointer-events-auto flex items-center gap-0.5 rounded-full bg-(--kertas)/85 p-1.5 shadow-[0_12px_30px_-12px_rgb(18_42_31/0.55)] ring-1 ring-(--hijau)/10 backdrop-blur-md">
        {MENU.map(({ id, label }) => (
          <li key={id}>
            <a href={`#${id}`} aria-label={label} className="relative grid size-10 place-items-center rounded-full text-(--hijau)">
              {active === id && <motion.span layoutId="floral-nav" transition={{ type: "spring", stiffness: 380, damping: 30 }} className="absolute inset-0 rounded-full bg-(--hijau)" />}
              <svg
                viewBox="0 0 24 24"
                className={`relative size-[18px] transition-colors ${active === id ? "text-(--mentega)" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
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
