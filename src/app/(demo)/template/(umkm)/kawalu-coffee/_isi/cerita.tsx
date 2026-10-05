"use client";

import { AnimatePresence, motion, type MotionValue, useMotionTemplate, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { langkah } from "./data";
import { useDiam } from "./diam";
import { JUDUL, MONO, TANGAN } from "./gaya";

// "Dari ceri ke cangkir": empat langkah di kiri digulir biasa, bingkai foto di kanan (di HP: di atas) sticky.
// Tiap langkah yang lewat membuka fotonya dari bawah (clip-path) di atas foto sebelumnya, sementara angka
// besar di pojok bingkai berganti (ketinggian, lama jemur, suhu sangrai, suhu seduh).
// Judulnya ada di bukit krem pembuka (pembuka.tsx); di mode "kurangi gerakan" judul dipasang di sini.

const N = langkah.length;

export function Cerita() {
  const diam = useDiam();
  const daftar = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: daftar, offset: ["start 55%", "end 55%"] });
  const [aktif, setAktif] = useState(0);
  useMotionValueEvent(p, "change", (v) => setAktif(Math.min(N - 1, Math.max(0, Math.floor(v * N + 0.08)))));

  return (
    <section id="cerita" className="relative bg-[#f3ead8] pb-16 text-[#22140e] md:pb-28">
      {diam && (
        <div className="mx-auto max-w-6xl px-5 pt-6 md:px-8 md:pt-16">
          <p className={`${MONO} text-[11px] tracking-[0.16em] uppercase md:text-xs`}>
            <span className="text-[#c3312b]">●</span> Dari ceri ke cangkir
          </p>
          <h2 className={`${JUDUL} mt-3 text-[15vw] leading-[0.82] md:text-[7.5vw]`}>
            Empat langkah
            <br />
            sebelum kamu minum
          </h2>
        </div>
      )}
      <div className="mx-auto grid max-w-6xl px-5 md:grid-cols-2 md:gap-16 md:px-8">
        <div className="sticky top-[3.9rem] z-10 h-[46svh] self-start bg-[#f3ead8] py-2 md:col-start-2 md:row-start-1 md:top-[12svh] md:h-[76svh] md:py-0">
          <Bingkai p={p} aktif={aktif} diam={diam} />
        </div>
        <div ref={daftar} className="md:col-start-1 md:row-start-1">
          {langkah.map((l, i) => (
            <article key={l.judul} className="flex min-h-[64svh] flex-col pt-6 md:min-h-[86svh] md:justify-center md:pt-0">
              <p className={`${JUDUL} text-[4.5rem] leading-none text-[#c3312b] md:text-[7rem]`}>0{i + 1}</p>
              <h3 className={`${JUDUL} mt-2 text-[2.6rem] leading-[0.9] md:text-[3.6rem]`}>{l.judul}</h3>
              <p className="mt-4 max-w-[38ch] text-[16px] leading-relaxed text-[#22140e]/75 md:text-lg">{l.isi}</p>
              <p className={`${MONO} mt-5 text-[11px] tracking-[0.12em] text-[#22140e]/60 uppercase`}>{l.ket}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Bingkai({ p, aktif, diam }: { p: MotionValue<number>; aktif: number; diam: boolean }) {
  const l = langkah[aktif];
  return (
    <div className="relative h-full overflow-hidden rounded-[1.6rem] bg-[#22140e]">
      {langkah.map((x, i) => (
        <Lapis key={x.f.src} i={i} p={p} diam={diam} aktif={aktif}>
          <Image src={x.f.src} alt={x.f.alt} fill loading="eager" sizes="(min-width: 768px) 46vw, 92vw" className="object-cover" />
        </Lapis>
      ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

      {/* angka di pojok bawah */}
      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-[#f3ead8] md:inset-x-6 md:bottom-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={l.angka[0]}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className={`${JUDUL} text-[3.4rem] leading-[0.8] md:text-[5.5rem]`}
          >
            {l.angka[0]}
            <span className={`${TANGAN} ml-1 text-[1.8rem] normal-case md:text-[2.6rem]`}>{l.angka[1]}</span>
          </motion.p>
        </AnimatePresence>
        <div className="flex gap-1 pb-2" aria-hidden="true">
          {langkah.map((x, i) => (
            <span key={x.judul} className={`h-1.5 rounded-full transition-all duration-500 ${i === aktif ? "w-7 bg-[#f3ead8]" : "w-1.5 bg-[#f3ead8]/40"}`} />
          ))}
        </div>
      </div>
      <p className={`${MONO} absolute top-4 left-4 rounded-full bg-[#f3ead8] px-3 py-1 text-[10px] tracking-[0.12em] uppercase md:top-6 md:left-6 md:text-[11px]`}>
        Langkah {aktif + 1}/{N}
      </p>
    </div>
  );
}

// Foto langkah ke-i terbuka dari bawah saat langkahnya digulir ke tengah layar
function Lapis({ i, p, diam, aktif, children }: { i: number; p: MotionValue<number>; diam: boolean; aktif: number; children: React.ReactNode }) {
  const mulai = Math.max(0, i / N - 0.1);
  const selesai = Math.max(0.001, i / N + 0.02);
  const sisa = useTransform(p, [mulai, selesai], [100, 0]);
  const klip = useMotionTemplate`inset(${sisa}% 0 0 0)`;
  const skala = useTransform(p, [mulai, selesai + 0.15], [1.18, 1]);
  if (diam) return <div className={`absolute inset-0 transition-opacity duration-500 ${i <= aktif ? "opacity-100" : "opacity-0"}`}>{children}</div>;
  return (
    <motion.div style={i === 0 ? undefined : { clipPath: klip }} className="absolute inset-0">
      <motion.div style={{ scale: skala }} className="absolute inset-0">
        {children}
      </motion.div>
    </motion.div>
  );
}
