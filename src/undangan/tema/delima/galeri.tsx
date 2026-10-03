"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import Image from "next/image";
import { type ReactNode, useEffect, useRef, useState } from "react";
import type { Foto } from "../../types";
import { HALUS, naskah, prata } from "./hias";
import { Lapis } from "./interaktif";

// Galeri tumpukan foto: foto-foto berbingkai kertas bertumpuk miring seperti kartu pos di meja. Foto paling atas
// bisa digeser (atau ditekan tombolnya) untuk dilempar ke samping lalu kembali ke dasar tumpukan; foto berikutnya
// naik ke depan. Berputar sendiri saat galeri terlihat, berhenti setelah tamu ikut menggeser. Ketuk foto paling atas
// untuk tampilan penuh (bisa digeser kiri-kanan).

const MIRING = [-5, 4, -2.5, 6, -4, 2.5, -6, 3.5, -3, 5];
const TAMPAK = 4; // jumlah foto yang terlihat di tumpukan

export function Galeri({ photos }: { photos: Foto[] }) {
  const n = photos.length;
  const [urut, setUrut] = useState(() => photos.map((_, i) => i)); // urut[0] = foto paling atas
  const [terbang, setTerbang] = useState<{ id: number; arah: 1 | -1 } | null>(null);
  const [penuh, setPenuh] = useState<number | null>(null);
  const [otomatis, setOtomatis] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const terlihat = useInView(ref, { amount: 0.5 });

  const lempar = (arah: 1 | -1) => setTerbang((t) => t ?? { id: urut[0], arah });
  const mundur = () => {
    if (terbang) return;
    setUrut((u) => [u[n - 1], ...u.slice(0, n - 1)]);
  };
  // pilih foto tertentu dari deretan kecil: putar tumpukan sampai foto itu di atas
  const pilih = (id: number) => {
    if (terbang) return;
    setUrut((u) => {
      const k = u.indexOf(id);
      return [...u.slice(k), ...u.slice(0, k)];
    });
  };

  useEffect(() => {
    if (!terlihat || !otomatis || penuh !== null) return;
    const t = setInterval(() => setTerbang((x) => x ?? { id: urut[0], arah: -1 }), 3800);
    return () => clearInterval(t);
  }, [terlihat, otomatis, penuh, urut]);

  return (
    <div ref={ref}>
      <div className="relative mx-auto aspect-[4/5.4] w-[74%]">
        {photos.map((p, i) => {
          const r = urut.indexOf(i);
          const lepas = terbang?.id === i;
          const atas = r === 0 && !terbang;
          const miring = MIRING[i % MIRING.length];
          return (
            <motion.div
              key={p.src}
              className={`absolute inset-0 ${atas ? "cursor-grab touch-pan-y active:cursor-grabbing" : "pointer-events-none"}`}
              style={{ zIndex: lepas ? n + 1 : n - r }}
              initial={false}
              animate={
                lepas
                  ? { x: `${terbang.arah * 135}%`, y: -30, rotate: terbang.arah * 24, scale: 0.96, opacity: 1 }
                  : { x: 0, y: r * 14, rotate: r === 0 ? miring * 0.35 : miring, scale: 1 - r * 0.055, opacity: r < TAMPAK ? 1 : 0 }
              }
              transition={lepas ? { duration: 0.5, ease: [0.45, 0, 0.7, 0.4] } : { type: "spring", stiffness: 210, damping: 26 }}
              onAnimationComplete={() => {
                if (!lepas) return;
                setUrut((u) => [...u.slice(1), u[0]]);
                setTerbang(null);
              }}
              drag={atas ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.9}
              onDragStart={() => setOtomatis(false)}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 70 || Math.abs(info.velocity.x) > 450) lempar(info.offset.x > 0 ? 1 : -1);
              }}
              onTap={() => atas && setPenuh(i)}
            >
              <KartuFoto p={p} sizes="(min-width: 440px) 330px, 74vw" />
            </motion.div>
          );
        })}
      </div>

      {/* tombol & penghitung */}
      <div className="mt-10 flex items-center justify-center gap-5">
        <TombolBulat label="Foto sebelumnya" onClick={() => (setOtomatis(false), mundur())}>
          <path d="m15 6-6 6 6 6" />
        </TombolBulat>
        <p className={`${prata} min-w-20 text-center text-sm tracking-[0.25em] text-[#f3dcd6] tabular-nums`}>
          {String(urut[0] + 1).padStart(2, "0")} <span className="text-[#c9a35c]">/</span> {String(n).padStart(2, "0")}
        </p>
        <TombolBulat label="Foto berikutnya" onClick={() => (setOtomatis(false), lempar(-1))}>
          <path d="m9 6 6 6-6 6" />
        </TombolBulat>
      </div>

      {/* deretan foto kecil */}
      <div className="mt-6 flex justify-center gap-2 px-2">
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            aria-label={`Tampilkan foto ${i + 1}`}
            onClick={() => (setOtomatis(false), pilih(i))}
            className={`relative aspect-square w-10 overflow-hidden rounded-md ring-1 transition-[transform,opacity] duration-500 ${urut[0] === i ? "-translate-y-1 opacity-100 ring-2 ring-[#c9a35c]" : "opacity-50 ring-[#f3dcd6]/30"}`}
          >
            <Image src={p.src} alt="" fill sizes="40px" className="object-cover" />
          </button>
        ))}
      </div>

      <p className="mt-4 text-center text-[11px] tracking-[0.2em] text-[#f3dcd6]/60 uppercase">Geser foto atau ketuk untuk memperbesar</p>

      <TampilPenuh photos={photos} buka={penuh} setBuka={setPenuh} />
    </div>
  );
}

// Foto berbingkai kertas krem dengan garis emas & keterangan bertulisan tangan
function KartuFoto({ p, sizes }: { p: Foto; sizes: string }) {
  return (
    <div className="flex h-full w-full flex-col rounded-[4px] bg-[#fbf4f1] p-[4.5%] pb-0 shadow-[0_26px_40px_-22px_rgb(0_0_0/0.75)]">
      <div className="relative flex-1 overflow-hidden rounded-[2px]">
        <Image src={p.src} alt={p.alt} fill sizes={sizes} className="pointer-events-none object-cover select-none" draggable={false} />
        <span className="pointer-events-none absolute inset-[6px] border border-[#fbf4f1]/70" aria-hidden="true" />
      </div>
      <p className={`${naskah} truncate py-2 text-center text-[1.6rem] leading-none text-[#7b2431]`}>{p.alt}</p>
    </div>
  );
}

function TombolBulat({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-full border border-[#c9a35c]/70 text-[#e6cd96] transition-colors hover:bg-[#c9a35c]/15"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
      </svg>
    </motion.button>
  );
}

/* ───────── Tampilan penuh ───────── */

function TampilPenuh({ photos, buka, setBuka }: { photos: Foto[]; buka: number | null; setBuka: (i: number | null) => void }) {
  const n = photos.length;
  const [arah, setArah] = useState(1);
  const geser = (d: number) => {
    if (buka === null) return;
    setArah(d);
    setBuka((buka + d + n) % n);
  };

  useEffect(() => {
    if (buka === null) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBuka(null);
      if (e.key === "ArrowRight") geser(1);
      if (e.key === "ArrowLeft") geser(-1);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });

  return (
    <Lapis>
      <AnimatePresence>
        {buka !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Foto galeri"
            className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-[#1e0509]/95 px-4 pb-[var(--demo-h,0px)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setBuka(null)}
          >
            <div className="relative h-[72svh] w-full max-w-[420px]" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence initial={false} custom={arah}>
                <motion.div
                  key={buka}
                  custom={arah}
                  className="absolute inset-0"
                  variants={{
                    masuk: (d: number) => ({ opacity: 0, transform: `translateX(${d * 40}%) rotate(${d * 6}deg)` }),
                    diam: { opacity: 1, transform: "translateX(0%) rotate(0deg)" },
                    keluar: (d: number) => ({ opacity: 0, transform: `translateX(${d * -40}%) rotate(${d * -6}deg)` }),
                  }}
                  initial="masuk"
                  animate="diam"
                  exit="keluar"
                  transition={{ duration: 0.55, ease: HALUS }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60) geser(1);
                    else if (info.offset.x > 60) geser(-1);
                  }}
                >
                  <Image src={photos[buka].src} alt={photos[buka].alt} fill sizes="(min-width: 440px) 420px, 100vw" className="pointer-events-none object-contain select-none" draggable={false} />
                </motion.div>
              </AnimatePresence>
            </div>
            <p className={`${naskah} mt-4 text-[2rem] leading-none text-[#f3dcd6]`}>{photos[buka].alt}</p>
            <p className={`${prata} mt-2 text-xs tracking-[0.3em] text-[#c9a35c]`}>
              {buka + 1} / {n}
            </p>
            <button
              type="button"
              onClick={() => setBuka(null)}
              aria-label="Tutup"
              className="absolute top-4 right-4 grid size-11 place-items-center rounded-full border border-[#c9a35c]/60 text-[#e6cd96]"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Lapis>
  );
}
