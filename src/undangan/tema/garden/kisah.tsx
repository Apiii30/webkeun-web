"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { ReactNode } from "react";
import { useParalaks } from "../../pakai";
import type { Undangan } from "../../types";
import { Gambar, LEMBUT, Muncul, Wisteria, cormorant, italiana } from "./hias";
import s from "./garden.module.css";

// Kisah cinta "Lorong Gapura": tiap bab adalah satu gapura taman yang dilewati. Saat digulir:
//  - gapura naik mendekat, tegak saat dibaca, lalu membesar & memudar seakan kita berjalan menembusnya ke bab
//    berikutnya;
//  - foto di dalam lengkung gapura bangkit berdiri dalam 3D (berporos di kakinya), foto di dalamnya bergeser pelan;
//  - angka tahun bergaris di belakang bergerak paling lambat (terasa jauh).
// Antarbab disambung batu pijakan. Gerak yang mengikuti scroll murni CSS (scroll-driven animation, kelas k* di
// CSS), hanya transform & opacity, tanpa sticky & tanpa hitungan JavaScript per frame, jadi tidak bergetar. Browser
// yang tidak menjalankannya dengan mulus (lihat useParalaks) mendapat versi berbasis waktu saat terlihat.

type Cerita = Undangan["cerita"][number];
type Foto = Undangan["foto"]["galeri"][number];

export function Kisah({ u }: { u: Undangan }) {
  const paralaks = useParalaks();
  const foto = (i: number) => u.foto.galeri[(i * 2 + 1) % u.foto.galeri.length];
  return (
    <div className="relative mt-4">
      {u.cerita.map((c, i) => (
        <div key={c.tahun}>
          {i > 0 && <BatuPijakan />}
          <Bab c={c} i={i} n={u.cerita.length} foto={foto(i)} paralaks={paralaks} />
        </div>
      ))}
    </div>
  );
}

function Bab({ c, i, n, foto, paralaks }: { c: Cerita; i: number; n: number; foto: Foto; paralaks: boolean }) {
  const kanan = i % 2 === 1;
  return (
    <article className="relative [perspective:1100px]" aria-label={`Bab ${i + 1} dari ${n}`}>
      {/* angka tahun besar bergaris di belakang gapura: paling jauh, paling lambat */}
      <div className={`pointer-events-none absolute top-[6%] ${kanan ? "-left-[2%]" : "-right-[2%]"}`} aria-hidden="true">
        <p className={`${s.kJauh} ${italiana} text-[5.6rem] leading-none text-transparent opacity-35 [-webkit-text-stroke:1.2px_#34596a]`}>{c.tahun}</p>
      </div>

      {/* gapura & foto di lengkungnya (kotak sama dengan gambar gapura) */}
      <div className="relative mx-auto aspect-[1000/1500] w-[96%]">
        <Lewati paralaks={paralaks}>
          <Gambar a="gapura" sizes="(min-width: 440px) 410px, 92vw" />
          <Wisteria className="top-[22%] left-[13%] w-[10%]" jeda={-i * 0.6} />
          <Wisteria className="top-[17%] left-[19%] w-[8%]" jeda={-1.6 - i * 0.6} />
          <Wisteria className="top-[22%] right-[13%] w-[10%]" jeda={-0.8 - i * 0.6} />
          <Wisteria className="top-[17%] right-[19%] w-[8%]" jeda={-2.4 - i * 0.6} />
        </Lewati>
        <div className="absolute top-[27%] left-[21%] w-[58%]">
          <Timbul paralaks={paralaks} kanan={kanan}>
            <div className="relative aspect-[3/4] overflow-clip rounded-t-[999px] rounded-b-md border-[5px] border-[#f3f5f1] shadow-[0_0_0_1px_#b9975b,0_22px_36px_-20px_rgb(20_40_48/0.9)]">
              <div className={`${s.geserLambat} absolute inset-x-0 inset-y-[-10%]`}>
                <Image src={foto.src} alt={foto.alt} fill sizes="(min-width: 440px) 250px, 56vw" className="object-cover" />
              </div>
            </div>
          </Timbul>
        </div>
        {/* peony di kaki tiang, bergantian sisi */}
        <div className={`pointer-events-none absolute bottom-[-2%] w-[44%] ${kanan ? "-right-[6%]" : "-left-[6%]"}`}>
          <div className={kanan ? s.ayunB : s.ayunA} style={{ transformOrigin: "50% 100%" }}>
            <Gambar a={kanan ? "peonyMerah" : "peony"} flip={kanan} sizes="170px" />
          </div>
        </div>
      </div>

      {/* cerita */}
      <div className="relative -mt-[4%] px-8 text-center">
        <Muncul>
          <p className="text-[10px] tracking-[0.4em] text-[#b9975b] uppercase">
            Bab {i + 1} · {c.tahun}
          </p>
        </Muncul>
        <Muncul jeda={0.1} dari="scale(0.85)">
          <h3 className={`${cormorant} mt-1 text-[2.1rem] leading-tight italic`}>{c.judul}</h3>
        </Muncul>
        <Muncul jeda={0.2}>
          <p className="mx-auto mt-2 max-w-[19rem] text-[13.5px] leading-relaxed font-light">{c.isi}</p>
        </Muncul>
      </div>
    </article>
  );
}

// Gapura yang naik mendekat lalu dilewati (membesar & memudar). paralaks: mengikuti scroll; selain itu muncul sekali.
function Lewati({ paralaks, children }: { paralaks: boolean; children: ReactNode }) {
  if (paralaks) return <div className={`${s.kGapura} absolute inset-0`}>{children}</div>;
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0, transform: "translateY(50px) scale(0.86)" }}
      whileInView={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.4, ease: LEMBUT }}
    >
      {children}
    </motion.div>
  );
}

// Foto yang bangkit berdiri dalam 3D, berporos di kakinya
function Timbul({ paralaks, kanan, children }: { paralaks: boolean; kanan: boolean; children: ReactNode }) {
  if (paralaks) {
    return (
      <div className={kanan ? s.kTimbulB : s.kTimbulA} style={{ transformOrigin: "50% 100%" }}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      style={{ transformOrigin: "50% 100%" }}
      initial={{ opacity: 0, transform: `perspective(1000px) rotateX(70deg) rotateY(${kanan ? -12 : 12}deg)` }}
      whileInView={{ opacity: 1, transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.5, ease: LEMBUT, delay: 0.2, opacity: { duration: 0.6, delay: 0.2 } }}
    >
      {children}
    </motion.div>
  );
}

// Batu pijakan berkelok di antara dua gapura
function BatuPijakan() {
  return (
    <div className="relative mx-auto my-2 h-24 w-28" aria-hidden="true">
      {[
        [20, 6, 30],
        [58, 36, 34],
        [26, 66, 38],
      ].map(([x, y, w], i) => (
        <Muncul key={i} jeda={i * 0.15} dari="scale(0.4)" className="absolute" style={{ left: `${x}%`, top: `${y}%`, width: `${w}%` }}>
          <span className="block aspect-[2/1] rounded-[50%] bg-[#c9d4d0] shadow-[inset_0_-3px_0_#aab9b5]" />
        </Muncul>
      ))}
    </div>
  );
}
