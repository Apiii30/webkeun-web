"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { useStatusBuka } from "./buka";
import { fotoMalam, jam, kedai, waPesan } from "./data";
import { useDiam } from "./diam";
import { JUDUL, MONO, TANGAN } from "./gaya";
import s from "./kawalu.module.css";
import { StatusBuka } from "./kepala";

// Lokasi & jam buka di "malam hari" (penutup halaman). Baris hari ini disorot, peta Google Maps diwarnai
// gelap lewat filter CSS supaya senada. Footer: nama kedai besar dengan uap kopi yang naik.

const pukul = (m: number) => (m === 1440 ? "24.00" : `${String(Math.floor(m / 60)).padStart(2, "0")}.${String(m % 60).padStart(2, "0")}`);
// Senin dulu, Minggu terakhir
const URUT = [1, 2, 3, 4, 5, 6, 0];

export function Lokasi() {
  const ref = useRef<HTMLElement>(null);
  const diam = useDiam();
  const st = useStatusBuka();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const fotoY = useTransform(p, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} id="lokasi" className="relative overflow-hidden bg-[#150d09] pt-20 text-[#f3ead8] md:pt-28">
      {/* bintang */}
      <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden="true">
        {Array.from({ length: 22 }, (_, i) => (
          <span key={i} className="absolute size-[2px] rounded-full bg-[#f3ead8]" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 46}%`, opacity: 0.3 + ((i * 7) % 7) / 10 }} />
        ))}
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-[1fr_1fr] md:gap-16 md:px-8">
        <div>
          <p className={`${MONO} text-[11px] tracking-[0.16em] text-[#e7c27f] uppercase md:text-xs`}>● Lokasi & jam buka</p>
          <h2 className={`${JUDUL} mt-3 text-[15vw] leading-[0.82] md:text-[6.6vw]`}>
            Buka sampai
            <br />
            malam, kok
          </h2>
          <StatusBuka gelap className="mt-6 inline-flex" />

          <table className="mt-8 w-full text-[15px] md:text-base">
            <tbody>
              {URUT.map((h) => {
                const j = jam[h];
                const ini = st?.hari === h;
                return (
                  <tr key={j.hari} className={`border-b border-[#f3ead8]/12 ${ini ? "text-[#e7c27f]" : ""}`}>
                    <th scope="row" className="py-2.5 text-left font-semibold">
                      {j.hari}
                      {ini && <span className={`${TANGAN} ml-2 text-lg font-semibold`}>← hari ini</span>}
                    </th>
                    <td className="py-2.5 text-right text-[#f3ead8]/60">{j.catatan}</td>
                    <td className={`${MONO} py-2.5 pl-4 text-right whitespace-nowrap`}>
                      {pukul(j.buka)}–{pukul(j.tutup)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <p className="mt-8 max-w-sm text-[16px] leading-relaxed">{kedai.alamat}</p>
          <p className="mt-1 text-sm text-[#f3ead8]/60">Cari papan nama kayu bergambar cangkir. Parkir di samping kedai.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={kedai.peta} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#f3ead8] px-6 py-3 font-bold text-[#22140e] transition-transform hover:-translate-y-0.5">
              Petunjuk arah
            </a>
            <a
              href={waPesan(`Halo ${kedai.nama}! Mau tanya, `)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-[#f3ead8]/70 px-6 py-2.5 font-bold transition-colors hover:bg-[#f3ead8] hover:text-[#22140e]"
            >
              Chat WhatsApp
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.4rem]">
            <motion.div style={diam ? undefined : { y: fotoY }} className="absolute inset-x-0 -inset-y-[10%]">
              <Image src={fotoMalam.src} alt={fotoMalam.alt} fill sizes="(min-width: 768px) 46vw, 92vw" className="object-cover" />
            </motion.div>
          </div>
          <iframe
            title={`Peta lokasi ${kedai.nama}`}
            src={kedai.petaSemat}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-64 w-full rounded-[1.4rem] border-0 [filter:invert(0.9)_hue-rotate(180deg)_saturate(0.6)_brightness(0.95)] md:h-72"
          />
        </div>
      </div>

      {/* footer */}
      <footer className="relative mt-24 md:mt-32">
        <div className="relative mx-auto max-w-6xl px-5 md:px-8">
          <svg viewBox="0 0 120 60" className="absolute -top-[13vw] left-[44%] w-[18vw] text-[#f3ead8]/80 md:-top-[8vw] md:w-[11vw]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            {["M30 58c-10-12 10-18 0-30s8-18 0-26", "M60 58c-10-12 10-18 0-30s8-18 0-26", "M90 58c-10-12 10-18 0-30s8-18 0-26"].map((d, i) => (
              <path key={d} d={d} pathLength={1} className={s.uap} style={{ animationDelay: `${i * 0.9}s` }} />
            ))}
          </svg>
          <p className={`${JUDUL} text-center text-[31vw] leading-[0.78] tracking-[-0.02em] text-[#f3ead8] md:text-[22vw]`} aria-hidden="true">
            Kawalu
          </p>
        </div>
        <div className={`${MONO} mx-auto flex max-w-6xl flex-wrap justify-between gap-3 border-t border-[#f3ead8]/15 px-5 pt-5 pb-28 text-[11px] tracking-[0.1em] text-[#f3ead8]/60 uppercase md:px-8 md:text-xs`}>
          <span>© 2026 {kedai.nama}</span>
          <a href={`https://instagram.com/${kedai.instagram}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#f3ead8]">
            Instagram @{kedai.instagram}
          </a>
          <a href="#atas" className="hover:text-[#f3ead8]">
            Kembali ke atas ↑
          </a>
        </div>
      </footer>
    </section>
  );
}
