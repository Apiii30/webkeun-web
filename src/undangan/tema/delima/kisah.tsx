"use client";

import { motion, useReducedMotion, useScroll } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import type { Undangan } from "../../types";
import { Muncul, Pembatas, Segel, naskah, prata } from "./hias";
import s from "./delima.module.css";

// Kisah cinta berupa surat-surat bersegel lilin. Tiap bab adalah amplop marun; saat digulir ke tengah layar
// segelnya lepas, tutup amplop terbuka (3D), lalu surat berisi foto & cerita naik keluar dari amplop.
// Tiap amplop dibuka sekali saat sudah cukup terlihat, dengan animasi berbasis waktu (bukan mengikuti scroll: versi
// yang digerakkan scroll bergetar di HP karena dihitung ulang tiap kali layar bergulir). Benang emas di tengah
// tetap mengikuti scroll tapi hanya berupa skala satu garis tipis. "Kurangi gerakan": surat langsung tampil terbuka.

export function Kisah({ u }: { u: Undangan }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const foto = (i: number) => u.foto.galeri[(i * 2 + 1) % u.foto.galeri.length];
  const huruf = `${u.wanita.panggilan[0]}${u.pria.panggilan[0]}`;
  return (
    <div className="relative">
      <div className="relative z-10 px-6 text-center">
        <Muncul>
          <p className={`${prata} text-[10px] tracking-[0.45em] text-[#a0727a] uppercase`}>Surat-surat kami</p>
        </Muncul>
        <Muncul jeda={0.1} dari="scale(0.82)">
          <h2 className={`${naskah} text-[3.4rem] leading-tight text-[#4a1219]`}>Love Story</h2>
        </Muncul>
        <Muncul jeda={0.25}>
          <Pembatas />
        </Muncul>
      </div>
      <div ref={ref} className="relative mt-10 space-y-14">
        {/* benang emas yang menyambung surat-surat, terisi mengikuti scroll */}
        <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 border-l border-dashed border-[#c9a35c]/50" aria-hidden="true" />
        <motion.div
          className="pointer-events-none absolute top-0 bottom-0 left-1/2 w-[2px] origin-top -translate-x-1/2 bg-gradient-to-b from-[#c9a35c] to-[#7b2431]"
          style={{ scaleY: scrollYProgress }}
          aria-hidden="true"
        />
        {u.cerita.map((c, i) => (
          <Surat key={c.tahun} c={c} i={i} foto={foto(i)} huruf={huruf} />
        ))}
      </div>
    </div>
  );
}

// urutan buka satu amplop (detik setelah amplop terlihat)
const T = { segel: 0.15, tutup: 0.5, surat: 1.25 };
const LEMBUT = [0.45, 0, 0.25, 1] as const;

function Surat({ c, i, foto, huruf }: { c: Undangan["cerita"][number]; i: number; foto: Undangan["foto"]["galeri"][number]; huruf: string }) {
  const terbuka = !!useReducedMotion();
  const miring = i % 2 ? 3 : -3;

  // Amplop selebar wadah dengan rasio 1 : 0.62, menempel di dasar wadah. Surat (tinggi mengikuti isinya) ada di
  // atasnya; 25% lebar terakhir surat tetap di dalam amplop. Wadah memotong apa pun di bawah dasar amplop, jadi
  // surat yang masih di dalam amplop tersembunyi.
  const geo = "absolute inset-x-0 bottom-0 aspect-[1/0.62]";
  return (
    <motion.div
      className={`relative mx-auto w-[86%] [container-type:inline-size] ${i ? "-mt-[16%]" : ""}`}
      initial={terbuka ? "buka" : "tutup"}
      whileInView="buka"
      viewport={{ once: true, amount: 0.55 }}
    >
      <motion.div
        variants={{
          tutup: { opacity: 0, transform: `translateY(60px) rotate(${i % 2 ? 4 : -4}deg)` },
          buka: { opacity: 1, transform: "translateY(0px) rotate(0deg)", transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
        }}
      >
        <div className="relative overflow-hidden pb-[37%] [perspective:1100px]">
          {/* amplop belakang & sisi dalam tutupnya (tampak setelah terbuka lewat 90°) */}
          <div className={geo}>
            <div className="absolute inset-0 rounded-[6px] bg-[#5a1520]" />
            <motion.div
              className="absolute inset-x-0 top-0 h-[62%] origin-top"
              variants={{
                tutup: { opacity: 0, transform: "rotateX(90deg)" },
                buka: {
                  opacity: 1,
                  transform: "rotateX(180deg)",
                  transition: { opacity: { duration: 0, delay: T.tutup + 0.4 }, transform: { duration: 0.45, ease: "easeOut", delay: T.tutup + 0.4 } },
                },
              }}
            >
              <div className={`${s.marun} h-full w-full [clip-path:polygon(0_0,100%_0,50%_100%)]`} />
            </motion.div>
          </div>

          {/* surat: mulai di dalam amplop (tingginya sendiri dikurangi 20% lebar wadah), lalu naik keluar */}
          <motion.div
            className="relative z-10 mx-[5%]"
            variants={{
              tutup: { transform: `translateY(calc(100% - 20cqw)) rotate(${miring}deg)` },
              buka: { transform: "translateY(0px) rotate(0deg)", transition: { duration: 1.3, ease: LEMBUT, delay: T.surat } },
            }}
          >
            <div className={`${s.kertas} rounded-[4px] p-[6%] pb-[30cqw] shadow-[0_10px_24px_-14px_rgb(40_5_10/0.6)] ring-1 ring-[#c9a35c]/40`}>
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[999px] rounded-b-[6px]">
                <Image src={foto.src} alt={foto.alt} fill sizes="(min-width: 440px) 320px, 80vw" className="object-cover" />
                <span className="pointer-events-none absolute inset-[5px] rounded-t-[999px] rounded-b-[4px] border border-[#fbf4f1]/80" aria-hidden="true" />
              </div>
              <p className={`${prata} mt-4 text-center text-[10px] tracking-[0.35em] text-[#a0727a] uppercase`}>
                Bab {i + 1} · {c.tahun}
              </p>
              <h3 className={`${naskah} mt-1 text-center text-[2.5rem] leading-none text-[#4a1219]`}>{c.judul}</h3>
              <p className="mx-auto mt-2 max-w-[17rem] text-center text-[14px] leading-relaxed text-[#5a1520]/90">{c.isi}</p>
            </div>
          </motion.div>

          {/* kantong depan amplop, tutup luar & segel lilin */}
          <div className={`${geo} z-20`}>
            <svg viewBox="0 0 160 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
              <path d="M0 4 80 58 160 4V96Q160 100 156 100H4Q0 100 0 96Z" fill="#6b1a26" />
              <path d="M0 100 70 50M160 100 90 50" stroke="#4a1219" strokeWidth=".8" fill="none" />
              <path d="M0 4 80 58 160 4" stroke="#c9a35c" strokeWidth=".9" fill="none" />
              <path d="M6 94H154" stroke="#c9a35c" strokeWidth=".5" strokeDasharray="1.5 2.5" fill="none" opacity=".7" />
            </svg>
            <motion.div
              className="absolute inset-x-0 top-0 h-[62%] origin-top"
              variants={{
                tutup: { opacity: 1, transform: "rotateX(0deg)" },
                buka: {
                  opacity: 0,
                  transform: "rotateX(90deg)",
                  transition: { transform: { duration: 0.4, ease: "easeIn", delay: T.tutup }, opacity: { duration: 0, delay: T.tutup + 0.4 } },
                },
              }}
            >
              <svg viewBox="0 0 160 60" preserveAspectRatio="none" className="h-full w-full drop-shadow-[0_6px_6px_rgb(40_5_10/0.45)]" aria-hidden="true">
                <path d="M0 0H160L84 58Q80 61 76 58Z" fill="#7b2431" />
                <path d="M4 2H156L82 55Q80 57 78 55Z" fill="none" stroke="#c9a35c" strokeWidth=".8" />
              </svg>
            </motion.div>
            <motion.div
              className="absolute top-[62%] left-1/2 w-[22%]"
              variants={{
                tutup: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
                buka: { opacity: 0, transform: "translate(-50%, -50%) scale(1.5)", transition: { duration: 0.45, ease: "easeOut", delay: T.segel } },
              }}
            >
              <Segel huruf={huruf} className="w-full" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
