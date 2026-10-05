"use client";

import { AnimatePresence, type MotionValue, animate, motion, useInView, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import Image from "next/image";
import { type ReactNode, useEffect, useRef, useState } from "react";
import type { Foto } from "../../types";
import { HALUS, naskah, yuji } from "./hias";
import { Lapis } from "./interaktif";

// Galeri roda jendela bulan: foto-foto bundar berbingkai jendela bulan merah berjajar di sepanjang busur roda besar
// yang porosnya di bawah galeri. Foto di puncak roda paling besar; tetangganya turun ke kiri-kanan mengikuti busur,
// mengecil & meredup. Saat roda diputar (digeser), foto di dalam tiap jendela bergeser lebih lambat (parallax).
// Berputar sendiri saat terlihat, berhenti setelah tamu ikut menggeser. Ketuk foto di kiri/kanan untuk memutarnya ke
// puncak, ketuk foto di puncak untuk tampilan penuh.

const PEGAS = { type: "spring", stiffness: 150, damping: 24 } as const;
const SUDUT = 27; // jarak antarfoto di roda (derajat)
const JARI = 70; // jari-jari roda (cqw = persen lebar galeri)

export function Galeri({ photos }: { photos: Foto[] }) {
  const n = photos.length;
  const p = useMotionValue(0); // posisi (indeks pecahan) foto yang di tengah
  const [aktif, setAktif] = useState(0);
  const [penuh, setPenuh] = useState<number | null>(null);
  const [otomatis, setOtomatis] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const awalGeser = useRef(0);
  const terlihat = useInView(ref, { amount: 0.5 });

  useMotionValueEvent(p, "change", (v) => {
    const k = ((Math.round(v) % n) + n) % n;
    setAktif((a) => (a === k ? a : k));
  });

  const ke = (t: number) => animate(p, t, PEGAS);
  const geser = (d: number) => ke(Math.round(p.get()) + d);
  // pilih foto tertentu lewat jalan terpendek di lingkaran
  const pilih = (i: number) => {
    const v = Math.round(p.get());
    let d = (i - v) % n;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    ke(v + d);
  };

  useEffect(() => {
    if (!terlihat || !otomatis || penuh !== null) return;
    const t = setInterval(() => animate(p, Math.round(p.get()) + 1, PEGAS), 4200);
    return () => clearInterval(t);
  }, [terlihat, otomatis, penuh, p]);

  // panjang busur satu langkah dalam piksel
  const langkahPx = () => (((ref.current?.offsetWidth ?? 360) * JARI) / 100) * ((SUDUT * Math.PI) / 180);

  return (
    <div>
      <motion.div
        ref={ref}
        className="relative mx-auto aspect-[10/8] w-full cursor-grab touch-pan-y overflow-hidden select-none [container-type:inline-size] active:cursor-grabbing"
        onPanStart={() => {
          setOtomatis(false);
          p.stop();
          awalGeser.current = p.get();
        }}
        onPan={(_, info) => p.set(awalGeser.current - info.offset.x / langkahPx())}
        onPanEnd={(_, info) => {
          const v = p.get() - info.velocity.x / langkahPx() / 4;
          ke(Math.round(Math.max(awalGeser.current - 1, Math.min(awalGeser.current + 1, v))));
        }}
      >
        {/* busur roda: tali emas putus-putus & manik di puncak */}
        <svg viewBox="0 0 100 80" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          <circle cx="50" cy={9 + 26 + JARI} r={JARI} fill="none" stroke="#f6dc94" strokeWidth=".35" strokeDasharray="1 1.6" opacity=".7" />
          <circle cx="50" cy={9 + 26 + JARI} r={JARI - 30} fill="none" stroke="#f6dc94" strokeWidth=".2" opacity=".35" />
        </svg>
        {photos.map((f, i) => (
          <Jendela
            key={f.src}
            f={f}
            i={i}
            n={n}
            p={p}
            onBuka={() => {
              // foto di puncak roda dibuka layar penuh; foto di kiri/kanan diputar ke puncak
              if (i === aktif) setPenuh(i);
              else {
                setOtomatis(false);
                pilih(i);
              }
            }}
          />
        ))}
      </motion.div>

      {/* keterangan foto tengah */}
      <div className="relative mt-2 h-10 overflow-hidden text-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p
            key={aktif}
            className={`${naskah} truncate px-6 text-[2.2rem] leading-10 text-[#fff1d6]`}
            initial={{ opacity: 0, transform: "translateY(100%)" }}
            animate={{ opacity: 1, transform: "translateY(0%)" }}
            exit={{ opacity: 0, transform: "translateY(-100%)" }}
            transition={{ duration: 0.6, ease: HALUS }}
          >
            {photos[aktif].alt}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* tombol & penghitung */}
      <div className="mt-5 flex items-center justify-center gap-5">
        <TombolBulat label="Foto sebelumnya" onClick={() => (setOtomatis(false), geser(-1))}>
          <path d="m15 6-6 6 6 6" />
        </TombolBulat>
        <p className={`${yuji} min-w-20 text-center text-sm tracking-[0.25em] text-[#fff1d6] tabular-nums`}>
          {String(aktif + 1).padStart(2, "0")} <span className="text-[#f6dc94]">/</span> {String(n).padStart(2, "0")}
        </p>
        <TombolBulat label="Foto berikutnya" onClick={() => (setOtomatis(false), geser(1))}>
          <path d="m9 6 6 6-6 6" />
        </TombolBulat>
      </div>

      {/* deretan lengkung kecil */}
      <div className="mt-6 flex justify-center gap-2 px-2">
        {photos.map((f, i) => (
          <button
            key={f.src}
            type="button"
            aria-label={`Tampilkan foto ${i + 1}`}
            onClick={() => (setOtomatis(false), pilih(i))}
            className={`relative size-9 overflow-hidden rounded-full ring-2 transition-[transform,opacity] duration-500 ${aktif === i ? "-translate-y-1 opacity-100 ring-[#f6dc94]" : "opacity-50 ring-[#f6dc94]/30"}`}
          >
            <Image src={f.src} alt="" fill sizes="36px" className="object-cover" />
          </button>
        ))}
      </div>

      <p className="mt-4 text-center text-[11px] tracking-[0.2em] text-[#fff1d6]/60 uppercase">Geser atau ketuk foto samping · ketuk tengah untuk memperbesar</p>

      <TampilPenuh photos={photos} buka={penuh} setBuka={setPenuh} />
    </div>
  );
}

// Satu jendela bulan di roda. d = jaraknya (dalam langkah) dari puncak roda, dibungkus melingkar ke rentang -n/2..n/2.
function Jendela({ f, i, n, p, onBuka }: { f: Foto; i: number; n: number; p: MotionValue<number>; onBuka: () => void }) {
  const d = useTransform(p, (v) => {
    let x = (i - v) % n;
    if (x > n / 2) x -= n;
    if (x < -n / 2) x += n;
    return x;
  });
  const transform = useTransform(d, (x) => {
    const a = (x * SUDUT * Math.PI) / 180;
    const m = Math.min(Math.abs(x), 2.5);
    return `translate(${Math.round(Math.sin(a) * JARI * 100) / 100}cqw, ${Math.round((1 - Math.cos(a)) * JARI * 100) / 100}cqw) scale(${1 - m * 0.32}) rotate(${x * 8}deg)`;
  });
  const isi = useTransform(d, (x) => `translateX(${-x * 20}%) scale(1.3) rotate(${-x * 8}deg)`);
  const opacity = useTransform(d, (x) => Math.max(0, Math.min(1, 2.2 - Math.abs(x) * 1.2)));
  const redup = useTransform(d, (x) => Math.min(Math.abs(x), 1) * 0.45);
  const zIndex = useTransform(d, (x) => 50 - Math.round(Math.abs(x) * 10));
  return (
    <motion.div className="absolute top-[9cqw] left-[24cqw] aspect-square w-[52cqw] will-change-transform" style={{ transform, opacity, zIndex }} onTap={onBuka}>
      <div className="absolute inset-[8%] overflow-hidden rounded-full bg-[#5e0f13]">
        <motion.div className="absolute inset-0" style={{ transform: isi }}>
          <Image src={f.src} alt={f.alt} fill sizes="(min-width: 440px) 230px, 52vw" className="pointer-events-none object-cover" draggable={false} />
        </motion.div>
        <motion.div className="absolute inset-0 bg-[#3a0709]" style={{ opacity: redup }} />
      </div>
      <svg viewBox="-110 -110 220 220" className="pointer-events-none absolute inset-0 h-full w-full drop-shadow-[0_14px_16px_rgb(30_4_4/0.55)]" aria-hidden="true">
        <circle r="96" fill="none" stroke="#7d1418" strokeWidth="18" />
        <circle r="105" fill="none" stroke="#f6dc94" strokeWidth="2.2" />
        <circle r="87" fill="none" stroke="#f6dc94" strokeWidth="1.8" />
        {Array.from({ length: 20 }, (_, k) => (
          <path key={k} d="M-4 -99h8v5h-5v-2h2" fill="none" stroke="#f6dc94" strokeWidth="1.2" transform={`rotate(${k * 18})`} />
        ))}
      </svg>
    </motion.div>
  );
}

function TombolBulat({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-full border border-[#f6dc94]/70 text-[#f6dc94] transition-colors hover:bg-[#f6dc94]/15"
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
            className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-[#2a0708]/95 px-4 pb-[var(--demo-h,0px)]"
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
                    masuk: (d: number) => ({ opacity: 0, transform: `translateX(${d * 40}%) scale(0.92)` }),
                    diam: { opacity: 1, transform: "translateX(0%) scale(1)" },
                    keluar: (d: number) => ({ opacity: 0, transform: `translateX(${d * -40}%) scale(0.92)` }),
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
            <p className={`${naskah} mt-4 text-[2.3rem] leading-none text-[#fff1d6]`}>{photos[buka].alt}</p>
            <p className={`${yuji} mt-2 text-xs tracking-[0.3em] text-[#f6dc94]`}>
              {buka + 1} / {n}
            </p>
            <button
              type="button"
              onClick={() => setBuka(null)}
              aria-label="Tutup"
              className="absolute top-4 right-4 grid size-11 place-items-center rounded-full border border-[#f6dc94]/60 text-[#f6dc94]"
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
