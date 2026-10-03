"use client";

import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import type { Undangan } from "../../types";
import { Muncul, Pembatas, Segel, naskah, prata } from "./hias";
import s from "./delima.module.css";

// Kisah cinta berupa surat-surat bersegel lilin. Tiap bab adalah amplop marun; saat digulir ke tengah layar
// segelnya lepas, tutup amplop terbuka (3D), lalu surat berisi foto & cerita naik keluar dari amplop.
// Digerakkan scroll (motion useScroll, dijalankan ScrollTimeline browser bila ada). "Kurangi gerakan": surat
// langsung tampil terbuka.

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

function Surat({ c, i, foto, huruf }: { c: Undangan["cerita"][number]; i: number; foto: Undangan["foto"]["galeri"][number]; huruf: string }) {
  const amplop = useRef<HTMLDivElement>(null);
  const terbuka = !!useReducedMotion();
  // dihitung dari posisi amplop: mulai saat amplop utuh di bawah layar (masih bersegel), selesai saat amplop di tengah layar mulai saat amplop masuk layar, selesai saat amplop di atas tengah layar suratnya utuh terlihat
  const { scrollYProgress: p } = useScroll({ target: amplop, offset: ["start 80%", "start 50%"] });
  const segel = useTransform(p, [0.02, 0.18], [1, 0]);
  const segelS = useTransform(p, [0.02, 0.18], [1, 1.5]);
  const sudut = useTransform(p, [0.1, 0.48], [0, 180]);
  const depan = useTransform(sudut, (v) => (v < 90 ? 1 : 0));
  const belakang = useTransform(sudut, (v) => (v < 90 ? 0 : 1));
  const turun = useTransform(p, [0.4, 1], [1, 0]);
  const miring = useTransform(p, [0.4, 1], [i % 2 ? 3 : -3, 0]);

  const tutup = useMotionTemplate`rotateX(${sudut}deg)`;
  // surat mulai di dalam amplop: tingginya sendiri dikurangi 20% lebar wadah (cqw), lalu naik ke posisi asli
  const surat = useMotionTemplate`translateY(calc((100% - 20cqw) * ${turun})) rotate(${miring}deg)`;
  const pecah = useMotionTemplate`translate(-50%, -50%) scale(${segelS})`;

  // Amplop selebar wadah dengan rasio 1 : 0.62, menempel di dasar wadah. Surat (tinggi mengikuti isinya) ada di
  // atasnya; 25% lebar terakhir surat tetap di dalam amplop. Wadah memotong apa pun di bawah dasar amplop, jadi
  // surat yang masih di dalam amplop tersembunyi.
  const geo = "absolute inset-x-0 bottom-0 aspect-[1/0.62]";
  return (
    <motion.div
      className={`relative mx-auto w-[86%] [container-type:inline-size] ${i ? "-mt-[16%]" : ""}`}
      initial={{ opacity: 0, transform: `translateY(60px) rotate(${i % 2 ? 4 : -4}deg)` }}
      whileInView={{ opacity: 1, transform: "translateY(0px) rotate(0deg)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative overflow-hidden pb-[37%] [perspective:1100px]">
        {/* amplop belakang & sisi dalam tutupnya (tampak setelah terbuka lewat 90°) */}
        <div ref={amplop} className={geo}>
          <div className="absolute inset-0 rounded-[6px] bg-[#5a1520]" />
          <motion.div className="absolute inset-x-0 top-0 h-[62%] origin-top" style={terbuka ? { transform: "rotateX(180deg)" } : { transform: tutup, opacity: belakang }}>
            <div className={`${s.marun} h-full w-full [clip-path:polygon(0_0,100%_0,50%_100%)]`} />
          </motion.div>
        </div>

        {/* surat */}
        <motion.div className="relative z-10 mx-[5%]" style={terbuka ? undefined : { transform: surat }}>
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
          <motion.div className="absolute inset-x-0 top-0 h-[62%] origin-top" style={terbuka ? { opacity: 0 } : { transform: tutup, opacity: depan }}>
            <svg viewBox="0 0 160 60" preserveAspectRatio="none" className="h-full w-full drop-shadow-[0_6px_6px_rgb(40_5_10/0.45)]" aria-hidden="true">
              <path d="M0 0H160L84 58Q80 61 76 58Z" fill="#7b2431" />
              <path d="M4 2H156L82 55Q80 57 78 55Z" fill="none" stroke="#c9a35c" strokeWidth=".8" />
            </svg>
          </motion.div>
          <motion.div className="absolute top-[62%] left-1/2 w-[22%]" style={terbuka ? { opacity: 0 } : { opacity: segel, transform: pecah }}>
            <Segel huruf={huruf} className="w-full" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
