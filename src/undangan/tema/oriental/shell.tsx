"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useBukaUndangan, useParalaks } from "../../pakai";
import { SlotMusik, useMusik } from "../../musik";
import { useTamu } from "../../tamu";
import type { Undangan } from "../../types";
import { ASET } from "./aset";
import { Isi } from "./bagian";
import { Bunga, HALUS, JendelaBulan, Lentera, PitaMeander, naskah, yuji } from "./hias";
import { tombolMerah } from "./interaktif";
import s from "./oriental.module.css";
import { T_SELESAI } from "./pembuka";
import { TombolMusik } from "./musik";

// Kerangka tema Oriental Peony: sampul kertas krem dengan foto dalam jendela bulan. Saat dibuka, kamera menembus jendela
// bulan itu (sampul membesar sambil memudar) dan animasi lanskap di beranda dimulai (pembuka.tsx). Kolom undangan
// selebar HP, latar merah redup di layar lebar, dan navigasi bawah. Khusus tampilan HP.

export function Oriental({ data: u }: { data: Undangan }) {
  const tamu = useTamu();
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
      <div data-paralaks={paralaks ? "" : undefined} className="relative min-h-svh bg-[#3a0a0c] font-[family-name:var(--font-mincho)] text-[16px] text-[#3b1d16] selection:bg-[#c99a3e]/40">
        <LatarSisi />

        <AnimatePresence>{!opened && <Sampul key="sampul" u={u} tamu={tamu} onOpen={buka} />}</AnimatePresence>

        <SlotMusik muncul={opened}>{u.musik && <TombolMusik main={musik.main} onUbah={musik.ubah} lagu={u.musik} />}</SlotMusik>

        <main className={`${s.kertas} relative z-10 mx-auto w-full max-w-[440px] overflow-clip`}>
          <Isi u={u} opened={opened} tamu={tamu} />
        </main>

        <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center" aria-hidden="true">
          <div className={`${s.progres} h-[2px] w-full max-w-[440px] origin-left bg-gradient-to-r from-[#9e1c22] via-[#f6dc94] to-[#9e1c22]`} />
        </div>
        {opened && <Navigasi />}
        <div id="or-lapis" />
      </div>
    </MotionConfig>
  );
}

/* ───────── Latar di layar lebar ───────── */

function LatarSisi() {
  return (
    <div className="pointer-events-none fixed inset-0 hidden overflow-hidden min-[480px]:block" aria-hidden="true">
      <div className={`${s.latarSisi} absolute inset-0`}>
        <Image src={ASET.gunungTebing.src} alt="" fill sizes="(min-width: 480px) 100vw, 1px" loading="eager" className="object-cover opacity-[0.16] mix-blend-luminosity" />
      </div>
      <div className={`${s.polaAwan} absolute inset-0 opacity-[0.08]`} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#3a0a0c] via-[#3a0a0c]/40 to-[#3a0a0c]" />
    </div>
  );
}

/* ───────── Sampul: jendela bulan berisi foto, kamera menembusnya saat dibuka ───────── */

const MASUK = [0.65, 0, 0.35, 1] as const;

function Sampul({ u, tamu, onOpen }: { u: Undangan; tamu?: string; onOpen: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex justify-center" initial="ada" animate="ada" exit="pergi" variants={{ ada: { opacity: 1 }, pergi: { opacity: 1, transition: { duration: 1.5 } } }}>
      <div className="relative h-full w-full max-w-[440px] overflow-hidden">
        {/* kertas, lentera, jendela bulan & peoni: membesar menembus jendela bulan sambil memudar */}
        <motion.div
          className={`${s.kertas} absolute inset-0`}
          style={{ transformOrigin: "50% 27%" }}
          variants={{
            ada: { opacity: 1, transform: "scale(1)" },
            pergi: { opacity: [1, 1, 0], transform: "scale(3.4)", transition: { duration: 1.5, ease: MASUK, opacity: { duration: 1.5, times: [0, 0.5, 1] } } },
          }}
        >
          <div className={`${s.polaAwan} absolute inset-0 opacity-[0.2]`} />
          <PitaMeander className="absolute inset-x-0 top-3 opacity-80" />
          <Lentera className="left-[3%] w-[14%]" tali="6svh" d={5.4} a={3} />
          <Lentera className="right-[4%] w-[12%]" tali="11svh" d={4.8} a={3.4} jeda={-2} />
          <motion.div
            className="absolute top-[7%] left-1/2 w-[min(66%,40svh)] -translate-x-1/2"
            initial={{ opacity: 0, transform: "scale(0.9) rotate(-20deg)" }}
            animate={{ opacity: 1, transform: "scale(1) rotate(0deg)" }}
            transition={{ duration: 1.6, ease: HALUS, delay: 0.15 }}
          >
            <JendelaBulan src={u.foto.sampul} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} sizes="290px" posisi="50% 30%" preload />
          </motion.div>
          <Bunga a="peoniMerahMuda" className="bottom-[-6%] left-[-14%] w-[40%]" sizes="170px" asal="30% 100%" />
          <Bunga a="peoniSalem" className="right-[-14%] bottom-[-5%] w-[38%]" sizes="160px" varian="B" asal="70% 100%" />
        </motion.div>

        {/* teks sampul: naik lebih cepat dari latarnya */}
        <motion.div
          className="absolute inset-x-0 bottom-[calc(7%+var(--demo-h,0px))] flex flex-col items-center px-10 text-center before:pointer-events-none before:absolute before:inset-x-[6%] before:inset-y-[-6%] before:-z-10 before:rounded-[50%] before:bg-[radial-gradient(closest-side,rgb(252_247_236/0.95),rgb(252_247_236/0.7)_60%,transparent)]"
          variants={{ ada: { opacity: 1, transform: "translateY(0px)" }, pergi: { opacity: 0, transform: "translateY(-140px)", transition: { duration: 0.9, ease: MASUK } } }}
        >
          {[
            <p key="a" className={`${yuji} text-[11px] tracking-[0.42em] text-[#7d1418] uppercase`}>
              The Wedding of
            </p>,
            <h1 key="b" className={`${naskah} mt-1 text-[3.6rem] leading-[1.05] text-[#8a1a1f]`}>
              {u.wanita.panggilan} <span className="text-[#b0842e]">&amp;</span> {u.pria.panggilan}
            </h1>,
            <p key="c" className={`${yuji} mt-1 text-[12.5px] tracking-[0.26em] text-[#2c140f] uppercase`}>
              {u.tanggal}
            </p>,
            <div key="d" className="mt-4 text-[14.5px] leading-snug">
              <p className="text-[#2c140f]/90">Kepada Yth. Bapak/Ibu/Saudara/i</p>
              <p className={`${yuji} mt-1 text-[1.15rem] text-[#8a1a1f]`}>{tamu ?? "Tamu Undangan"}</p>
            </div>,
            <motion.button key="e" type="button" onClick={onOpen} whileTap={{ scale: 0.95 }} className={`${tombolMerah} mt-5`}>
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

/* ───────── Navigasi bawah: pil merah bertepi emas ───────── */

const ikon = {
  beranda: <path d="M4 11 12 4l8 7M6 10v10h12V10" />,
  mempelai: (
    <>
      <circle cx="8" cy="9" r="3" />
      <circle cx="16" cy="9" r="3" />
      <path d="M3 20c0-3 2.5-5 5-5s5 2 5 5M11 20c0-3 2.5-5 5-5s5 2 5 5" />
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
      <circle cx="12" cy="12" r="8.5" />
      <path d="m5.5 16 4-4 3 3 2-2 3.5 3.5" />
    </>
  ),
  cerita: (
    <>
      <path d="M5 4h14M5 20h14" strokeWidth="2.2" />
      <path d="M7 4v16M17 4v16M10 9h4M10 12h4" />
    </>
  ),
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
      transition={{ delay: T_SELESAI, duration: 0.9, ease: HALUS }}
      className="pointer-events-none fixed inset-x-0 bottom-[calc(0.75rem+var(--demo-h,0px))] z-40 flex justify-center px-3"
    >
      <ul className="pointer-events-auto flex items-center gap-1 rounded-full bg-[#9e1c22]/95 p-1.5 shadow-[0_12px_28px_-12px_rgb(40_5_5/0.8)] ring-1 ring-[#f6dc94]/70">
        {MENU.map(({ id, label }) => (
          <li key={id} className="relative">
            <a href={`#${id}`} aria-label={label} className="relative grid size-10 place-items-center rounded-full text-[#fff1d6]">
              {active === id && (
                <motion.span
                  layoutId="or-nav"
                  className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,#b98b33,#f6dc94_50%,#b98b33)]"
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
              )}
              <svg
                viewBox="0 0 24 24"
                className={`relative size-[19px] transition-colors ${active === id ? "text-[#7d1418]" : ""}`}
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
