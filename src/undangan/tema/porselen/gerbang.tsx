"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { type ReactNode, useState } from "react";
import type { Undangan } from "../../types";
import { ASET, MASKER_GUNUNGAN } from "./aset";
import { Bunga, Burung, Danau, FotoGunungan, Gambar, HALUS, Pembatas, Perahu, TepiGunungan, gilda, naskah } from "./hias";
import s from "./porselen.module.css";

// Beranda tema Biru Porselen: pemandangan danau & air terjun bergaya lukisan porselen biru-putih, sekaligus
// animasi pembuka undangan. Urutannya (detik setelah "Buka Undangan" ditekan):
//   0.0  foto sampul terangkat (shell.tsx) → tampak kertas gading dengan jendela berbentuk gunungan bertepi timbul
//   1.4  dua daun pintu batik kawung di jendela itu bergeser membuka
//   2.2  rimbun pohon emas di baliknya tersibak ke kiri-kanan → tampak danau biru di kejauhan
//   3.0  kamera menembus jendela: kertas & bingkainya membesar melewati layar, sementara pemandangan danau
//        di baliknya mengendap ke ukuran asli dengan kecepatan berbeda per lapisan (parallax)
//   4.4  nama mempelai muncul di langit
//   5.0  foto mempelai naik dari danau di dalam jendela gunungan bertepi timbul, lalu tersingkap dari bawah
// Saat beranda digulir keluar, tiap lapisan pergi dengan kecepatan berbeda (kelas keluar* di CSS).

const T_PINTU = 1.4;
const T_RIMBUN = 2.2;
const T_TEMBUS = 3.0;
const T_TEKS = 4.4;
const T_FOTO = 5.0;
// detik saat seluruh animasi pembuka selesai (navigasi bawah baru muncul sesudahnya, lihat shell.tsx)
export const T_SELESAI = T_FOTO + 1.9;

const MENGENDAP = { duration: 2.6, ease: [0.2, 0.7, 0.2, 1], delay: T_TEMBUS } as const;

// Satu lapisan pemandangan: mulai sedikit diperbesar (terlihat dari balik jendela) lalu mengendap ke ukuran asli
function Lapis({ awal, buka, keluar, children }: { awal: number; buka: boolean; keluar?: string; children: ReactNode }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${keluar ?? ""}`}>
      <motion.div className="absolute inset-0" initial={{ transform: `scale(${awal})` }} animate={buka ? { transform: "scale(1)" } : undefined} transition={MENGENDAP}>
        {children}
      </motion.div>
    </div>
  );
}

// Medali bunga di tengah pintu (terbelah dua bersama pintunya)
export function Medali({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-60 -60 120 120" className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <circle r="52" fill="#27427a" stroke="#dbe5f3" strokeWidth="1.6" />
      <circle r="45" fill="none" stroke="#dbe5f3" strokeWidth="1" strokeDasharray="2 4" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
        <path key={r} d="M0-8C9-18 9-30 0-40-9-30-9-18 0-8Z" transform={`rotate(${r})`} fill="none" stroke="#dbe5f3" strokeWidth="1.4" />
      ))}
      <circle r="8" fill="#d8b56e" stroke="#dbe5f3" strokeWidth="1.2" />
    </svg>
  );
}

const MASKER_KERTAS = {
  maskImage: `linear-gradient(#000, #000), ${MASKER_GUNUNGAN}`,
  WebkitMaskImage: `linear-gradient(#000, #000), ${MASKER_GUNUNGAN}`,
  maskSize: "100% 100%, 66% auto",
  WebkitMaskSize: "100% 100%, 66% auto",
  maskPosition: "0 0, 50% 50%",
  WebkitMaskPosition: "0 0, 50% 50%",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskComposite: "exclude",
  WebkitMaskComposite: "xor",
} as const;

const MASKER_JENDELA = { maskImage: MASKER_GUNUNGAN, WebkitMaskImage: MASKER_GUNUNGAN, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" } as const;

/* ───────── Jendela pembuka: kertas berlubang gunungan + pintu batik + rimbun emas ───────── */

function JendelaPembuka({ buka, onSelesai }: { buka: boolean; onSelesai: () => void }) {
  const geserPintu = (kiri: boolean) => ({
    initial: { transform: "translateX(0%)" },
    animate: buka ? { transform: `translateX(${kiri ? -102 : 102}%)` } : undefined,
    transition: { duration: 1.2, ease: [0.65, 0, 0.35, 1] as const, delay: T_PINTU },
  });
  const sibak = (kiri: boolean) => ({
    initial: { opacity: 1, transform: "translateX(0%) scale(1)" },
    animate: buka ? { opacity: 0, transform: `translateX(${kiri ? -80 : 80}%) scale(1.25)` } : undefined,
    transition: { duration: 1.3, ease: [0.5, 0, 0.3, 1] as const, delay: T_RIMBUN },
  });
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-20"
      style={{ transformOrigin: "50% 50%" }}
      initial={{ opacity: 1, transform: "scale(1)" }}
      animate={buka ? { opacity: [1, 1, 0], transform: "scale(7)" } : undefined}
      transition={{ duration: 1.8, ease: [0.55, 0.05, 0.75, 0.3], delay: T_TEMBUS, opacity: { duration: 1.8, times: [0, 0.78, 1], delay: T_TEMBUS } }}
      onAnimationComplete={() => buka && onSelesai()}
      aria-hidden="true"
    >
      {/* kertas gading yang berlubang jendela gunungan */}
      <div className={`${s.kertas} absolute inset-0`} style={MASKER_KERTAS} />

      {/* isi jendela: rimbun pohon emas, lalu pintu batik di depannya */}
      <div className="absolute top-1/2 left-1/2 aspect-[300/420] w-[66%] -translate-x-1/2 -translate-y-1/2" style={MASKER_JENDELA}>
        {[true, false].map((kiri) => (
          <motion.div key={`r${kiri}`} className={`absolute inset-y-0 w-1/2 overflow-hidden bg-[#f6f3ec] ${kiri ? "left-0" : "right-0"}`} {...sibak(kiri)}>
            <div className={`absolute inset-y-[-4%] w-[200%] ${kiri ? "left-0" : "right-0"}`}>
              <Image src={ASET.pohonEmas.src} alt="" fill sizes="300px" className={`object-cover ${kiri ? "" : "-scale-x-100"}`} />
            </div>
          </motion.div>
        ))}
        {[true, false].map((kiri) => (
          <motion.div key={`p${kiri}`} className={`${s.kawung} absolute inset-y-0 w-1/2 overflow-hidden ${kiri ? "left-0" : "right-0"}`} {...geserPintu(kiri)}>
            <span className={`absolute inset-y-0 w-[3px] bg-gradient-to-b from-[#b8934f] via-[#f3e3b4] to-[#b8934f] ${kiri ? "right-0" : "left-0"}`} />
            <span className={`absolute inset-y-3 w-px bg-[#dbe5f3]/70 ${kiri ? "left-3" : "right-3"}`} />
            <Medali className={`top-[46%] w-[74%] -translate-y-1/2 ${kiri ? "left-full -translate-x-1/2" : "left-0 -translate-x-1/2"}`} />
          </motion.div>
        ))}
      </div>

      {/* tepi timbul di sekeliling jendela */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[83.6%] -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, transform: "scale(0.92)" }}
        animate={{ opacity: 1, transform: "scale(1)" }}
        transition={{ duration: 1.4, ease: HALUS, delay: 0.2 }}
      >
        <div className="relative aspect-[380/500]">
          <TepiGunungan className="inset-0 h-full w-full" />
        </div>
      </motion.div>

      {/* pohon emas di sudut atas & bunga porselen di bawah */}
      {[true, false].map((kiri) => (
        <motion.div
          key={`t${kiri}`}
          className={`absolute -top-[3%] w-[62%] [mask-image:radial-gradient(70%_70%_at_50%_40%,black_45%,transparent)] ${kiri ? "-left-[14%]" : "-right-[14%]"}`}
          style={{ transformOrigin: kiri ? "0% 0%" : "100% 0%" }}
          initial={{ opacity: 0, transform: "scale(0.8)" }}
          animate={{ opacity: 1, transform: "scale(1)" }}
          transition={{ duration: 1.8, ease: HALUS, delay: 0.3 }}
        >
          <Gambar a="pohonEmas" flip={!kiri} sizes="280px" />
        </motion.div>
      ))}
      <motion.div className="absolute inset-x-0 bottom-0 h-[30%]" initial={{ opacity: 0, transform: "translateY(25%)" }} animate={{ opacity: 1, transform: "translateY(0%)" }} transition={{ duration: 1.6, ease: HALUS, delay: 0.35 }}>
        <Bunga a="peony" className="bottom-[-3%] left-[-6%] w-[54%]" sizes="260px" asal="30% 100%" />
        <Bunga a="hortensia" className="right-[-3%] bottom-[-4%] w-[36%]" sizes="180px" varian="B" />
        <Bunga a="peonyBiru" className="bottom-[-6%] left-[38%] w-[30%]" sizes="150px" asal="50% 100%" varian="B" />
      </motion.div>
      {/* ubin kawung kecil di tepi, seperti hiasan porselen */}
      {[
        "top-[30%] left-[3%]",
        "top-[34%] left-[3%]",
        "top-[56%] right-[3%]",
        "top-[60%] right-[3%]",
      ].map((c) => (
        <span key={c} className={`${s.kawung} absolute size-[18px] rounded-[3px] ${c}`} />
      ))}
    </motion.div>
  );
}

/* ───────── Beranda ───────── */

export function Beranda({ u, buka }: { u: Undangan; buka: boolean }) {
  const [tembus, setTembus] = useState(false);
  // "kurangi gerakan": gerak transform dilewati motion, jadi jendela pembuka langsung dihilangkan saat dibuka
  const kurangi = useReducedMotion();
  return (
    <section id="beranda" className={`${s.sek} relative h-svh min-h-[42rem] overflow-hidden bg-[#e3ebf6]`}>
      {/* langit & pegunungan (paling jauh) */}
      <Lapis awal={1.2} buka={buka} keluar={s.keluarJauh}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#cfdcf1] via-[#e8eef8] to-[#eef2f8]" />
        <div className="absolute top-[14%] left-[-25%] w-[150%] opacity-60 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
          <Gambar a="gunung" sizes="(min-width: 440px) 660px, 150vw" preload />
        </div>
        <Burung className="top-[16%] left-0" delay={-4} />
        <Burung className="top-[19%] left-0" delay={-11} size={11} />
      </Lapis>

      {/* hutan & air terjun Tivoli, bayangannya di air */}
      <Lapis awal={1.55} buka={buka} keluar={s.keluarTengah}>
        <div className="absolute top-[23%] left-[-32%] w-[164%] [mask-image:linear-gradient(to_bottom,transparent,black_24%,black_88%,transparent)]">
          <Gambar a="airTerjun" sizes="(min-width: 440px) 720px, 164vw" preload />
        </div>
        <div className={`${s.kabut} absolute inset-x-[-20%] top-[52%] h-[14%] bg-[radial-gradient(50%_50%_at_50%_50%,rgb(238_242_248/0.9),transparent_70%)]`} />
      </Lapis>

      {/* danau, perahu */}
      <Lapis awal={1.7} buka={buka} keluar={s.keluarTengah}>
        <Danau className="inset-x-0 top-[61%] bottom-0" />
        <div className="absolute top-[61%] left-[-32%] h-[22%] w-[164%] overflow-hidden opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent)]">
          <div className="-scale-y-100">
            <Gambar a="airTerjun" sizes="(min-width: 440px) 720px, 164vw" preload />
          </div>
        </div>
        <Perahu className="top-[56%] left-[12%] w-[13%]" />
        <Perahu className="top-[60%] right-[16%] w-[8%]" jeda={-9} />
      </Lapis>

      {/* bunga porselen di depan */}
      <Lapis awal={2.6} buka={buka} keluar={s.keluarDekat}>
        <Bunga a="peony" className="bottom-[-2%] left-[-8%] w-[54%]" sizes="270px" asal="30% 100%" />
        <Bunga a="hortensia" className="right-[-4%] bottom-[-3%] w-[38%]" sizes="200px" varian="B" />
      </Lapis>

      {/* nama di langit, muncul setelah kamera menembus jendela */}
      <div className={`${s.keluarTeks} absolute inset-x-0 top-[8%] flex flex-col items-center px-8 text-center`}>
        {[
          <p key="a" className="text-[10px] tracking-[0.45em] text-[#27427a] uppercase">
            The Wedding of
          </p>,
          <h1 key="b" className={`${naskah} mt-1 text-[3.6rem] leading-[1.1] text-[#1f3768] [text-shadow:0_2px_14px_rgb(238_242_248/0.95)]`}>
            {u.wanita.panggilan} <span className="text-[#b8934f]">&amp;</span> {u.pria.panggilan}
          </h1>,
          <Pembatas key="c" />,
          <p key="d" className={`${gilda} mt-1 text-[13px] tracking-[0.3em] text-[#27427a] uppercase`}>
            {u.tanggal}
          </p>,
        ].map((el, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, transform: "translateY(20px)" }}
            animate={buka ? { opacity: 1, transform: "translateY(0px)" } : undefined}
            transition={{ duration: 1.3, ease: HALUS, delay: T_TEKS + i * 0.18 }}
          >
            {el}
          </motion.div>
        ))}
      </div>

      {/* foto mempelai di jendela gunungan: naik dari danau, lalu fotonya tersingkap dari bawah ke atas */}
      <div className={`${s.keluarTengah} absolute inset-x-0 top-[max(30%,14.5rem)] flex justify-center`}>
        <motion.div
          className="relative w-[50%] max-w-[13rem]"
          initial={{ opacity: 0, transform: "translateY(70px) scale(0.82)" }}
          animate={buka ? { opacity: 1, transform: "translateY(0px) scale(1)" } : undefined}
          transition={{ duration: 1.5, ease: HALUS, delay: T_FOTO }}
        >
          <FotoGunungan
            src={u.foto.sampul}
            alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`}
            sizes="220px"
            posisi="50% 30%"
            preload
            singkap={buka ? T_FOTO + 0.45 : false}
          />
        </motion.div>
      </div>

      <motion.div
        className="absolute inset-x-0 bottom-[calc(5.5rem+var(--demo-h,0px))] flex justify-center"
        initial={{ opacity: 0 }}
        animate={buka ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: T_SELESAI }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className={`${s.petunjuk} size-6 text-[#f6f3ec] drop-shadow-[0_1px_3px_rgb(0_0_0/0.5)]`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </motion.div>

      {!tembus && !(kurangi && buka) && <JendelaPembuka buka={buka} onSelesai={() => setTembus(true)} />}
    </section>
  );
}
