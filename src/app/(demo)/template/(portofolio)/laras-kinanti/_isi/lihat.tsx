"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { seri } from "./data";
import { JUDUL, MONO } from "./gaya";

// Galeri layar penuh untuk satu seri: geser (swipe), tombol panah, atau keyboard ← → Esc.
// Dirender di dalam template (bukan portal ke body) supaya tetap memakai variabel font dari page.tsx.
export function Lihat({ buka, onTutup }: { buka: number | null; onTutup: () => void }) {
  return <AnimatePresence>{buka !== null && <Isi key={buka} x={seri[buka]} onTutup={onTutup} />}</AnimatePresence>;
}

function Isi({ x, onTutup }: { x: (typeof seri)[number]; onTutup: () => void }) {
  const [[i, arah], setI] = useState<[number, number]>([0, 0]);
  const n = x.foto.length;
  const ke = (d: number) => setI(([k]) => [(k + d + n) % n, d]);
  const tutup = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    tutup.current?.focus();
    const tombol = (e: KeyboardEvent) => {
      if (e.key === "Escape") onTutup();
      if (e.key === "ArrowRight") setI(([k]) => [(k + 1) % n, 1]);
      if (e.key === "ArrowLeft") setI(([k]) => [(k - 1 + n) % n, -1]);
    };
    addEventListener("keydown", tombol);
    return () => removeEventListener("keydown", tombol);
  }, [n, onTutup]);

  const f = x.foto[i];
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Seri ${x.judul}`}
      initial={{ clipPath: "inset(50% 0 50% 0)" }}
      animate={{ clipPath: "inset(0% 0 0% 0)" }}
      exit={{ clipPath: "inset(50% 0 50% 0)" }}
      transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[80] flex flex-col bg-[#0e0c0a] text-[#ece5d8]"
    >
      <div className={`${MONO} flex items-center justify-between gap-4 px-[4vw] py-4 text-[11px] tracking-[0.12em] uppercase md:text-xs`}>
        <p className="min-w-0 truncate">
          <span style={{ color: x.warna.aksen }}>Seri {x.no}</span> · {x.judul}
        </p>
        <button ref={tutup} type="button" onClick={onTutup} className="flex items-center gap-2 border border-[#ece5d8]/40 px-3 py-2 uppercase hover:bg-[#ece5d8] hover:text-[#0e0c0a]">
          Tutup
          <svg viewBox="0 0 12 12" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="m1 1 10 10M11 1 1 11" />
          </svg>
        </button>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={arah}>
          <motion.div
            key={f.src}
            custom={arah}
            variants={{
              masuk: (d: number) => ({ x: `${d * 60}%`, opacity: 0 }),
              tampil: { x: "0%", opacity: 1 },
              keluar: (d: number) => ({ x: `${d * -60}%`, opacity: 0 }),
            }}
            initial="masuk"
            animate="tampil"
            exit="keluar"
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60 || info.velocity.x < -400) ke(1);
              else if (info.offset.x > 60 || info.velocity.x > 400) ke(-1);
            }}
            className="absolute inset-x-[4vw] inset-y-2 cursor-grab touch-pan-y active:cursor-grabbing"
          >
            <Image src={f.src} alt={f.alt} fill sizes="92vw" quality={85} className="pointer-events-none object-contain" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-end justify-between gap-4 px-[4vw] pt-3 pb-6">
        <div className="min-w-0">
          <p className={`${JUDUL} text-4xl leading-none md:text-5xl`}>
            {String(i + 1).padStart(2, "0")}
            <span className="text-[#ece5d8]/35">/{String(n).padStart(2, "0")}</span>
          </p>
          <p className={`${MONO} mt-2 truncate text-[11px] tracking-[0.08em] text-[#ece5d8]/70 uppercase md:text-xs`}>{f.alt}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          {[
            [-1, "Foto sebelumnya", "M9 2 3 7l6 5"],
            [1, "Foto berikutnya", "M5 2l6 5-6 5"],
          ].map(([d, label, path]) => (
            <button
              key={label}
              type="button"
              onClick={() => ke(d as number)}
              aria-label={label as string}
              className="grid size-12 place-items-center border border-[#ece5d8]/40 hover:bg-[#ece5d8] hover:text-[#0e0c0a]"
            >
              <svg viewBox="0 0 14 14" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d={path as string} />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
