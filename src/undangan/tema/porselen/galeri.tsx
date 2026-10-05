"use client";

import { AnimatePresence, motion, useInView, useMotionValue, useMotionValueEvent, useSpring } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Foto } from "../../types";
import { HALUS, gilda } from "./hias";
import { Lapis } from "./interaktif";
import s from "./porselen.module.css";

// Galeri carousel cincin 3D: foto-foto berbingkai lengkung kawung tersusun melingkar di ruang 3D.
// Geser dengan jari untuk memutar cincin (berhenti tepat di satu foto), atau biarkan berputar sendiri pelan.
// Foto yang di depan bisa diketuk untuk dilihat layar penuh.

const LEBAR = 172; // lebar satu panel (px)
const JEDA_PUTAR = 3600;

export function Galeri({ photos }: { photos: Foto[] }) {
  const N = photos.length;
  const step = 360 / N;
  const jari = Math.round(LEBAR / 2 / Math.tan(Math.PI / N) + 26);
  const sudut = useMotionValue(0);
  const putar = useSpring(sudut, { stiffness: 90, damping: 20, mass: 0.9 });
  const [aktif, setAktif] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [pegang, setPegang] = useState(false);
  const wadah = useRef<HTMLDivElement>(null);
  // waktu gerakan geser terakhir: ketukan sesaat setelah menggeser tidak membuka foto
  // (onPanEnd baru berjalan setelah event klik, jadi waktunya dicatat selama menggeser)
  const baruGeser = useRef(0);
  const terlihat = useInView(wadah, { amount: 0.4 });

  useMotionValueEvent(putar, "change", (v) => {
    const i = (((Math.round(-v / step) % N) + N) % N) as number;
    setAktif((a) => (a === i ? a : i));
  });

  const geserKe = (langkah: number) => {
    const pos = Math.round(-sudut.get() / step) + langkah;
    sudut.set(-pos * step);
  };

  // berputar sendiri selama terlihat, tidak sedang dipegang, dan layar penuh tertutup
  useEffect(() => {
    if (!terlihat || pegang || open !== null || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => sudut.set(-(Math.round(-sudut.get() / step) + 1) * step), JEDA_PUTAR);
    return () => clearInterval(id);
  }, [terlihat, pegang, open, sudut, step]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % N));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + N) % N));
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open, N]);

  return (
    <div ref={wadah}>
      <motion.div
        className="relative mx-auto h-[350px] touch-pan-y select-none [perspective:950px]"
        initial={{ opacity: 0, transform: "scale(0.7) rotate(-6deg)" }}
        whileInView={{ opacity: 1, transform: "scale(1) rotate(0deg)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.6, ease: HALUS }}
        onPanStart={() => {
          baruGeser.current = performance.now();
          setPegang(true);
        }}
        onPan={(_, info) => {
          baruGeser.current = performance.now();
          sudut.set(sudut.get() + info.delta.x * 0.42);
        }}
        onPanEnd={(_, info) => {
          const tujuan = Math.round((sudut.get() + info.velocity.x * 0.08) / step) * step;
          sudut.set(tujuan);
          setTimeout(() => setPegang(false), 2500);
        }}
      >
        {/* bayangan lantai */}
        <div className="absolute bottom-1 left-1/2 h-10 w-[78%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(35_60_112/0.35),transparent)]" aria-hidden="true" />
        <motion.div className="absolute top-[42px] left-1/2 h-[250px] [transform-style:preserve-3d]" style={{ width: LEBAR, marginLeft: -LEBAR / 2, rotateY: putar }}>
          {photos.map((p, i) => {
            const depan = i === aktif;
            return (
              <button
                key={p.src}
                type="button"
                onClick={() => {
                  if (performance.now() - baruGeser.current < 250) return;
                  if (depan) setOpen(i);
                  else geserKe((((i - aktif + N + N / 2) % N) - N / 2) | 0);
                }}
                aria-label={depan ? `Lihat foto: ${p.alt}` : `Putar ke foto: ${p.alt}`}
                className={`${s.kawung} absolute inset-0 block rounded-t-full rounded-b-xl p-[6px] shadow-[0_16px_26px_-16px_rgb(20_35_70/0.9)] [backface-visibility:hidden]`}
                style={{ transform: `rotateY(${i * step}deg) translateZ(${jari}px)` }}
              >
                <span className="relative block h-full w-full overflow-hidden rounded-t-full rounded-b-lg bg-[#fbfaf6] p-[2px]">
                  <span className="relative block h-full w-full overflow-hidden rounded-t-full rounded-b-md">
                    <Image src={p.src} alt={p.alt} fill sizes="200px" className="object-cover" draggable={false} />
                  </span>
                </span>
                <span className={`pointer-events-none absolute inset-0 rounded-t-full rounded-b-xl bg-[#14254a] transition-opacity duration-500 ${depan ? "opacity-0" : "opacity-45"}`} />
              </button>
            );
          })}
        </motion.div>
      </motion.div>

      <div className="mt-4 flex items-center justify-center gap-5">
        <TombolPanah arah="kiri" onClick={() => geserKe(-1)} />
        <div className="min-w-0 text-center">
          <p className={`${gilda} text-[13px] tracking-[0.2em] text-[#f6f3ec] uppercase`}>
            {String(aktif + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
          </p>
          <div className="mt-2 flex justify-center gap-1.5">
            {photos.map((p, i) => (
              <span key={p.src} className={`h-1 rounded-full transition-all duration-500 ${i === aktif ? "w-5 bg-[#d8b56e]" : "w-1.5 bg-[#dbe5f3]/40"}`} />
            ))}
          </div>
        </div>
        <TombolPanah arah="kanan" onClick={() => geserKe(1)} />
      </div>
      <p className="mt-3 text-center text-[11px] text-[#dbe5f3]/70">Geser untuk memutar · ketuk foto untuk memperbesar</p>

      {/* semua foto dalam kisi kotak: tiap ubin bisa diketuk untuk layar penuh. Bila jumlah foto tidak pas kelipatan
          tiga, ubin pertama (dan terakhir) dibuat selebar dua kolom supaya baris terakhir tidak bolong. */}
      <motion.ul
        className="mt-9 grid grid-cols-3 gap-2 px-2"
        initial="sembunyi"
        whileInView="tampil"
        viewport={{ once: true, amount: 0.15 }}
        transition={{ staggerChildren: 0.07 }}
      >
        {photos.map((p, i) => {
          const lebar = (N % 3 === 2 && i === 0) || (N % 3 === 1 && (i === 0 || i === N - 1));
          return (
            <motion.li
              key={p.src}
              className={lebar ? "col-span-2" : ""}
              variants={{ sembunyi: { opacity: 0, transform: "translateY(24px) scale(0.92)" }, tampil: { opacity: 1, transform: "translateY(0px) scale(1)", transition: { duration: 0.8, ease: HALUS } } }}
            >
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`Lihat foto: ${p.alt}`}
                className={`group relative block w-full overflow-hidden rounded-lg bg-[#1a2f5c] p-[3px] ring-1 transition-shadow duration-500 ${i === aktif ? "ring-[#d8b56e]" : "ring-[#dbe5f3]/25"} ${lebar ? "aspect-[2/1]" : "aspect-square"}`}
              >
                <span className="relative block h-full w-full overflow-hidden rounded-[5px]">
                  <Image src={p.src} alt="" fill sizes={lebar ? "280px" : "140px"} className="object-cover transition-transform duration-700 group-active:scale-105" draggable={false} />
                </span>
                <span className="pointer-events-none absolute inset-[3px] rounded-[5px] ring-1 ring-[#fbfaf6]/30 ring-inset" aria-hidden="true" />
              </button>
            </motion.li>
          );
        })}
      </motion.ul>

      <Lapis>
        <AnimatePresence>
          {open !== null && (
            <motion.div
              className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0f1c38]/95 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(null)}
              role="dialog"
              aria-modal="true"
              aria-label={photos[open].alt}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={open}
                  initial={{ opacity: 0, transform: "scale(0.92)" }}
                  animate={{ opacity: 1, transform: "scale(1)" }}
                  exit={{ opacity: 0, transform: "scale(1.04)" }}
                  transition={{ duration: 0.45, ease: HALUS }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (Math.abs(info.offset.x) < 60) return;
                    setOpen((o) => (o === null ? o : (o + (info.offset.x < 0 ? 1 : -1) + N) % N));
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className={`${s.kawung} relative w-full max-w-[420px] rounded-t-[999px] rounded-b-2xl p-2`}
                  style={{ aspectRatio: `${photos[open].w} / ${photos[open].h}`, maxHeight: "78svh" }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-t-[999px] rounded-b-xl">
                    <Image src={photos[open].src} alt={photos[open].alt} fill sizes="440px" className="pointer-events-none object-cover" />
                  </div>
                </motion.div>
              </AnimatePresence>
              <p className="absolute bottom-[calc(1.5rem+var(--demo-h,0px))] text-xs tracking-[0.3em] text-[#f6f3ec]/70">
                {open + 1} / {N}
              </p>
              <button type="button" onClick={() => setOpen(null)} className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-white/10 text-white" aria-label="Tutup">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </Lapis>
    </div>
  );
}

function TombolPanah({ arah, onClick }: { arah: "kiri" | "kanan"; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      aria-label={arah === "kiri" ? "Foto sebelumnya" : "Foto berikutnya"}
      className="grid size-10 shrink-0 place-items-center rounded-full border border-[#d8b56e]/60 text-[#f6f3ec]"
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={arah === "kiri" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"} />
      </svg>
    </motion.button>
  );
}
