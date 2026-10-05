"use client";

import { easeInOut, motion, type MotionStyle, type MotionValue, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { type PointerEvent, useRef } from "react";
import { pernyataan, profil, satelit } from "./data";
import { JUDUL, MONO, SERIF } from "./gaya";
import { useDiam } from "./diam";
import s from "./laras.module.css";

// Pembuka: panggung sticky setinggi 4 layar. Urutan saat digulir (p = progres 0..1):
//   0    → 0.36  bingkai potret di tengah mekar jadi layar penuh, nama terbelah ke kiri & kanan,
//                foto-foto kecil terbang keluar dengan kecepatan sesuai kedalamannya
//   0.36 → 0.63  foto menggelap, pernyataan muncul kata per kata
//   0.667 → 1    lembaran "Seri" naik menutupi (margin negatif di seri.tsx), panggung mengecil & meredup
// Di laptop semua lapisan juga ikut kursor sedikit. "Kurangi gerakan": komposisi awal saja, tanpa animasi.

const MEKAR = 0.36;

export function Pembuka() {
  const ref = useRef<HTMLElement>(null);
  const diam = useDiam();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // kursor (-1..1), dihaluskan dengan pegas
  const kx = useMotionValue(0);
  const ky = useMotionValue(0);
  const sx = useSpring(kx, { stiffness: 50, damping: 16 });
  const sy = useSpring(ky, { stiffness: 50, damping: 16 });
  const gerakKursor = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || diam) return;
    const r = e.currentTarget.getBoundingClientRect();
    kx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    ky.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  const t = useTransform(p, [0, MEKAR], [1, 0], { ease: easeInOut });
  const zoomFoto = useTransform(p, [0, MEKAR], [1.32, 1], { ease: easeInOut });
  const fotoX = useTransform(sx, (v) => v * -10);
  const fotoY = useTransform(sy, (v) => v * -10);
  const kiri = useTransform(p, [0, MEKAR], ["0vw", "-48vw"], { ease: easeInOut });
  const kanan = useTransform(p, [0, MEKAR], ["0vw", "48vw"], { ease: easeInOut });
  const namaX = useTransform(sx, (v) => v * 14);
  const namaY = useTransform(sy, (v) => v * 8);
  const petunjuk = useTransform(p, [0, 0.07], [1, 0]);
  const pembidik = useTransform(p, [0.02, 0.2], [1, 0]);
  const gelap = useTransform(p, [MEKAR - 0.04, 0.46, 0.667, 1], [0, 0.62, 0.62, 0.9]);
  const mundur = useTransform(p, [0.667, 1], [1, 0.9]);
  const frame = useTransform(p, (v) => String(Math.min(36, Math.floor(v * 35) + 1)).padStart(2, "0"));

  return (
    <section ref={ref} id="atas" onPointerMove={gerakKursor} className={diam ? "relative bg-[#0d0b09]" : "relative h-[400svh] bg-[#0d0b09]"}>
      <motion.div
        style={(diam ? { "--t": 1 } : { "--t": t, scale: mundur }) as unknown as MotionStyle}
        className={`${s.panggung} sticky top-0 h-svh origin-top overflow-hidden bg-[#16130f]`}
      >
        {/* latar kertas + nama besar; di belakang bingkai */}
        <div className="absolute inset-0 bg-[#ece5d8]" />
        <motion.div style={diam ? undefined : { x: namaX, y: namaY }} className="absolute inset-0 text-[#16130f]" aria-hidden="true">
          <motion.p
            style={diam ? undefined : { x: kiri }}
            className={`${JUDUL} absolute top-[15svh] left-[3vw] text-[34vw] leading-[0.78] tracking-[-0.01em] md:top-[7svh] md:text-[24vw]`}
          >
            {profil.depan}
          </motion.p>
          <motion.p
            style={diam ? undefined : { x: kanan }}
            className={`${JUDUL} absolute right-[3vw] bottom-[9svh] text-[34vw] leading-[0.78] tracking-[-0.01em] md:bottom-[5svh] md:text-[24vw]`}
          >
            {profil.belakang}
          </motion.p>
        </motion.div>

        {/* foto-foto kecil yang melayang */}
        {satelit.map((it, i) => (
          <Satelit key={it.f.src} it={it} i={i} p={p} sx={sx} sy={sy} diam={diam} />
        ))}

        {/* potret utama, terpotong bingkai (clip-path) yang lalu mekar */}
        <div className={s.bingkai}>
          <motion.div style={diam ? undefined : { scale: zoomFoto, x: fotoX, y: fotoY }} className="absolute -inset-[2%]">
            <Image src={profil.potret.src} alt={profil.potret.alt} fill priority sizes="100vw" className="object-cover object-[58%_40%]" />
          </motion.div>
          <motion.div style={{ opacity: diam ? 0 : gelap }} className="absolute inset-0 bg-[#0d0b09]" />
        </div>

        {/* pembidik kamera di tepi bingkai */}
        <motion.div style={{ opacity: diam ? 1 : pembidik }} className={`${s.jendela} pointer-events-none`} aria-hidden="true">
          {["top-0 left-0 border-t-2 border-l-2", "top-0 right-0 border-t-2 border-r-2", "bottom-0 left-0 border-b-2 border-l-2", "right-0 bottom-0 border-r-2 border-b-2"].map((c) => (
            <span key={c} className={`absolute size-5 border-[#ece5d8] ${c} -m-2.5`} />
          ))}
          <span className="absolute top-1/2 left-1/2 size-9 -translate-1/2 rounded-full border border-[#ece5d8]/80" />
          <span className={`${s.kedip} absolute top-[38%] left-[56%] size-3 border-2 border-[#c9361f]`} />
          <p className={`${MONO} absolute inset-x-0 -bottom-7 flex justify-between text-[10px] tracking-[0.08em] text-[#16130f]/70`}>
            <span>f/2.0</span>
            <span>1/250</span>
            <span>ISO 400</span>
          </p>
        </motion.div>

        {/* keterangan & petunjuk (HP: di bawah header; laptop: kiri bawah, di samping "Kinanti") */}
        <motion.p
          style={{ opacity: diam ? 1 : petunjuk }}
          className={`${MONO} pointer-events-none absolute top-[4.4rem] left-[4vw] text-[11px] leading-snug text-[#16130f]/75 uppercase md:top-auto md:bottom-[4.5rem] md:text-xs`}
        >
          {profil.peran}
          <br />— {profil.kota}
        </motion.p>
        <motion.div style={{ opacity: diam ? 1 : petunjuk }} className={`${MONO} pointer-events-none absolute inset-x-[4vw] bottom-[2.2svh] flex items-end justify-between text-[11px] text-[#16130f]/75 uppercase md:text-xs`}>
          <p>
            Rol 07 · Frame <motion.span className="text-[#c9361f]">{frame}</motion.span>/36
          </p>
          <p className="flex items-center gap-2">
            Gulir pelan-pelan
            <svg viewBox="0 0 12 18" className="h-3.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M6 1v15M1 11l5 5 5-5" />
            </svg>
          </p>
        </motion.div>

        {/* pernyataan di atas foto yang sudah penuh */}
        {!diam && <Pernyataan p={p} />}
      </motion.div>
      {diam && <PernyataanDiam />}
    </section>
  );
}

function Satelit({
  it,
  i,
  p,
  sx,
  sy,
  diam,
}: {
  it: (typeof satelit)[number];
  i: number;
  p: MotionValue<number>;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  diam: boolean;
}) {
  const akhir = MEKAR + 0.04;
  const y = useTransform(p, [0, akhir], ["0svh", `${-it.d * 70}svh`]);
  const x = useTransform(p, [0, akhir], ["0vw", `${it.arah * it.d * 14}vw`]);
  const putar = useTransform(p, [0, akhir], [(i % 2 ? 1 : -1) * 3, (i % 2 ? 1 : -1) * (3 + it.d * 9)]);
  const pudar = useTransform(p, [akhir - 0.12, akhir], [1, 0]);
  const kx = useTransform(sx, (v) => v * it.d * 26);
  const ky = useTransform(sy, (v) => v * it.d * 18);
  return (
    <motion.div style={diam ? undefined : { x: kx, y: ky }} className={`absolute ${it.pos}`}>
      <motion.div
        style={diam ? { rotate: (i % 2 ? 1 : -1) * 3 } : { x, y, rotate: putar, opacity: pudar }}
        initial={diam ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.25 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#f7f2e8] p-[5%] pb-[16%] shadow-[0_18px_40px_-18px_rgb(22_19_15/0.55)]"
      >
        <div className="relative overflow-hidden" style={{ aspectRatio: `${it.f.w} / ${it.f.h}` }}>
          <Image src={it.f.src} alt={it.f.alt} fill sizes="(min-width: 768px) 14vw, 32vw" className="object-cover" />
        </div>
      </motion.div>
    </motion.div>
  );
}

const KATA = pernyataan.split(" ");

function Pernyataan({ p }: { p: MotionValue<number> }) {
  const label = useTransform(p, [0.4, 0.45], [0, 1]);
  const ada = useTransform(p, [MEKAR, MEKAR + 0.04], [0, 1]);
  return (
    <motion.div style={{ opacity: ada }} className="pointer-events-none absolute inset-0 flex flex-col justify-center px-[6vw] text-[#ece5d8]">
      <motion.p style={{ opacity: label }} className={`${MONO} mb-6 text-[11px] tracking-[0.18em] uppercase md:text-xs`}>
        <span className="text-[#c9361f]">●</span> Tentang pekerjaan ini
      </motion.p>
      <p className={`${SERIF} max-w-[17ch] text-[10.5vw] leading-[1.02] md:max-w-[22ch] md:text-[5.4vw]`}>
        {KATA.map((k, i) => (
          <Kata key={i} p={p} i={i}>
            {k}
          </Kata>
        ))}
      </p>
    </motion.div>
  );
}

function Kata({ p, i, children }: { p: MotionValue<number>; i: number; children: string }) {
  const awal = 0.42 + (i / KATA.length) * 0.19;
  const o = useTransform(p, [awal, awal + 0.03], [0.14, 1]);
  const y = useTransform(p, [awal, awal + 0.03], ["0.25em", "0em"]);
  return (
    <motion.span style={{ opacity: o, y }} className="inline-block whitespace-pre">
      {children}{" "}
    </motion.span>
  );
}

function PernyataanDiam() {
  return (
    <div className="relative bg-[#16130f] px-[6vw] py-24 text-[#ece5d8]">
      <p className={`${MONO} mb-6 text-xs tracking-[0.18em] uppercase`}>
        <span className="text-[#c9361f]">●</span> Tentang pekerjaan ini
      </p>
      <p className={`${SERIF} max-w-[22ch] text-[9vw] leading-[1.05] md:text-[5vw]`}>{pernyataan}</p>
    </div>
  );
}
