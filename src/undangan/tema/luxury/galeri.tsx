"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Foto } from "../../types";
import { bodoni } from "./hias";
import { Lapis } from "./interaktif";
import s from "./luxury.module.css";

// Galeri carousel bergaya coverflow: foto aktif di tengah berbingkai emas & membesar pelan, foto di kiri-kanan
// miring ke belakang dan meredup. Bisa digeser jari, berputar sendiri saat terlihat (berhenti sebentar setelah
// tamu menggeser), dan diketuk untuk tampilan penuh. Pergantian posisinya memakai `transform` utuh supaya
// dijalankan mesin animasi browser, bukan dihitung JavaScript tiap frame.

const ease = [0.22, 1, 0.36, 1] as const;
const DURASI = 5000;
const dua = (n: number) => String(n).padStart(2, "0");

export function Galeri({ photos }: { photos: Foto[] }) {
  const n = photos.length;
  const [aktif, setAktif] = useState(0);
  const [lihat, setLihat] = useState<number | null>(null);
  const [tahan, setTahan] = useState(false);
  const panggung = useRef<HTMLDivElement>(null);
  const baruGeser = useRef(false);
  const terlihat = useInView(panggung, { amount: 0.5 });
  const putar = terlihat && !tahan && lihat === null;

  // putar otomatis hanya saat galeri terlihat
  useEffect(() => {
    if (!putar) return;
    const t = setTimeout(() => setAktif((a) => (a + 1) % n), DURASI);
    return () => clearTimeout(t);
  }, [putar, aktif, n]);
  // setelah tamu menggeser sendiri, tunggu sebentar sebelum berputar lagi
  useEffect(() => {
    if (!tahan) return;
    const t = setTimeout(() => setTahan(false), 8000);
    return () => clearTimeout(t);
  }, [tahan, aktif]);

  // tampilan penuh: Esc untuk tutup, panah untuk pindah foto
  useEffect(() => {
    if (lihat === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLihat(null);
      if (e.key === "ArrowRight") setLihat((o) => (o === null ? o : (o + 1) % n));
      if (e.key === "ArrowLeft") setLihat((o) => (o === null ? o : (o - 1 + n) % n));
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [lihat, n]);

  const ke = (k: number) => {
    setAktif(((k % n) + n) % n);
    setTahan(true);
  };
  // posisi relatif terhadap foto aktif, dibungkus melingkar (-3..3 untuk 7 foto)
  const rel = (k: number) => {
    let o = k - aktif;
    if (o > n / 2) o -= n;
    if (o < -n / 2) o += n;
    return o;
  };

  return (
    <>
      <motion.div
        ref={panggung}
        className="relative mx-auto h-[min(60svh,29rem)] w-full [perspective:1100px]"
        style={{ touchAction: "pan-y" }}
        onPanStart={() => (baruGeser.current = true)}
        onPanEnd={(_, info) => {
          if (info.offset.x < -40 || info.velocity.x < -400) ke(aktif + 1);
          else if (info.offset.x > 40 || info.velocity.x > 400) ke(aktif - 1);
          setTimeout(() => (baruGeser.current = false), 50);
        }}
      >
        {photos.map((p, k) => {
          const off = rel(k);
          const a = Math.abs(off);
          const tampak = a <= 2;
          return (
            <motion.button
              key={p.src}
              type="button"
              tabIndex={tampak ? 0 : -1}
              aria-label={off === 0 ? `Perbesar foto: ${p.alt}` : `Lihat foto: ${p.alt}`}
              onClick={() => {
                if (baruGeser.current) return;
                if (off === 0) setLihat(k);
                else ke(k);
              }}
              initial={false}
              animate={{
                transform: `translateX(${off * 58}%) translateZ(${-a * 170}px) rotateY(${off * -36}deg)`,
                opacity: tampak ? 1 - a * 0.28 : 0,
              }}
              transition={{ duration: 0.9, ease }}
              style={{ zIndex: 10 - a, pointerEvents: tampak ? "auto" : "none" }}
              className="absolute inset-y-0 left-[19%] w-[62%]"
            >
              <div className={`h-full w-full rounded-t-full rounded-b-2xl p-[3px] shadow-[0_30px_50px_-24px_rgb(0_0_0/0.9)] ${off === 0 ? s.emas : "bg-[#f6f1e9]/25"}`}>
                <div className="relative h-full w-full overflow-hidden rounded-t-full rounded-b-[13px] bg-[#1a1512]">
                  <div className={`absolute inset-0 ${off === 0 ? s.kenBurns : ""}`}>
                    <Image src={p.src} alt={p.alt} fill sizes="300px" className="object-cover" draggable={false} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120e0b]/55 via-transparent to-transparent" />
                  <motion.div initial={false} animate={{ opacity: off === 0 ? 0 : 0.5 }} transition={{ duration: 0.9 }} className="absolute inset-0 bg-[#120e0b]" />
                </div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* keterangan, penghitung, tombol, garis waktu putar */}
      <div className="mt-6 px-6 text-center text-[#f6f1e9]">
        <div className="relative h-7 overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={aktif}
              initial={{ opacity: 0, transform: "translateY(100%)" }}
              animate={{ opacity: 1, transform: "translateY(0%)" }}
              exit={{ opacity: 0, transform: "translateY(-100%)" }}
              transition={{ duration: 0.6, ease }}
              className={`${bodoni} text-lg italic`}
            >
              {photos[aktif].alt}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <button type="button" onClick={() => ke(aktif - 1)} className="grid size-11 place-items-center rounded-full border border-[#e9d5a1]/60 text-[#e9d5a1]" aria-label="Foto sebelumnya">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M15 5 8 12l7 7" />
            </svg>
          </button>
          <div className="flex-1">
            <p className={`${bodoni} text-sm tracking-[0.3em]`}>
              <span className={`${s.teksEmas} text-2xl tracking-normal`}>{dua(aktif + 1)}</span> / {dua(n)}
            </p>
            <div className="mt-2 h-px w-full bg-[#f6f1e9]/20" aria-hidden="true">
              <motion.span
                key={`${aktif}-${putar}`}
                className={`${s.emas} block h-px origin-left`}
                initial={{ transform: "scaleX(0)" }}
                animate={{ transform: putar ? "scaleX(1)" : "scaleX(0)" }}
                transition={{ duration: putar ? DURASI / 1000 : 0.3, ease: "linear" }}
              />
            </div>
          </div>
          <button type="button" onClick={() => ke(aktif + 1)} className="grid size-11 place-items-center rounded-full border border-[#e9d5a1]/60 text-[#e9d5a1]" aria-label="Foto berikutnya">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="m9 5 7 7-7 7" />
            </svg>
          </button>
        </div>
        {/* strip thumbnail */}
        <div className="mt-5 flex justify-center gap-2">
          {photos.map((p, k) => (
            <button
              key={p.src}
              type="button"
              onClick={() => ke(k)}
              aria-label={`Foto ${k + 1}`}
              aria-current={k === aktif}
              className={`relative h-12 w-9 overflow-hidden rounded-t-full rounded-b-md transition-opacity duration-500 ${k === aktif ? "opacity-100" : "opacity-45"}`}
            >
              <Image src={p.src} alt="" fill sizes="40px" className="object-cover" />
              {k === aktif && <motion.span layoutId="lx-thumb" className="absolute inset-0 rounded-t-full rounded-b-md ring-[1.5px] ring-[#e9d5a1] ring-inset" transition={{ duration: 0.5, ease }} />}
            </button>
          ))}
        </div>
      </div>

      <Lapis>
        <AnimatePresence>
          {lihat !== null && (
            <motion.div
              className="fixed inset-0 z-[80] flex items-center justify-center bg-[#120e0b]/95 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLihat(null)}
              role="dialog"
              aria-modal="true"
              aria-label={photos[lihat].alt}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={lihat}
                  initial={{ opacity: 0, transform: "scale(0.92)" }}
                  animate={{ opacity: 1, transform: "scale(1)" }}
                  exit={{ opacity: 0, transform: "scale(1.04)" }}
                  transition={{ duration: 0.5, ease }}
                  className="relative max-h-[78svh] w-full max-w-[420px] overflow-hidden rounded-2xl"
                  style={{ aspectRatio: `${photos[lihat].w} / ${photos[lihat].h}` }}
                  drag="x"
                  dragSnapToOrigin
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -70) setLihat((lihat + 1) % n);
                    else if (info.offset.x > 70) setLihat((lihat - 1 + n) % n);
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image src={photos[lihat].src} alt={photos[lihat].alt} fill sizes="440px" className="pointer-events-none object-cover" draggable={false} />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-x-0 bottom-[calc(1.5rem+var(--demo-h,0px))] flex items-center justify-center gap-6 text-sm text-[#f6f1e9]" onClick={(e) => e.stopPropagation()}>
                <button type="button" onClick={() => setLihat((lihat - 1 + n) % n)} className="grid size-10 place-items-center rounded-full border border-[#e9d5a1]/50 text-[#e9d5a1]" aria-label="Foto sebelumnya">
                  ‹
                </button>
                <span className={`${bodoni} tabular-nums`}>
                  {dua(lihat + 1)} / {dua(n)}
                </span>
                <button type="button" onClick={() => setLihat((lihat + 1) % n)} className="grid size-10 place-items-center rounded-full border border-[#e9d5a1]/50 text-[#e9d5a1]" aria-label="Foto berikutnya">
                  ›
                </button>
              </div>
              <button type="button" onClick={() => setLihat(null)} className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-[#f6f1e9]/15 text-xl text-[#f6f1e9]" aria-label="Tutup">
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </Lapis>
    </>
  );
}
