"use client";

import { AnimatePresence, type MotionValue, animate, motion, useInView, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import Image from "next/image";
import { type ReactNode, useEffect, useRef, useState } from "react";
import type { Foto } from "../../types";
import { maskerLengkung } from "./aset";
import { HALUS, TepiLengkung, marcellus, naskah } from "./hias";
import { Lapis } from "./interaktif";

// Galeri jendela mihrab: foto-foto dalam lengkung bertepi emas berjajar melingkar (tanpa ujung). Foto di tengah paling
// besar; tetangganya mengecil, meredup & bersembunyi di belakangnya. Saat digeser, foto di dalam tiap jendela bergerak
// lebih lambat daripada jendelanya (parallax), seperti melihat ke luar lewat jendela yang lewat. Berputar sendiri saat
// terlihat, berhenti setelah tamu ikut menggeser. Ketuk foto tengah untuk tampilan penuh.

const PEGAS = { type: "spring", stiffness: 150, damping: 24 } as const;
const LANGKAH = 0.5; // jarak antarjendela, dalam lebar jendela

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

  // lebar satu langkah geser dalam piksel (jendela = 56% lebar wadah)
  const langkahPx = () => (ref.current?.offsetWidth ?? 360) * 0.56 * LANGKAH;

  return (
    <div>
      <motion.div
        ref={ref}
        className="relative mx-auto aspect-[10/9.6] w-full cursor-grab touch-pan-y select-none active:cursor-grabbing"
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
        {photos.map((f, i) => (
          <Jendela key={f.src} f={f} i={i} n={n} p={p} onBuka={() => i === aktif && setPenuh(i)} />
        ))}
      </motion.div>

      {/* keterangan foto tengah */}
      <div className="relative mt-2 h-10 overflow-hidden text-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p
            key={aktif}
            className={`${naskah} truncate px-6 text-[2.1rem] leading-10 text-[#f6ebc8]`}
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
        <p className={`${marcellus} min-w-20 text-center text-sm tracking-[0.25em] text-[#e9dcc0] tabular-nums`}>
          {String(aktif + 1).padStart(2, "0")} <span className="text-[#b8955a]">/</span> {String(n).padStart(2, "0")}
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
            className={`relative aspect-[300/420] w-8 transition-[transform,opacity] duration-500 ${aktif === i ? "-translate-y-1 opacity-100" : "opacity-45"}`}
          >
            <span className="absolute inset-0 overflow-hidden bg-[#0a2b24]" style={maskerLengkung}>
              <Image src={f.src} alt="" fill sizes="32px" className="object-cover" />
            </span>
            {aktif === i && <TepiLengkung className="top-[-5.71%] left-[-8%] h-[111.43%] w-[116%]" tipis sabit={false} />}
          </button>
        ))}
      </div>

      <p className="mt-4 text-center text-[11px] tracking-[0.2em] text-[#e9dcc0]/60 uppercase">Geser jendela atau ketuk untuk memperbesar</p>

      <TampilPenuh photos={photos} buka={penuh} setBuka={setPenuh} />
    </div>
  );
}

// Satu jendela lengkung. d = jaraknya (dalam langkah) dari tengah, dibungkus melingkar ke rentang -n/2..n/2.
function Jendela({ f, i, n, p, onBuka }: { f: Foto; i: number; n: number; p: MotionValue<number>; onBuka: () => void }) {
  const d = useTransform(p, (v) => {
    let x = (i - v) % n;
    if (x > n / 2) x -= n;
    if (x < -n / 2) x += n;
    return x;
  });
  const transform = useTransform(d, (x) => {
    const a = Math.min(Math.abs(x), 2);
    return `translateX(${x * LANGKAH * 100}%) translateY(${a * 5}%) scale(${1 - a * 0.24})`;
  });
  const isi = useTransform(d, (x) => `translateX(${-x * 22}%) scale(1.3)`);
  const opacity = useTransform(d, (x) => Math.max(0, Math.min(1, 2.2 - Math.abs(x) * 1.2)));
  const redup = useTransform(d, (x) => Math.min(Math.abs(x), 1) * 0.5);
  const zIndex = useTransform(d, (x) => 50 - Math.round(Math.abs(x) * 10));
  return (
    <motion.div className="absolute top-[7%] left-[22%] aspect-[300/420] w-[56%] will-change-transform" style={{ transform, opacity, zIndex }} onTap={onBuka}>
      <div className="absolute inset-0 overflow-hidden bg-[#0a2b24] shadow-[0_30px_40px_-20px_rgb(0_0_0/0.7)]" style={maskerLengkung}>
        <motion.div className="absolute inset-0" style={{ transform: isi }}>
          <Image src={f.src} alt={f.alt} fill sizes="(min-width: 440px) 300px, 70vw" className="pointer-events-none object-cover" draggable={false} />
        </motion.div>
        <motion.div className="absolute inset-0 bg-[#0a2b24]" style={{ opacity: redup }} />
      </div>
      <TepiLengkung className="top-[-5.71%] left-[-8%] h-[111.43%] w-[116%]" tipis />
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
      className="grid size-11 place-items-center rounded-full border border-[#b8955a]/70 text-[#e9d29c] transition-colors hover:bg-[#b8955a]/15"
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
            className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-[#071e19]/95 px-4 pb-[var(--demo-h,0px)]"
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
            <p className={`${naskah} mt-4 text-[2.2rem] leading-none text-[#f6ebc8]`}>{photos[buka].alt}</p>
            <p className={`${marcellus} mt-2 text-xs tracking-[0.3em] text-[#b8955a]`}>
              {buka + 1} / {n}
            </p>
            <button
              type="button"
              onClick={() => setBuka(null)}
              aria-label="Tutup"
              className="absolute top-4 right-4 grid size-11 place-items-center rounded-full border border-[#b8955a]/60 text-[#e9d29c]"
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
