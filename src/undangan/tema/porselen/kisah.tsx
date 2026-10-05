"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";
import type { Undangan } from "../../types";
import { Danau, Gambar, HALUS, Muncul, Pembatas, Perahu, gilda, naskah } from "./hias";
import s from "./porselen.module.css";

// Kisah cinta sebagai perjalanan perahu: bab-bab berjajar ke samping dan digeser dengan jari (scroll-snap bawaan
// browser) atau tombol panah. Perahu di danau berlayar ke posisi bab yang sedang dibaca, dan isi bab yang aktif
// (foto, angka tahun, teks) masuk dengan animasi berbasis waktu.
// Sengaja tidak mengikuti scroll halaman: versi sebelumnya (bab bergeser mengikuti scroll vertikal, isi menempel
// di layar) bergetar di HP karena posisi tiap elemen dihitung ulang setiap kali layar bergulir.

export function Kisah({ u }: { u: Undangan }) {
  const n = u.cerita.length;
  const foto = (i: number) => u.foto.galeri[(i * 2 + 1) % u.foto.galeri.length];
  const [aktif, setAktif] = useState(0);
  const jalur = useRef<HTMLDivElement>(null);

  const keBab = (i: number) => {
    const el = jalur.current;
    if (!el) return;
    const tujuan = Math.max(0, Math.min(n - 1, i));
    const halus = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: tujuan * el.clientWidth, behavior: halus ? "smooth" : "instant" });
  };

  return (
    <section id="cerita" className={`${s.sek} ${s.kertas} relative overflow-hidden pt-14 pb-10`}>
      <svg viewBox="0 0 440 28" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-7 w-full -translate-y-[98%]" aria-hidden="true">
        <path d="M0 28V16C40 4 80 4 120 14s80 12 120 2 80-14 120-4 60 8 80 4V28Z" fill="#f6f3ec" />
      </svg>

      {/* pegunungan jauh di belakang bab-bab */}
      <div className="pointer-events-none absolute inset-x-[-10%] top-[34%] opacity-35 [mask-image:linear-gradient(to_bottom,black_50%,transparent)]" aria-hidden="true">
        <Gambar a="gunung" sizes="(min-width: 440px) 480px, 120vw" />
      </div>

      <div className="relative z-10 px-6 text-center">
        <Muncul>
          <p className="text-[10px] tracking-[0.45em] text-[#b8934f] uppercase">Perjalanan kami</p>
        </Muncul>
        <Muncul jeda={0.1} dari="scale(0.82)">
          <h2 className={`${naskah} text-[3rem] leading-tight text-[#1f3768]`}>Kisah Cinta</h2>
        </Muncul>
        <Muncul jeda={0.25}>
          <Pembatas />
        </Muncul>
      </div>

      {/* jalur bab: geser ke samping */}
      <div
        ref={jalur}
        onScroll={(e) => {
          const el = e.currentTarget;
          const i = Math.round(el.scrollLeft / el.clientWidth);
          if (i !== aktif) setAktif(i);
        }}
        className="relative z-10 mt-6 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="Kisah cinta"
      >
        {u.cerita.map((c, i) => (
          <Bab key={c.tahun} c={c} i={i} n={n} foto={foto(i)} aktif={i === aktif} />
        ))}
      </div>

      {/* danau & perahu yang berlayar ke bab yang aktif */}
      <div className="relative mt-2 h-24" aria-hidden="true">
        <Danau className="inset-0" />
        <motion.div
          className="absolute inset-x-[8%] bottom-[38%] h-14"
          initial={false}
          animate={{ transform: `translateX(${n > 1 ? (aktif / (n - 1)) * 84 : 42}%)` }}
          transition={{ duration: 1.4, ease: HALUS }}
        >
          <Perahu className="bottom-0 left-0 w-[9%]" />
        </motion.div>
      </div>

      {/* kendali: panah, nomor bab, titik */}
      <div className="relative z-10 mt-5 flex items-center justify-center gap-5">
        <TombolBab arah="kiri" mati={aktif === 0} onClick={() => keBab(aktif - 1)} />
        <div className="min-w-[7rem] text-center">
          <p className={`${gilda} text-[12px] tracking-[0.3em] text-[#27427a] uppercase`}>
            Bab {aktif + 1} / {n}
          </p>
          <div className="mt-2 flex justify-center gap-1.5">
            {u.cerita.map((c, i) => (
              <button
                key={c.tahun}
                type="button"
                onClick={() => keBab(i)}
                aria-label={`Bab ${i + 1}: ${c.judul}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === aktif ? "w-6 bg-[#b8934f]" : "w-1.5 bg-[#27427a]/30"}`}
              />
            ))}
          </div>
        </div>
        <TombolBab arah="kanan" mati={aktif === n - 1} onClick={() => keBab(aktif + 1)} />
      </div>
      <p className="relative z-10 mt-3 text-center text-[11px] text-[#27427a]/60">Geser ke samping untuk bab berikutnya</p>
    </section>
  );
}

function Bab({ c, i, n, foto, aktif }: { c: Undangan["cerita"][number]; i: number; n: number; foto: Undangan["foto"]["galeri"][number]; aktif: boolean }) {
  const anim = aktif ? "aktif" : "diam";
  return (
    <article className="relative w-full flex-none snap-center px-8 pt-4 text-center" aria-label={`Bab ${i + 1} dari ${n}`}>
      {/* angka tahun besar bergaris di belakang foto */}
      <motion.p
        className={`${gilda} pointer-events-none absolute top-0 left-1/2 text-[7rem] leading-none text-transparent [-webkit-text-stroke:1.2px_#27427a]`}
        initial={false}
        animate={anim}
        variants={{ diam: { opacity: 0, transform: "translateX(-30%)" }, aktif: { opacity: 0.22, transform: "translateX(-50%)", transition: { duration: 1.2, ease: HALUS } } }}
        aria-hidden="true"
      >
        {c.tahun}
      </motion.p>

      <motion.div
        className="relative mx-auto w-[56%]"
        initial={false}
        animate={anim}
        variants={{
          diam: { opacity: 0.55, transform: `scale(0.88) rotate(${i % 2 ? 3 : -3}deg)` },
          aktif: { opacity: 1, transform: "scale(1) rotate(0deg)", transition: { duration: 1.1, ease: HALUS } },
        }}
      >
        <div className={`${s.kawung} relative aspect-[3/4] rounded-t-full rounded-b-xl p-[6px] shadow-[0_18px_28px_-18px_rgb(20_35_70/0.9)]`}>
          <div className="h-full w-full rounded-t-full rounded-b-lg bg-[#fbfaf6] p-[2px]">
            <div className="relative h-full w-full overflow-hidden rounded-t-full rounded-b-md">
              <Image src={foto.src} alt={foto.alt} fill sizes="240px" className="object-cover" />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="relative mt-5"
        initial={false}
        animate={anim}
        variants={{ diam: { opacity: 0, transform: "translateY(16px)" }, aktif: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.9, ease: HALUS, delay: 0.25 } } }}
      >
        <p className={`${gilda} text-[11px] tracking-[0.35em] text-[#b8934f] uppercase`}>
          Bab {i + 1} · {c.tahun}
        </p>
        <h3 className={`${naskah} mt-1 text-[2.4rem] leading-none text-[#1f3768]`}>{c.judul}</h3>
        <p className="mx-auto mt-3 max-w-[18rem] text-[13.5px] leading-relaxed text-[#27427a]/90">{c.isi}</p>
      </motion.div>
    </article>
  );
}

function TombolBab({ arah, mati, onClick }: { arah: "kiri" | "kanan"; mati: boolean; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      disabled={mati}
      aria-label={arah === "kiri" ? "Bab sebelumnya" : "Bab berikutnya"}
      className="grid size-10 shrink-0 place-items-center rounded-full bg-[#fbfaf6] text-[#27427a] shadow-[0_8px_16px_-10px_rgb(15_28_56/0.7)] ring-1 ring-[#b8934f]/60 transition-opacity disabled:opacity-35"
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={arah === "kiri" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"} />
      </svg>
    </motion.button>
  );
}
