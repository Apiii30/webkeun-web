"use client";

import { motion } from "motion/react";
import Image from "next/image";

// Kredit kecil di ujung setiap undangan: "Undangan ini dirangkai oleh Webkeun". Saat terlihat, logo wk tergambar
// sendiri goresan demi goresan (urutannya sama dengan cara logo itu dibentuk: w, tiang k, dua kaki k), titik mint
// memantul masuk lalu terus berdenyut pelan (dan melompat saat disentuh), dan tulisan Webkeun tersingkap dari kiri.
// Diketuk: membuka galeri tema undangan Webkeun di tab baru, supaya tamu tidak kehilangan undangannya.
// gelap: untuk undangan berlatar gelap. Teks labelnya memakai huruf & warna tema di sekitarnya.

const GORES = [
  { d: "M14 30 V62 A16 16 0 0 0 46 62 V42 M46 62 A16 16 0 0 0 78 62 V30", tinta: true, jeda: 0.3, durasi: 1.1 },
  { d: "M96 20 V92", tinta: false, jeda: 1.15, durasi: 0.45 },
  { d: "M98 66 L112 52", tinta: false, jeda: 1.5, durasi: 0.25 },
  { d: "M98 66 L116 92", tinta: false, jeda: 1.65, durasi: 0.3 },
];
const T_TITIK = 1.95;

export function KreditWebkeun({ gelap = false, className = "" }: { gelap?: boolean; className?: string }) {
  const tinta = gelap ? "#f4f1ff" : "#15132B";
  const ungu = gelap ? "#a797ff" : "#5B3DF5";
  return (
    <motion.div className={`relative flex flex-col items-center ${className}`} initial="awal" whileInView="tampil" viewport={{ once: true, amount: 0.8 }}>
      <motion.p
        className="flex items-center gap-2.5 text-[9.5px] tracking-[0.32em] uppercase opacity-70"
        variants={{ awal: { opacity: 0, transform: "translateY(8px)" }, tampil: { opacity: 0.7, transform: "translateY(0px)", transition: { duration: 0.8 } } }}
      >
        <span className="h-px w-6 bg-current opacity-50" aria-hidden="true" />
        Undangan ini dirangkai oleh
        <span className="h-px w-6 bg-current opacity-50" aria-hidden="true" />
      </motion.p>

      <motion.a
        href="/template/undangan"
        target="_blank"
        rel="noopener"
        aria-label="Webkeun: lihat tema undangan digital lainnya (tab baru)"
        className={`group mt-2.5 inline-flex items-center gap-2 rounded-full transition-[scale] duration-200 active:scale-95 border py-1.5 pr-3.5 pl-3 font-[family-name:var(--font-jakarta)] ${
          gelap ? "border-white/15 bg-white/[0.07]" : "border-[#15132B]/10 bg-white/70 shadow-[0_10px_22px_-14px_rgb(21_19_43/0.45)]"
        }`}
        variants={{ awal: { opacity: 0, transform: "scale(0.9)" }, tampil: { opacity: 1, transform: "scale(1)", transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: 0.15 } } }}
      >
        <svg viewBox="5.5 11.5 124.5 89" className="h-[17px] w-auto overflow-visible" aria-hidden="true">
          {GORES.map((g) => (
            <motion.path
              key={g.d}
              d={g.d}
              fill="none"
              stroke={g.tinta ? tinta : ungu}
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={{
                awal: { pathLength: 0, opacity: 0 },
                tampil: { pathLength: 1, opacity: 1, transition: { pathLength: { duration: g.durasi, ease: [0.65, 0, 0.35, 1], delay: g.jeda }, opacity: { duration: 0.01, delay: g.jeda } } },
              }}
            />
          ))}
          {/* denyut di sekitar titik mint */}
          <motion.circle
            cx="118"
            cy="44"
            r="8"
            fill="none"
            stroke="#2FD3B0"
            strokeWidth="3"
            style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
            variants={{
              awal: { opacity: 0, scale: 1 },
              // keyframe pertama 0: selama jeda, keyframe pertama sudah dipasang
              tampil: { opacity: [0, 0.7, 0], scale: [1, 1, 2.4], transition: { duration: 1.5, times: [0, 0.06, 1], ease: "easeOut", repeat: Infinity, repeatDelay: 1.8, delay: T_TITIK + 0.5 } },
            }}
          />
          <motion.circle
            cx="118"
            cy="44"
            r="8"
            fill="#2FD3B0"
            className="transition-[translate] duration-300 group-hover:-translate-y-[7px]"
            style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
            variants={{
              awal: { scale: 0, y: -26 },
              tampil: { scale: [0, 1.35, 0.9, 1], y: [-26, 0, -6, 0], transition: { duration: 0.75, times: [0, 0.45, 0.75, 1], delay: T_TITIK } },
            }}
          />
        </svg>
        <motion.span
          className="block"
          variants={{
            awal: { clipPath: "inset(0% 100% 0% 0%)" },
            tampil: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1], delay: 1.55 } },
          }}
        >
          {/* eager: berkas kecil, dan pemuatan lazy kadang terlambat sehingga tulisannya belum ada saat tersingkap */}
          <Image src={gelap ? "/brand/tulisan-putih.svg" : "/brand/tulisan.svg"} alt="Webkeun" width={70} height={14} loading="eager" className="h-[13.5px] w-auto" />
        </motion.span>
      </motion.a>
    </motion.div>
  );
}
