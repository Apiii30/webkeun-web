"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useBukaUndangan, useParalaks } from "../../pakai";
import { SlotMusik, useMusik } from "../../musik";
import type { Undangan } from "../../types";
import { ASET } from "./aset";
import { Isi } from "./bagian";
import { HALUS, Pembatas, naskah } from "./hias";
import { tombolEmas } from "./interaktif";
import s from "./porselen.module.css";
import { TombolMusik } from "./musik";

// Kerangka tema Biru Porselen: sampul foto penuh yang terangkat saat dibuka (teksnya naik lebih cepat dari fotonya),
// lalu animasi jendela gunungan di beranda (gerbang.tsx). Kolom undangan selebar HP, latar redup di layar lebar,
// dan navigasi bawah. Khusus tampilan HP seperti tema lain.

export function Porselen({ data: u, tamu }: { data: Undangan; tamu?: string }) {
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
      <div
        data-paralaks={paralaks ? "" : undefined}
        className="relative min-h-svh bg-[#dfe6f1] font-[family-name:var(--font-lora)] text-[#1f3768] selection:bg-[#d8b56e]/50"
      >
        <LatarSisi />

        <AnimatePresence>{!opened && <Sampul key="sampul" u={u} tamu={tamu} onOpen={buka} />}</AnimatePresence>

        <SlotMusik muncul={opened}>{u.musik && <TombolMusik main={musik.main} onUbah={musik.ubah} lagu={u.musik} />}</SlotMusik>

        <main className={`${s.kertas} relative z-10 mx-auto w-full max-w-[440px] overflow-x-clip`}>
          <Isi u={u} opened={opened} tamu={tamu} />
        </main>

        <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center" aria-hidden="true">
          <div className={`${s.progres} h-[2px] w-full max-w-[440px] origin-left bg-gradient-to-r from-[#27427a] via-[#d8b56e] to-[#27427a]`} />
        </div>
        {opened && <Navigasi />}
        <div id="pb-lapis" />
      </div>
    </MotionConfig>
  );
}

/* ───────── Latar di layar lebar ───────── */

function LatarSisi() {
  return (
    <div className="pointer-events-none fixed inset-0 hidden overflow-hidden min-[480px]:block" aria-hidden="true">
      <div className={`${s.latarSisi} absolute inset-0`}>
        <Image src={ASET.airTerjun.src} alt="" fill sizes="(min-width: 480px) 100vw, 1px" className="object-cover opacity-35" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#dfe6f1] via-[#dfe6f1]/55 to-[#dfe6f1]" />
    </div>
  );
}

/* ───────── Sampul: foto penuh, terangkat saat dibuka ───────── */

const ANGKAT = [0.76, 0, 0.24, 1] as const;

function Sampul({ u, tamu, onOpen }: { u: Undangan; tamu?: string; onOpen: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex justify-center" initial="ada" animate="ada" exit="pergi" variants={{ ada: { opacity: 1 }, pergi: { opacity: 1, transition: { duration: 1.3 } } }}>
      <div className="relative h-full w-full max-w-[440px] overflow-hidden">
        {/* foto & gradasi */}
        <motion.div
          className="absolute inset-0 bg-[#0f1c38] shadow-[0_30px_40px_rgb(15_28_56/0.45)]"
          variants={{ ada: { transform: "translateY(0%)" }, pergi: { transform: "translateY(-100%)", transition: { duration: 1.25, ease: ANGKAT } } }}
        >
          <motion.div className="absolute inset-0" initial={{ transform: "scale(1.12)" }} animate={{ transform: "scale(1)" }} transition={{ duration: 9, ease: "easeOut" }}>
            <Image src={u.foto.sampul} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} fill preload sizes="(min-width: 440px) 440px, 100vw" className="object-cover object-[50%_30%]" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f1c38]/45 via-[#0f1c38]/10 to-[#0f1c38]/90" />
          <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#14254a] via-[#14254a]/70 to-transparent" />
        </motion.div>

        {/* teks sampul: naik lebih cepat dari fotonya */}
        <motion.div
          className="absolute inset-x-0 bottom-[calc(9%+var(--demo-h,0px))] flex flex-col items-center px-8 text-center text-[#f6f3ec]"
          variants={{ ada: { opacity: 1, transform: "translateY(0px)" }, pergi: { opacity: 0, transform: "translateY(-260px)", transition: { duration: 0.95, ease: ANGKAT } } }}
        >
          {[
            <p key="a" className="text-[10px] tracking-[0.45em] uppercase opacity-85">
              The Wedding of
            </p>,
            <h1 key="b" className={`${naskah} mt-1 text-[3.5rem] leading-[1.1]`}>
              {u.wanita.panggilan} <span className="text-[#d8b56e]">&amp;</span> {u.pria.panggilan}
            </h1>,
            <Pembatas key="c" terang />,
            <div key="d" className="mt-3 text-[13px] leading-snug">
              <p className="opacity-80">Kepada Yth. Bapak/Ibu/Saudara/i</p>
              <p className="mt-1 text-base font-semibold">{tamu ?? "Tamu Undangan"}</p>
            </div>,
            <motion.button key="e" type="button" onClick={onOpen} whileTap={{ scale: 0.95 }} className={`${tombolEmas} mt-5`}>
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 7.5 12 13l8-5.5M5 5h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
              </svg>
              Buka Undangan
            </motion.button>,
          ].map((el, i) => (
            <motion.div key={i} initial={{ opacity: 0, transform: "translateY(22px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} transition={{ duration: 1.2, ease: HALUS, delay: 0.3 + i * 0.15 }}>
              {el}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ───────── Navigasi bawah: pil porselen putih ───────── */

const ikon = {
  beranda: <path d="M12 3C14 7 18 9 18 15c0 3.5-2.7 6-6 6s-6-2.5-6-6c0-6 4-8 6-12Z" />,
  mempelai: (
    <>
      <rect x="5" y="3" width="6" height="12" rx="3" />
      <rect x="13" y="9" width="6" height="12" rx="3" />
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
      <ellipse cx="12" cy="12" rx="9" ry="4" />
      <rect x="9" y="5" width="6" height="9" rx="3" />
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
      transition={{ delay: 5, duration: 0.9, ease: HALUS }}
      className="pointer-events-none fixed inset-x-0 bottom-[calc(0.75rem+var(--demo-h,0px))] z-40 flex justify-center px-3"
    >
      <ul className="pointer-events-auto flex items-center gap-1 rounded-full bg-[#fbfaf6]/95 p-1.5 shadow-[0_12px_28px_-12px_rgb(15_28_56/0.7)] ring-1 ring-[#27427a]/20">
        {MENU.map(({ id, label }) => (
          <li key={id} className="relative">
            <a href={`#${id}`} aria-label={label} className="relative grid size-10 place-items-center rounded-full text-[#27427a]">
              {active === id && <motion.span layoutId="pb-nav" className={`${s.kawung} absolute inset-0 rounded-full ring-2 ring-[#d8b56e]`} transition={{ type: "spring", stiffness: 320, damping: 30 }} />}
              <svg viewBox="0 0 24 24" className={`relative size-[19px] transition-colors ${active === id ? "text-[#fbfaf6]" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {ikon[id]}
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
