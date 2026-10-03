"use client";

import { AnimatePresence, MotionConfig, type MotionValue, motion, useMotionValue, useSpring, useTransform, type Variants } from "motion/react";
import { type ReactNode, useEffect, useState } from "react";
import { useBukaUndangan, useParalaks } from "../../pakai";
import type { Undangan } from "../../types";
import { RUMPUN_KANAN, RUMPUN_KIRI } from "./aset";
import { Isi } from "./bagian";
import { tombolEmas } from "./interaktif";
import { Aksara, Bukit, Burung, Gunung, Gunungan, Janur, Kabut, KelopakJatuh, Langit, Matahari, Pemisah, Rumpun, Rumput } from "./ornamen";
import s from "./jawa.module.css";

// Kerangka tema Jawa Klasik: sampul lanskap pagi dengan gunungan berisi foto (saat dibuka gunungan diputar seperti
// dalang membuka lakon, kamera masuk ke lembah & kabut tersibak), kolom undangan, dan navigasi bawah.
// Di HP undangan memenuhi layar; di tablet kolomnya di tengah; di laptop kolomnya di kanan dan sisi kiri jadi
// panel lanskap yang mengikuti kursor & beranjak senja seiring undangan dibaca.

const ease = [0.22, 1, 0.36, 1] as const;
const marcellus = "font-[family-name:var(--font-marcellus)]";
const script = "font-[family-name:var(--font-corinthia)]";

export function Jawa({ data: u, tamu }: { data: Undangan; tamu?: string }) {
  const { opened, open } = useBukaUndangan({ halus: false });
  const paralaks = useParalaks();

  return (
    <MotionConfig reducedMotion="user">
      <div data-paralaks={paralaks ? "" : undefined} className="relative min-h-svh bg-[#2c3d31] font-[family-name:var(--font-mulish)] text-[#2f3d33] selection:bg-[#c9a35f]/40">
        <LatarSisi />
        <PanelLebar u={u} opened={opened} />

        <AnimatePresence>{!opened && <Sampul key="sampul" u={u} tamu={tamu} onOpen={open} />}</AnimatePresence>

        <main className={`${s.kertas} relative z-10 mx-auto w-full max-w-[440px] overflow-x-clip lg:mr-0 lg:shadow-[-30px_0_60px_-30px_rgb(0_0_0/0.6)]`}>
          <Isi u={u} opened={opened} tamu={tamu} />
        </main>

        {opened && (
          <>
            {/* garis emas di atas yang memanjang sesuai posisi scroll */}
            <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center lg:left-auto lg:w-[440px]" aria-hidden="true">
              <div className={`${s.progres} h-[3px] w-full max-w-[440px] origin-left bg-gradient-to-r from-[#8d6a35] via-[#f1dea6] to-[#c9a35f]`} />
            </div>
            <Navigasi />
          </>
        )}
        <div id="jw-lapis" />
      </div>
    </MotionConfig>
  );
}

/* ───────── Latar di tablet: hijau tua bermotif truntum ───────── */

function LatarSisi() {
  return (
    <div className="pointer-events-none fixed inset-0 hidden overflow-hidden min-[480px]:block lg:hidden" aria-hidden="true">
      <div className={`${s.hijau} absolute inset-0`} />
      <div className={`${s.truntum} absolute inset-0 opacity-[0.12]`} />
      <Kabut className="top-[30%] h-40 opacity-10" />
      <Kabut balik className="top-[70%] h-40 opacity-10" />
    </div>
  );
}

/* ───────── Panel lanskap di laptop ───────── */

// Posisi kursor (-1..1) yang diperhalus pegas. Hanya untuk mouse/trackpad, dan mati bila tamu memilih "kurangi gerakan".
function useKursor() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 40, damping: 18 });
  const sy = useSpring(y, { stiffness: 40, damping: 18 });
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gerak = (e: PointerEvent) => {
      x.set((e.clientX / innerWidth) * 2 - 1);
      y.set((e.clientY / innerHeight) * 2 - 1);
    };
    addEventListener("pointermove", gerak);
    return () => removeEventListener("pointermove", gerak);
  }, [x, y]);
  return { sx, sy };
}

// Lapisan yang bergeser berlawanan arah kursor; k = jarak geser (px), makin dekat lapisannya makin besar.
// Geser kursor di pembungkus ini, efek scroll di elemen dalamnya (keduanya transform, jadi tak boleh di elemen yang sama).
function IkutKursor({ k, kursor, className = "", children }: { k: number; kursor: { sx: MotionValue<number>; sy: MotionValue<number> }; className?: string; children: ReactNode }) {
  const x = useTransform(kursor.sx, (v) => v * -k);
  const y = useTransform(kursor.sy, (v) => v * -k * 0.4);
  return (
    <motion.div style={{ x, y }} className={`absolute -inset-x-10 inset-y-0 ${className}`}>
      {children}
    </motion.div>
  );
}

function PanelLebar({ u, opened }: { u: Undangan; opened: boolean }) {
  const kursor = useKursor();
  const muncul = (d: number) => ({
    initial: { opacity: 0, transform: "translateY(30px)" },
    animate: opened ? { opacity: 1, transform: "translateY(0px)" } : {},
    transition: { duration: 1.4, ease, delay: 1.2 + d },
  });
  return (
    <div className="fixed inset-y-0 left-0 right-[440px] hidden overflow-hidden lg:block" aria-hidden="true">
      <Langit />
      {/* hari beranjak senja seiring undangan dibaca */}
      <div className={`${s.panelSenja} absolute inset-0 bg-[linear-gradient(to_bottom,#e7d3c7_0%,#efd8c6_45%,#cdb9ae_80%,#b9a9a0_100%)] opacity-0`} />
      <IkutKursor k={6} kursor={kursor}>
        <div className={`${s.panelMatahari} absolute inset-0`}>
          <Matahari className="top-[12%] left-[18%] w-20" />
        </div>
        <Burung className="top-[20%] left-0" delay={-4} size={26} />
        <Burung className="top-[34%] left-0" delay={-19} size={18} />
      </IkutKursor>
      <IkutKursor k={14} kursor={kursor}>
        <div className={`${s.panelGunung} absolute inset-0 origin-bottom`}>
          <Gunung className="inset-x-0 bottom-[12%] h-[56%]" sizes="(min-width: 1024px) calc(100vw - 440px), 1px" posisi="50% 100%" />
          <Kabut className="bottom-[18%] h-32" />
        </div>
      </IkutKursor>
      <IkutKursor k={26} kursor={kursor}>
        <Bukit lapis="tengah" className="inset-x-0 bottom-[4%] h-[24%]" />
        <Kabut balik className="bottom-[6%] h-24 opacity-70" />
      </IkutKursor>
      <IkutKursor k={42} kursor={kursor}>
        <div className={`${s.panelDekat} absolute inset-0 origin-bottom`}>
          <Bukit lapis="depan" className="inset-x-0 -bottom-2 h-[13%]" />
          <Rumput className="inset-x-0 bottom-[5%] h-14" />
          <Rumpun items={RUMPUN_KIRI} tampil={opened} jeda={1.4} lebar={900} className="-left-[4%] bottom-[-4%] aspect-[1/0.5] w-[62%]" />
          <Rumpun items={RUMPUN_KANAN} tampil={opened} jeda={1.6} lebar={900} className="-right-[4%] bottom-[-4%] aspect-[1/0.5] w-[62%]" />
        </div>
      </IkutKursor>
      <Janur className="absolute bottom-[8%] left-6 h-[62%]" />
      <KelopakJatuh n={10} />

      <div className="relative flex h-full flex-col items-center px-10 pt-[7vh] text-center">
        <motion.div {...muncul(0)}>
          <div className={s.dalang}>
            <Gunungan className="w-16" />
          </div>
        </motion.div>
        <motion.div {...muncul(0.2)}>
          <Aksara className="mt-3 text-xl leading-[2.2] text-[#3d5243]/80">ꦥꦮꦶꦮꦲꦤ꧀</Aksara>
          <p className="text-xs tracking-[0.45em] text-[#3d5243]/80 uppercase">The Wedding Of</p>
        </motion.div>
        <motion.p {...muncul(0.4)} className={`${script} mt-1 text-[clamp(4.5rem,7vw,7.5rem)] leading-none text-[#2f3d33]`}>
          {u.wanita.panggilan} <span className="text-[#b08a4a]">&amp;</span> {u.pria.panggilan}
        </motion.p>
        <motion.div {...muncul(0.6)} className="mt-3">
          <Pemisah />
          <p className={`${marcellus} mt-2 tracking-[0.3em] text-[#3d5243] uppercase`}>{u.tanggal}</p>
          <p className="mx-auto mt-3 max-w-md text-[15px] text-[#2f3d33]/75 italic">“{u.kutipan}”</p>
        </motion.div>
      </div>
    </div>
  );
}

/* ───────── Sampul ───────── */

const isi: Variants = {
  hidden: { opacity: 0, transform: "translateY(22px)" },
  show: (d: number) => ({ opacity: 1, transform: "translateY(0px)", transition: { duration: 1, ease, delay: 0.5 + d } }),
  exit: { opacity: 0, transform: "translateY(-16px)", transition: { duration: 0.45 } },
};

function Sampul({ u, tamu, onOpen }: { u: Undangan; tamu?: string; onOpen: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50" initial="hidden" animate="show" exit="exit">
      <motion.div variants={{ exit: { opacity: 0, transition: { duration: 0.7, delay: 1.3 } } }} className="absolute inset-0 overflow-hidden">
        {/* lanskap: perlahan mendekat saat tampil; saat dibuka kamera seolah masuk ke lembah */}
        <motion.div
          className="absolute inset-0"
          style={{ transformOrigin: "50% 72%" }}
          variants={{
            hidden: { transform: "scale(1.12)" },
            show: { transform: "scale(1)", transition: { duration: 5, ease: "easeOut" } },
            exit: { transform: "scale(1.5) translateY(4%)", transition: { duration: 1.9, ease: [0.65, 0, 0.35, 1] } },
          }}
        >
          <Langit />
          <Matahari className="top-[10%] right-[14%] w-14" />
          <Burung className="top-[18%] left-0" delay={-9} />
          <Gunung preload className="inset-x-0 bottom-[14%] h-[44%]" posisi="48% 100%" />
          <Kabut className="bottom-[19%] h-24" />
          <Bukit lapis="tengah" className="inset-x-0 bottom-[5%] h-[20%]" />
          <Kabut balik className="bottom-[6%] h-20 opacity-70" />
          <Bukit lapis="depan" className="inset-x-0 bottom-0 h-[11%]" />
          <Rumput className="inset-x-0 bottom-[4%] h-10" />
        </motion.div>
        {/* bunga di kaki: menyingkir ke bawah saat dibuka */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-[var(--demo-h,0px)] mx-auto aspect-[1/0.5] max-w-[560px]"
          variants={{
            hidden: { opacity: 0, transform: "translateY(30%)" },
            show: { opacity: 1, transform: "translateY(0%)", transition: { duration: 1.6, ease, delay: 0.3 } },
            exit: { opacity: 0, transform: "translateY(40%)", transition: { duration: 0.9, ease } },
          }}
        >
          <Rumpun items={[...RUMPUN_KIRI, ...RUMPUN_KANAN]} muncul={false} className="inset-x-0 -bottom-[6%] aspect-[1/0.5]" />
        </motion.div>
        <KelopakJatuh n={6} />

        {/* kabut yang tersibak menutup layar saat undangan dibuka */}
        {[-1, 1].map((arah) => (
          <motion.div
            key={arah}
            className={`pointer-events-none absolute inset-y-0 w-[75%] ${arah < 0 ? "left-0" : "right-0"}`}
            variants={{
              hidden: { opacity: 0, transform: `translateX(${arah * 100}%)` },
              exit: { opacity: 1, transform: "translateX(0%)", transition: { duration: 1.3, ease: [0.65, 0, 0.35, 1], delay: 0.35 } },
            }}
          >
            <div
              className={`h-full w-full ${arah < 0 ? "bg-[linear-gradient(90deg,#f4f5ed_55%,transparent)]" : "bg-[linear-gradient(270deg,#f4f5ed_55%,transparent)]"}`}
            />
          </motion.div>
        ))}

        <div className="relative mx-auto flex h-full max-w-[440px] flex-col items-center justify-center px-6 pb-[calc(1.5rem+var(--demo-h,0px))] text-center [perspective:1000px]">
          <motion.div custom={0} variants={isi}>
            <Aksara className="text-lg leading-[2.2] text-[#3d5243]">ꦱꦸꦒꦼꦁꦫꦮꦸꦃ</Aksara>
            <p className="text-[10px] tracking-[0.4em] text-[#3d5243]/80 uppercase">Sugeng Rawuh</p>
          </motion.div>

          {/* gunungan berisi foto: saat dibuka diputar seperti dalang membuka lakon, lalu terbang ke atas */}
          <motion.div
            className="mt-3"
            variants={{
              hidden: { opacity: 0, transform: "translateY(40px) rotateY(0deg) scale(0.85)" },
              show: { opacity: 1, transform: "translateY(0px) rotateY(0deg) scale(1)", transition: { duration: 1.4, ease, delay: 0.2 } },
              exit: { opacity: 0, transform: "translateY(-38vh) rotateY(540deg) scale(0.5)", transition: { duration: 1.5, ease: [0.55, 0, 0.3, 1] } },
            }}
          >
            <div className={s.dalang}>
              <Gunungan foto={u.foto.sampul} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} className="w-[min(50vw,23svh,13rem)]" />
            </div>
          </motion.div>

          <motion.p custom={0.3} variants={isi} className="mt-4 text-[10px] tracking-[0.4em] text-[#3d5243] uppercase">
            The Wedding Of
          </motion.p>
          <motion.h1 custom={0.4} variants={isi} className={`${script} text-[3.6rem] leading-[1.05] text-[#2f3d33]`}>
            {u.wanita.panggilan} <span className="text-[#b08a4a]">&amp;</span> {u.pria.panggilan}
          </motion.h1>
          <motion.div custom={0.55} variants={isi} className="mt-1 text-sm text-[#2f3d33]">
            <p className="text-[#2f3d33]/70">Kepada Yth.</p>
            {tamu ? <p className={`${marcellus} mt-0.5 text-lg tracking-wide`}>{tamu}</p> : <p className="mt-0.5">Bapak/Ibu/Saudara/i</p>}
          </motion.div>
          <motion.button custom={0.7} variants={isi} type="button" onClick={onOpen} whileTap={{ scale: 0.95 }} className={`${tombolEmas} mt-5`}>
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
      transition={{ delay: 2, duration: 0.9, ease }}
      className="pointer-events-none fixed inset-x-0 bottom-[calc(0.75rem+var(--demo-h,0px))] z-40 flex justify-center px-3 lg:left-auto lg:w-[440px]"
    >
      <ul className="pointer-events-auto flex items-center gap-1 rounded-2xl border border-[#c9a35f]/50 bg-[#3d5243]/95 p-1.5 shadow-[0_12px_30px_-10px_rgb(31_43_34/0.8)]">
        {MENU.map(({ id, label }) => (
          <li key={id} className="relative">
            <AnimatePresence>
              {active === id && (
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-[#3d5243]/95 px-2 py-1 text-[10px] whitespace-nowrap text-[#f4f1e4]"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
            <a href={`#${id}`} aria-label={label} className={`relative grid size-10 place-items-center rounded-xl transition-colors ${active === id ? "text-[#2c3d31]" : "text-[#f4f1e4]"}`}>
              {active === id && <motion.span layoutId="jw-nav" transition={{ type: "spring", stiffness: 380, damping: 30 }} className="absolute inset-0 rounded-t-[1.1rem] rounded-b-lg bg-[#e3c98a]" />}
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
