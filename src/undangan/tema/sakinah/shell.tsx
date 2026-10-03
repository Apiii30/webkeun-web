"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useBukaUndangan, useParalaks } from "../../pakai";
import type { Undangan } from "../../types";
import { ASET } from "./aset";
import { Isi } from "./bagian";
import { FotoLengkung, HALUS, Lentera, Pembatas, marcellus, naskah } from "./hias";
import { tombolEmas } from "./interaktif";
import s from "./sakinah.module.css";

// Kerangka tema Putih Sakinah: sampul marmer putih dengan foto dalam lengkung mihrab. Saat dibuka, sampul membesar
// sambil memudar (kamera seolah melangkah masuk) dan di baliknya animasi pintu mihrab di beranda dimulai (gerbang.tsx).
// Kolom undangan selebar HP, latar zamrud redup di layar lebar, dan navigasi bawah. Khusus tampilan HP.

export function Sakinah({ data: u, tamu }: { data: Undangan; tamu?: string }) {
  const { opened, open } = useBukaUndangan({ halus: false });
  const paralaks = useParalaks();

  return (
    <MotionConfig reducedMotion="user">
      <div data-paralaks={paralaks ? "" : undefined} className="relative min-h-svh bg-[#0b2c25] font-[family-name:var(--font-garamond)] text-[17px] text-[#1d3d34] selection:bg-[#b8955a]/40">
        <LatarSisi />

        <AnimatePresence>{!opened && <Sampul key="sampul" u={u} tamu={tamu} onOpen={open} />}</AnimatePresence>

        <main className={`${s.marmer} relative z-10 mx-auto w-full max-w-[440px] overflow-x-clip`}>
          <Isi u={u} opened={opened} tamu={tamu} />
        </main>

        <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center" aria-hidden="true">
          <div className={`${s.progres} h-[2px] w-full max-w-[440px] origin-left bg-gradient-to-r from-[#0f3a31] via-[#d9bd7c] to-[#0f3a31]`} />
        </div>
        {opened && <Navigasi />}
        <div id="sk-lapis" />
      </div>
    </MotionConfig>
  );
}

/* ───────── Latar di layar lebar ───────── */

function LatarSisi() {
  return (
    <div className="pointer-events-none fixed inset-0 hidden overflow-hidden min-[480px]:block" aria-hidden="true">
      <div className={`${s.latarSisi} absolute inset-0`}>
        <Image src={ASET.taj.src} alt="" fill sizes="(min-width: 480px) 100vw, 1px" loading="eager" className="object-cover opacity-[0.14] mix-blend-luminosity" />
      </div>
      <div className={`${s.polaTerang} absolute inset-0 opacity-[0.05]`} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b2c25] via-[#0b2c25]/40 to-[#0b2c25]" />
    </div>
  );
}

/* ───────── Sampul: marmer putih, foto dalam lengkung mihrab ───────── */

const MASUK = [0.65, 0, 0.35, 1] as const;

function Sampul({ u, tamu, onOpen }: { u: Undangan; tamu?: string; onOpen: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex justify-center" initial="ada" animate="ada" exit="pergi" variants={{ ada: { opacity: 1 }, pergi: { opacity: 1, transition: { duration: 1.5 } } }}>
      <div className="relative h-full w-full max-w-[440px] overflow-hidden">
        {/* marmer, lentera & foto: membesar sambil memudar, seolah kamera melangkah masuk */}
        <motion.div
          className={`${s.marmer} absolute inset-0`}
          style={{ transformOrigin: "50% 32%" }}
          variants={{ ada: { opacity: 1, transform: "scale(1)" }, pergi: { opacity: 0, transform: "scale(1.35)", transition: { duration: 1.5, ease: MASUK } } }}
        >
          <div className={`${s.pola} absolute inset-0 opacity-[0.16]`} />
          <div className="absolute top-[22%] left-1/2 aspect-square w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(246_231_196/0.75),transparent)]" />
          <Lentera className="left-[4%] w-[11%]" rantai="9svh" d={5.4} a={2} />
          <Lentera className="right-[5%] w-[10%]" rantai="15svh" d={4.8} a={2.4} jeda={-2} />
          <motion.div
            className="absolute top-[8%] left-1/2 w-[min(56%,30svh)] -translate-x-1/2"
            initial={{ opacity: 0, transform: "translateY(18px) scale(0.96)" }}
            animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
            transition={{ duration: 1.6, ease: HALUS, delay: 0.15 }}
          >
            <FotoLengkung src={u.foto.sampul} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} sizes="250px" posisi="50% 30%" preload />
          </motion.div>
        </motion.div>

        {/* teks sampul: naik lebih cepat dari latarnya */}
        <motion.div
          className="absolute inset-x-0 bottom-[calc(7%+var(--demo-h,0px))] flex flex-col items-center px-8 text-center"
          variants={{ ada: { opacity: 1, transform: "translateY(0px)" }, pergi: { opacity: 0, transform: "translateY(-140px)", transition: { duration: 0.9, ease: MASUK } } }}
        >
          {[
            <p key="a" className={`${marcellus} text-[10px] tracking-[0.45em] text-[#8f6d34] uppercase`}>
              Walimatul &apos;Ursy
            </p>,
            <h1 key="b" className={`${naskah} mt-1 text-[4.2rem] leading-[1] text-[#0f3a31]`}>
              {u.wanita.panggilan} <span className="text-[#b8955a]">&amp;</span> {u.pria.panggilan}
            </h1>,
            <Pembatas key="c" className="mt-1" />,
            <div key="d" className="mt-3 text-[15px] leading-snug">
              <p className="text-[#1d3d34]/75">Kepada Yth. Bapak/Ibu/Saudara/i</p>
              <p className={`${marcellus} mt-1 text-[1.1rem] text-[#0f3a31]`}>{tamu ?? "Tamu Undangan"}</p>
            </div>,
            <motion.button key="e" type="button" onClick={onOpen} whileTap={{ scale: 0.95 }} className={`${tombolEmas} mt-5`}>
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 7.5 12 13l8-5.5M5 5h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
              </svg>
              Buka Undangan
            </motion.button>,
          ].map((el, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, transform: "translateY(22px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={{ duration: 1.2, ease: HALUS, delay: 0.4 + i * 0.15 }}
            >
              {el}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ───────── Navigasi bawah: pil zamrud bertepi emas ───────── */

const ikon = {
  beranda: <path d="M4 11 12 4l8 7M6 10v10h12V10" />,
  mempelai: (
    <>
      <path d="M5 21V11a3 3 0 0 1 6 0v10" />
      <path d="M13 21V11a3 3 0 0 1 6 0v10" />
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
      <path d="M6 20V10c0-3 3-5.5 6-7 3 1.5 6 4 6 7v10Z" />
      <path d="m6 17 4-4 3 3 2-2 3 3" />
    </>
  ),
  cerita: <path d="M12 21C7 17 3 13.5 3 9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 9 2.5c0 4-4 7.5-9 11.5Z" />,
  ucapan: <path d="M5 5h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H10l-5 4V6a1 1 0 0 1 1-1Z" />,
};

const MENU: { id: keyof typeof ikon; label: string }[] = [
  { id: "beranda", label: "Beranda" },
  { id: "mempelai", label: "Mempelai" },
  { id: "acara", label: "Acara" },
  { id: "galeri", label: "Galeri" },
  { id: "cerita", label: "Perjalanan" },
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
      transition={{ delay: 7.6, duration: 0.9, ease: HALUS }}
      className="pointer-events-none fixed inset-x-0 bottom-[calc(0.75rem+var(--demo-h,0px))] z-40 flex justify-center px-3"
    >
      <ul className="pointer-events-auto flex items-center gap-1 rounded-full bg-[#0f3a31]/95 p-1.5 shadow-[0_12px_28px_-12px_rgb(5_20_16/0.8)] ring-1 ring-[#b8955a]/60">
        {MENU.map(({ id, label }) => (
          <li key={id} className="relative">
            <a href={`#${id}`} aria-label={label} className="relative grid size-10 place-items-center rounded-full text-[#e9dcc0]">
              {active === id && (
                <motion.span
                  layoutId="sk-nav"
                  className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,#a98544,#f1e2b8_50%,#a98544)]"
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
              )}
              <svg
                viewBox="0 0 24 24"
                className={`relative size-[19px] transition-colors ${active === id ? "text-[#0f3a31]" : ""}`}
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
