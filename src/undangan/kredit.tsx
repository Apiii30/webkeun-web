"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useId } from "react";

// Kredit kecil di ujung setiap undangan: "Undangan ini dirangkai oleh Webkeun". Saat terlihat, huruf W logo Webkeun
// tersingkap dari kiri seperti sedang digambar, garis miring mint memantul masuk lalu terus berdenyut pelan (dan melompat
// saat disentuh), dan tulisan webkeun tersingkap dari kiri.
// Diketuk: membuka galeri tema undangan Webkeun di tab baru, supaya tamu tidak kehilangan undangannya.
// gelap: untuk undangan berlatar gelap. Teks labelnya memakai huruf & warna tema di sekitarnya.

// Ikon W/ (sama dengan public/brand/logo-webkeun-final/ikon-warna-untuk-latar-terang.svg): huruf W dan garis miring mint
const W = "M320.85 305.65 L385.10 440.00 L503.34 440.00 L321.02 58.79 L223.87 261.18 L152.14 40.00 L40.00 40.00 L169.73 440.00 L256.36 440.00Z";
const GARIS = "M538.89 440.00 L648.11 440.00 L736.11 40.00 L626.89 40.00Z";
const T_GARIS = 1.0;

export function KreditWebkeun({ gelap = false, className = "" }: { gelap?: boolean; className?: string }) {
  const tinta = gelap ? "#FFFFFF" : "#15132B";
  const klip = useId();
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
        className={`group mt-2.5 inline-flex items-center gap-1.5 rounded-full transition-[scale] duration-200 active:scale-95 border py-1.5 pr-3.5 pl-3 font-[family-name:var(--font-jakarta)] ${
          gelap ? "border-white/15 bg-white/[0.07]" : "border-[#15132B]/10 bg-white/70 shadow-[0_10px_22px_-14px_rgb(21_19_43/0.45)]"
        }`}
        variants={{ awal: { opacity: 0, transform: "scale(0.9)" }, tampil: { opacity: 1, transform: "scale(1)", transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: 0.15 } } }}
      >
        {/* tinggi ikon = tinggi tulisan, seperti logo horizontal Webkeun */}
        <svg viewBox="40 40 696.11 400" className="h-[13.5px] w-auto overflow-visible" aria-hidden="true">
          <defs>
            <clipPath id={klip}>
              <motion.rect x="40" y="0" height="480" variants={{ awal: { width: 0 }, tampil: { width: 470, transition: { duration: 0.9, ease: [0.65, 0, 0.35, 1], delay: 0.3 } } }} />
            </clipPath>
          </defs>
          <path d={W} fill={tinta} clipPath={`url(#${klip})`} />
          {/* denyut di sekitar garis mint */}
          <motion.path
            d={GARIS}
            fill="none"
            stroke="#2FD3B0"
            strokeWidth="28"
            strokeLinejoin="round"
            style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
            variants={{
              awal: { opacity: 0, scale: 1 },
              // keyframe pertama 0: selama jeda, keyframe pertama sudah dipasang
              tampil: { opacity: [0, 0.6, 0], scale: [1, 1, 1.6], transition: { duration: 1.5, times: [0, 0.06, 1], ease: "easeOut", repeat: Infinity, repeatDelay: 1.8, delay: T_GARIS + 0.5 } },
            }}
          />
          <motion.path
            d={GARIS}
            fill="#2FD3B0"
            className="transition-[translate] duration-300 group-hover:-translate-y-[60px]"
            style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
            variants={{
              awal: { opacity: 0, y: -150 },
              tampil: { opacity: [0, 1, 1, 1], y: [-150, 0, -30, 0], transition: { duration: 0.75, times: [0, 0.45, 0.75, 1], delay: T_GARIS } },
            }}
          />
        </svg>
        <motion.span
          className="block"
          variants={{
            awal: { clipPath: "inset(0% 100% 0% 0%)" },
            tampil: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1], delay: 1.35 } },
          }}
        >
          {/* eager: berkas kecil, dan pemuatan lazy kadang terlambat sehingga tulisannya belum ada saat tersingkap */}
          <Image src={gelap ? "/brand/tulisan-webkeun-gelap.svg" : "/brand/tulisan-webkeun.svg"} alt="Webkeun" width={76} height={14} loading="eager" className="h-[13.5px] w-auto" />
        </motion.span>
      </motion.a>
    </motion.div>
  );
}
