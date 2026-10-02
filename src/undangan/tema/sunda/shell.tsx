"use client";

import { AnimatePresence, MotionConfig, motion, type Variants } from "motion/react";
import { useEffect, useState } from "react";
import { useBukaUndangan, useParalaks } from "../../pakai";
import type { Undangan } from "../../types";
import { RUMPUN_SUDUT, RUMPUN_SUDUT_KANAN } from "./aset";
import { Isi } from "./bagian";
import { tombolBata } from "./interaktif";
import { Aksara, Bingkai, Kujang, MegaMendung, MelatiJatuh, Rumpun, Siger, Tumpal } from "./ornamen";
import s from "./sunda.module.css";

// Kerangka tema Art Sunda: sampul berupa dua daun pintu (lawang) bermotif mega mendung yang terbuka,
// kolom undangan krem, latar nila di layar lebar, dan navigasi bawah.
// Tampilan khusus HP; di layar lebar undangan tetap selebar HP di tengah.

const ease = [0.22, 1, 0.36, 1] as const;
const rozha = "font-[family-name:var(--font-rozha)]";

export function Sunda({ data: u, tamu }: { data: Undangan; tamu?: string }) {
  const { opened, open } = useBukaUndangan({ halus: false });
  const paralaks = useParalaks();

  return (
    <MotionConfig reducedMotion="user">
      <div data-paralaks={paralaks ? "" : undefined} className="relative min-h-svh bg-[#22344a] font-[family-name:var(--font-jost)] text-[#3a3330] selection:bg-[#d9bd85]/50">
        <LatarSisi />

        <AnimatePresence>{!opened && <Sampul key="sampul" u={u} tamu={tamu} onOpen={open} />}</AnimatePresence>

        <main className={`${s.kertas} relative z-10 mx-auto w-full max-w-[440px] overflow-x-clip`}>
          <Isi u={u} opened={opened} tamu={tamu} />
        </main>

        {opened && (
          <>
            <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center" aria-hidden="true">
              <div className={`${s.progres} h-[3px] w-full max-w-[440px] origin-left bg-gradient-to-r from-[#8a4b35] via-[#d9bd85] to-[#2f4560]`} />
            </div>
            <Navigasi />
          </>
        )}
        <div id="sd-lapis" />
      </div>
    </MotionConfig>
  );
}

/* ───────── Latar di layar lebar: nila dengan mega mendung ───────── */

function LatarSisi() {
  const awan = [
    { c: "top-[6%] left-[6%] w-56", d: "0s" },
    { c: "top-[30%] left-[14%] w-40", d: "-5s" },
    { c: "top-[62%] left-[4%] w-64", d: "-9s" },
    { c: "top-[12%] right-[8%] w-48", d: "-3s" },
    { c: "top-[44%] right-[3%] w-60", d: "-7s" },
    { c: "top-[76%] right-[12%] w-44", d: "-11s" },
  ];
  return (
    <div className="pointer-events-none fixed inset-0 hidden overflow-hidden min-[480px]:block" aria-hidden="true">
      <div className={`${s.nila} absolute inset-0`} />
      <div className={`${s.latarSisi} absolute inset-0`}>
        {awan.map((a) => (
          <MegaMendung key={a.c} warna="emas" className={`${s.awan} absolute opacity-25 ${a.c}`} style={{ animationDelay: a.d }} />
        ))}
      </div>
    </div>
  );
}

/* ───────── Sampul: kartu nama di depan dua daun pintu ───────── */

// Daun pintu: nila dengan bingkai lengkung keemasan, mega mendung, dan kujang di sisi tengah.
// Saat dibuka berayun 3D ke arah tamu. Geraknya `transform` utuh supaya dijalankan mesin animasi browser.
function Lawang({ sisi }: { sisi: "kiri" | "kanan" }) {
  const kiri = sisi === "kiri";
  const awan = kiri
    ? [
        { c: "top-[14%] -left-8 w-40", d: "0s" },
        { c: "top-[44%] left-2 w-28", d: "-4s" },
        { c: "bottom-[12%] -left-6 w-36", d: "-8s" },
      ]
    : [
        { c: "top-[22%] -right-8 w-36", d: "-2s" },
        { c: "top-[52%] right-0 w-32", d: "-6s" },
        { c: "bottom-[8%] -right-10 w-40", d: "-10s" },
      ];
  return (
    <motion.div
      variants={{
        hidden: { transform: "rotateY(0deg)" },
        exit: { transform: `rotateY(${kiri ? -100 : 100}deg)`, transition: { duration: 1.7, ease: [0.65, 0, 0.35, 1], delay: 0.35 } },
      }}
      style={{ transformOrigin: kiri ? "0% 50%" : "100% 50%", backfaceVisibility: "hidden" }}
      className={`${s.nila} absolute inset-y-0 ${kiri ? "left-0" : "right-0"} w-1/2 overflow-hidden`}
    >
      {awan.map((a) => (
        <MegaMendung key={a.c} warna="emas" className={`${s.awan} absolute opacity-40 ${a.c}`} style={{ animationDelay: a.d }} />
      ))}
      {/* bingkai lengkung: separuh di tiap daun, bertemu di tengah */}
      <div className={`absolute inset-y-5 ${kiri ? "right-0 left-4 rounded-tl-[11rem] border-l" : "right-4 left-0 rounded-tr-[11rem] border-r"} border-y border-[#d9bd85]/70`} />
      <div className={`absolute inset-y-8 ${kiri ? "right-0 left-7 rounded-tl-[10rem] border-l" : "right-7 left-0 rounded-tr-[10rem] border-r"} border-y border-dashed border-[#d9bd85]/40`} />
      <Tumpal warna="#d9bd85" className={`absolute bottom-1.5 opacity-60 ${kiri ? "left-0 w-full" : "right-0 w-full"}`} />
      <Kujang className={`absolute top-1/2 h-48 w-auto -translate-y-1/2 drop-shadow-[0_8px_10px_rgb(0_0_0/0.35)] ${kiri ? "right-3 -scale-x-100" : "left-3"}`} />
      {/* garis temu & gagang pintu */}
      <span className={`absolute inset-y-0 w-px bg-[#d9bd85]/80 ${kiri ? "right-0" : "left-0"}`} />
      <span className={`absolute top-[62%] size-5 rounded-full border-2 border-[#d9bd85] ${kiri ? "right-2" : "left-2"}`} />
    </motion.div>
  );
}

const isi: Variants = {
  hidden: { opacity: 0, transform: "translateY(22px)" },
  show: (d: number) => ({ opacity: 1, transform: "translateY(0px)", transition: { duration: 1, ease, delay: 0.5 + d } }),
};

function Sampul({ u, tamu, onOpen }: { u: Undangan; tamu?: string; onOpen: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex justify-center" initial="hidden" animate="show" exit="exit">
      <motion.div
        variants={{ exit: { opacity: 0, transition: { duration: 0.5, delay: 1.6 } } }}
        className="relative h-full w-full max-w-[440px] overflow-hidden [perspective:1200px]"
      >
        <Lawang sisi="kiri" />
        <Lawang sisi="kanan" />
        <MelatiJatuh n={6} />

        <motion.div
          variants={{
            hidden: { opacity: 0, transform: "translateY(30px) scale(0.97)" },
            show: { opacity: 1, transform: "translateY(0px) scale(1)", transition: { duration: 1.2, ease, delay: 0.2 } },
            exit: { opacity: 0, transform: "translateY(-24px) scale(0.95)", transition: { duration: 0.5 } },
          }}
          className={`${s.kertas} absolute inset-x-[7%] top-[7%] bottom-[calc(6%+var(--demo-h,0px))] rounded-t-full border border-[#d9bd85] p-1.5 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.7)]`}
        >
          <div className="relative flex h-full flex-col items-center justify-center rounded-t-full border border-dashed border-[#8a4b35]/35 px-5 pt-10 pb-6 text-center">
            <motion.div custom={0} variants={isi}>
              <Aksara className="text-lg text-[#2f4560]">ᮝᮤᮜᮥᮏᮨᮀ ᮞᮥᮙ᮪ᮕᮤᮀ</Aksara>
              <p className="text-[10px] tracking-[0.35em] text-[#2f4560]/70 uppercase">Wilujeng Sumping</p>
            </motion.div>
            <motion.div custom={0.15} variants={isi} className="relative mt-4">
              <Bingkai src={u.foto.sampul} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} className="aspect-[3/4.2] h-[27svh] max-h-[15rem]" sizes="200px" preload />
              <Rumpun items={RUMPUN_SUDUT} muncul={false} className="inset-x-[-6%] -bottom-1 aspect-[1/0.45]" />
              <Rumpun items={RUMPUN_SUDUT_KANAN} muncul={false} className="inset-x-[-6%] -bottom-1 aspect-[1/0.45]" />
            </motion.div>
            <motion.div custom={0.3} variants={isi}>
              <Siger className={`${s.melayang} mx-auto mt-4 w-16`} />
            </motion.div>
            <motion.p custom={0.35} variants={isi} className="text-[10px] tracking-[0.35em] text-[#2f4560] uppercase">
              The Wedding Of
            </motion.p>
            <motion.h1 custom={0.45} variants={isi} className={`${rozha} mt-1 text-[2.2rem] leading-tight text-[#8a4b35]`}>
              {u.wanita.panggilan} &amp; {u.pria.panggilan}
            </motion.h1>
            <motion.div custom={0.6} variants={isi} className="mt-3 text-sm text-[#3a3330]">
              <p className="text-[#3a3330]/70">Kepada Yth.</p>
              {tamu ? <p className={`${rozha} mt-0.5 text-lg`}>{tamu}</p> : <p className="mt-0.5">Bapak/Ibu/Saudara/i</p>}
            </motion.div>
            <motion.button custom={0.75} variants={isi} type="button" onClick={onOpen} whileTap={{ scale: 0.95 }} className={`${tombolBata} mt-5`}>
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              Buka Undangan
            </motion.button>
          </div>
        </motion.div>
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
      className="pointer-events-none fixed inset-x-0 bottom-[calc(0.75rem+var(--demo-h,0px))] z-40 flex justify-center px-3"
    >
      <ul className="pointer-events-auto flex items-center gap-1 rounded-2xl border border-[#d9bd85]/50 bg-[#2f4560]/95 p-1.5 shadow-[0_12px_30px_-10px_rgb(22_33_47/0.8)]">
        {MENU.map(({ id, label }) => (
          <li key={id} className="relative">
            <AnimatePresence>
              {active === id && (
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-[#2f4560]/95 px-2 py-1 text-[10px] whitespace-nowrap text-[#f4eee2]"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
            <a href={`#${id}`} aria-label={label} className={`relative grid size-10 place-items-center rounded-xl transition-colors ${active === id ? "text-[#2f4560]" : "text-[#f4eee2]"}`}>
              {active === id && <motion.span layoutId="sd-nav" transition={{ type: "spring", stiffness: 380, damping: 30 }} className="absolute inset-0 rounded-xl bg-[#d9bd85]" />}
              <svg viewBox="0 0 24 24" className="relative size-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {ikon[id]}
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
