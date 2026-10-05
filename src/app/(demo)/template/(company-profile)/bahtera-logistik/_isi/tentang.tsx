"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import s from "./bahtera.module.css";
import { fotoTim, galeri, legalitas, pt } from "./data";
import { useDiam } from "./diam";
import { MONO, STENSIL } from "./gaya";

// Tentang perusahaan: cerita singkat, cap legalitas yang "dicapkan" saat terlihat, dan dua baris foto lapangan
// yang bergeser berlawanan arah mengikuti scroll.

export function Tentang() {
  const ref = useRef<HTMLElement>(null);
  const diam = useDiam();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const baris1 = useTransform(p, [0.3, 1], ["0%", "-22%"]);
  const baris2 = useTransform(p, [0.3, 1], ["-22%", "0%"]);
  const tahun = 2026 - pt.sejak; // tahun berjalan di demo

  return (
    <section ref={ref} id="tentang" className="overflow-hidden bg-[#e4dfd3] py-20 text-[#10213a] md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-[1.1fr_0.9fr] md:gap-16 md:px-8">
        <div>
          <p className={`${MONO} text-[11px] tracking-[0.16em] text-[#b8432f] uppercase md:text-xs`}>● Tentang kami</p>
          <h2 className={`${STENSIL} mt-3 text-[12vw] leading-[0.88] md:text-[5vw]`}>{tahun} tahun di dermaga yang sama</h2>
          <div className="mt-6 max-w-[52ch] space-y-4 text-[15px] leading-relaxed text-[#10213a]/75 md:text-base">
            <p>
              Bahtera dimulai tahun {pt.sejak} dengan dua truk dan satu kantor kecil di Jalan Perak Barat. Sekarang kami melayani pabrik, distributor,
              dan kontraktor yang mengirim barang ke 12 pelabuhan, dari Medan sampai Jayapura.
            </p>
            <p>
              Yang tidak berubah: setiap klien punya satu orang yang bisa dihubungi, dari barang diambil sampai diterima. Tidak dilempar dari satu
              bagian ke bagian lain.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {legalitas.map(([judul, isi], i) => (
              <motion.div
                key={judul}
                initial={diam ? false : { opacity: 0, scale: 1.7, rotate: -18 }}
                whileInView={{ opacity: 1, scale: 1, rotate: i % 2 ? 4 : -5 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.28, delay: i * 0.18, ease: [0.5, 0, 0.75, 0] }}
                className={`${s.cap} grid aspect-square place-items-center rounded-full border-[3px] border-[#b8432f] p-2 text-center text-[#b8432f]`}
              >
                <div className="rounded-full border border-dashed border-[#b8432f] px-2 py-4">
                  <p className={`${STENSIL} text-2xl leading-none`}>{judul}</p>
                  <p className={`${MONO} mt-1 text-[9px] leading-tight uppercase`}>{isi}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm md:aspect-auto">
          <Image src={fotoTim.src} alt={fotoTim.alt} fill sizes="(min-width: 768px) 40vw, 92vw" className="object-cover object-[60%_50%]" />
          <p className={`${MONO} absolute bottom-3 left-3 rounded-sm bg-[#10213a] px-2.5 py-1.5 text-[10px] text-[#eeeae1] uppercase md:text-[11px]`}>
            Tim operasional, kantor Perak
          </p>
        </div>
      </div>

      <div className="mt-16 space-y-3 md:mt-24 md:space-y-4">
        {[galeri.slice(0, 3), galeri.slice(3)].map((baris, k) => (
          <motion.div key={k} style={diam ? undefined : { x: k ? baris2 : baris1 }} className="flex w-max gap-3 md:gap-4">
            {[...baris, ...baris].map((f, i) => (
              <div key={`${f.src}-${i}`} className="relative aspect-[3/2] w-[64vw] shrink-0 overflow-hidden rounded-sm md:w-[30vw]">
                <Image src={f.src} alt={i < 3 ? f.alt : ""} fill sizes="(min-width: 768px) 30vw, 64vw" className="object-cover" />
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
