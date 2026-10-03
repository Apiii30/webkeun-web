"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useBukaUndangan, useParalaks } from "../../pakai";
import type { Undangan } from "../../types";
import { ASET, SUDUT_BAWAH } from "./aset";
import { Isi } from "./bagian";
import { tombolPlum } from "./interaktif";
import { Burung, Butir, Gunung, Janur, KelopakJatuh, Kupu, Pohon, Rumpun, Tumbuh, Wayang, kaushan } from "./ornamen";
import s from "./jawa.module.css";

// Kerangka tema Jawa Klasik: sampul gapura yang meluncur ke atas saat dibuka, kolom undangan selebar HP,
// latar kabut & gunung yang bergeser pelan di belakang isi, butiran cahaya & kelopak yang turun di depannya,
// latar redup di layar lebar, dan navigasi bawah. Khusus tampilan HP seperti tema lain.

export function Jawa({ data: u, tamu }: { data: Undangan; tamu?: string }) {
  const { opened, open } = useBukaUndangan({ halus: false });
  const paralaks = useParalaks();

  return (
    <MotionConfig reducedMotion="user">
      <div
        data-paralaks={paralaks ? "" : undefined}
        className="relative min-h-svh bg-[#e7dbd4] font-[family-name:var(--font-alice)] text-[#5b3b47] selection:bg-[#d9b7c2]/60"
      >
        <LatarSisi />

        <AnimatePresence>{!opened && <Sampul key="sampul" u={u} tamu={tamu} onOpen={open} />}</AnimatePresence>

        <main className={`${s.kertas} relative z-10 mx-auto w-full max-w-[440px] overflow-x-clip`}>
          <LatarJauh />
          <Isi u={u} opened={opened} tamu={tamu} />
        </main>

        {opened && <Suasana />}
        <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center" aria-hidden="true">
          <div className={`${s.progres} h-[3px] w-full max-w-[440px] origin-left bg-gradient-to-r from-[#7b5563] via-[#e2c070] to-[#7b5563]`} />
        </div>
        {opened && <Navigasi />}
        <div id="jw-lapis" />
      </div>
    </MotionConfig>
  );
}

/* ───────── Latar di layar lebar ───────── */

function LatarSisi() {
  return (
    <div className="pointer-events-none fixed inset-0 hidden overflow-hidden min-[480px]:block" aria-hidden="true">
      <div className={`${s.latarSisi} absolute inset-0`}>
        <Image src={ASET.kabut.src} alt="" fill sizes="(min-width: 480px) 100vw, 1px" className="object-cover opacity-30" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#e7dbd4] via-[#e7dbd4]/60 to-[#e7dbd4]" />
    </div>
  );
}

/* ───────── Lapisan paling jauh: kabut & gunung samar di belakang seluruh isi ───────── */

// Menempel di layar (fixed) dan hanya bergeser sedikit sepanjang halaman, jadi isi terasa lewat di depannya.
function LatarJauh() {
  return (
    <div className="pointer-events-none fixed inset-y-0 left-1/2 -z-10 w-full max-w-[440px] -translate-x-1/2 overflow-hidden" aria-hidden="true">
      <div className={`${s.latarGerak} absolute inset-0`}>
        <div className="absolute inset-x-0 top-[8%] h-[46%] opacity-[0.14] [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]">
          <Image src={ASET.kabut.src} alt="" fill sizes="480px" className="object-cover" />
        </div>
        <div className="absolute inset-x-[-20%] bottom-[6%] opacity-[0.16]">
          <Image src={ASET.gunung.src} alt="" width={ASET.gunung.w} height={ASET.gunung.h} sizes="520px" className="h-auto w-full" />
        </div>
      </div>
    </div>
  );
}

/* ───────── Lapisan paling depan: butiran cahaya & kelopak yang turun ───────── */

function Suasana() {
  return (
    <motion.div
      className="pointer-events-none fixed inset-y-0 left-1/2 z-30 w-full max-w-[440px] -translate-x-1/2 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, delay: 1 }}
      aria-hidden="true"
    >
      <Butir n={16} />
      <KelopakJatuh n={5} />
    </motion.div>
  );
}

/* ───────── Sampul ───────── */

// Saat dibuka, seluruh sampul meluncur ke atas dan ornamen beranda mulai tumbuh dari sudut-sudutnya.
function Sampul({ u, tamu, onOpen }: { u: Undangan; tamu?: string; onOpen: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-center"
      initial={{ transform: "translateY(0%)" }}
      exit={{ transform: "translateY(-100%)", transition: { duration: 1, ease: [0.7, 0, 0.3, 1] } }}
    >
      <div className={`${s.kertas} relative h-full w-full max-w-[440px] overflow-hidden`}>
        <div className={`${s.kabut} absolute inset-x-[-10%] top-[20%] h-[50%] opacity-30`}>
          <Image src={ASET.kabut.src} alt="" fill preload sizes="480px" className="object-cover" />
        </div>
        <Gunung tampil jeda={0.1} className="inset-x-[-14%] bottom-[18%]" preload />
        <Burung className="top-[20%] left-0" delay={-4} />
        <Burung className="top-[23%] left-0" delay={-7} size={11} />
        {/* gapura penuh membingkai layar */}
        <Tumbuh dari="t" awal={0.85} durasi={1.6} tampil className="absolute inset-x-0 top-0">
          <Image src={ASET.gapura.src} alt="" width={ASET.gapura.w} height={ASET.gapura.h} sizes="440px" preload className="h-auto w-full" />
        </Tumbuh>
        <Janur sisi="kiri" tampil jeda={0.4} className="top-[3%] left-[14%] w-[26%]" />
        <Janur sisi="kanan" tampil jeda={0.4} className="top-[3%] right-[14%] w-[26%]" />

        <div className="absolute inset-x-[17%] top-[24%] flex flex-col items-center text-center">
          <Tumbuh tampil jeda={0.6} awal={0.4}>
            <h1 className={`${kaushan} text-[2.8rem] leading-[1.05] text-[#5b3b47] [text-shadow:0_2px_12px_rgb(243_235_229/0.9)]`}>
              {u.wanita.panggilan}
              <br />&amp;
              <br />
              {u.pria.panggilan}
            </h1>
          </Tumbuh>
          <Tumbuh tampil jeda={0.9} awal={0.6} className="mt-4 text-[13px] leading-snug">
            <p>Kepada Yth.</p>
            {tamu ? <p className="mt-0.5 text-lg font-bold">{tamu}</p> : <p>Bapak/Ibu/Saudara/i</p>}
          </Tumbuh>
          <Tumbuh tampil jeda={1.1} awal={0.5} className="mt-4">
            <motion.button type="button" onClick={onOpen} whileTap={{ scale: 0.95 }} className={tombolPlum}>
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                <path d="M3 5.5C5.5 4 8.5 4 12 6c3.5-2 6.5-2 9-.5V19c-2.5-1.5-5.5-1.5-9 .5-3.5-2-6.5-2-9-.5Z" />
              </svg>
              Buka Undangan
            </motion.button>
          </Tumbuh>
        </div>

        <Pohon sisi="kiri" tampil jeda={0.6} className="bottom-[16%] left-0 w-[32%]" />
        <Pohon sisi="kanan" tampil jeda={0.6} className="right-0 bottom-[16%] w-[32%]" />
        <Wayang sisi="kiri" tampil jeda={0.8} className="bottom-[calc(7%+var(--demo-h,0px))] left-[1%] w-[30%]" />
        <Wayang sisi="kanan" tampil jeda={0.8} className="right-[1%] bottom-[calc(7%+var(--demo-h,0px))] w-[30%]" />
        <Rumpun items={SUDUT_BAWAH} tampil jeda={1} className="bottom-[var(--demo-h,0px)] left-0 aspect-[1/0.75] w-[56%]" />
        <Rumpun items={SUDUT_BAWAH} tampil jeda={1.1} cermin className="right-0 bottom-[var(--demo-h,0px)] aspect-[1/0.75] w-[56%]" />
        <Kupu className="bottom-[34%] left-[12%]" delay={-3} dekat={false} />
      </div>
    </motion.div>
  );
}

/* ───────── Navigasi bawah: ikon dalam kotak plum ───────── */

const ikon = {
  beranda: <path d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-5h4v5" />,
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
      <path d="M8 3v4M16 3v4M4 10h16M8 14h2M12 14h2M16 14h0M8 17h2M12 17h2" />
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
      transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed inset-x-0 bottom-[calc(0.75rem+var(--demo-h,0px))] z-40 flex justify-center px-3"
    >
      <ul className="pointer-events-auto flex items-center gap-1.5 rounded-xl bg-[#f7efe9]/95 p-1.5 shadow-[0_10px_26px_-10px_rgb(91_59_71/0.6)] ring-1 ring-[#5b3b47]/15">
        {MENU.map(({ id, label }) => (
          <li key={id} className="relative">
            <AnimatePresence>
              {active === id && (
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-[#5b3b47] px-2 py-1 text-[10px] whitespace-nowrap text-[#f7efe9]"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
            <a
              href={`#${id}`}
              aria-label={label}
              className={`relative grid size-10 place-items-center rounded-lg bg-[#5b3b47] text-[#f7efe9] shadow-[inset_0_-3px_0_rgb(0_0_0/0.2)] transition-transform ${active === id ? "-translate-y-1 ring-2 ring-[#e2c070]" : ""}`}
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {ikon[id]}
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
