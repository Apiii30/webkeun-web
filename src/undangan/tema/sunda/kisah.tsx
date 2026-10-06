"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { Undangan } from "../../types";
import { Bagian, Batang, Judul, Muncul, rozha } from "./dasar";
import { Burung, Gulir, MegaMendung, Tumpal } from "./ornamen";
import s from "./sunda.module.css";

// Kisah cinta "Kain nu dibeberkeun": tiap bab adalah selembar kain krem yang tergantung di batang kayu. Saat digulir:
//  - kainnya terbentang turun dari batang (berporos di tepi atas, terlipat ke belakang lalu menggantung tegak);
//  - foto di dalamnya bergeser pelan, angka tahun bergaris emas di belakang bergerak paling lambat (terasa jauh);
//  - seekor kuntul terbang melintasi bab mengikuti scroll;
//  - garis emas di tengah tumbuh menyambung bab demi bab.
// Semuanya CSS scroll-driven animation (transform & opacity); browser yang tidak menjalankannya dengan mulus mendapat
// versi berbasis waktu (komponen Gulir).

type Cerita = Undangan["cerita"][number];
type Foto = Undangan["foto"]["galeri"][number];

export function Kisah({ u }: { u: Undangan }) {
  const foto = (i: number) => u.foto.galeri[(i * 2 + 1) % u.foto.galeri.length];
  return (
    <Bagian
      id="cerita"
      nila
      className="px-6 pt-8 pb-28"
      luar={
        <>
          <MegaMendung warna="emas" className={`${s.kJauh} absolute top-10 -left-10 w-36 opacity-20`} />
          <MegaMendung warna="emas" className={`${s.kDekat} absolute top-[38%] -right-12 w-40 opacity-15`} />
        </>
      }
    >
      <Judul kecil="Perjalanan kami" terang>
        Kisah Cinta
      </Judul>
      <ol className="relative mt-10 space-y-14">
        <span className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-[#d9bd85]/20" aria-hidden="true" />
        <span className={`${s.tumbuhGaris} absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 origin-top bg-[#d9bd85]`} aria-hidden="true" />
        {u.cerita.map((c, i) => (
          <Bab key={c.tahun} c={c} i={i} n={u.cerita.length} foto={foto(i)} />
        ))}
      </ol>
    </Bagian>
  );
}

function Bab({ c, i, n, foto }: { c: Cerita; i: number; n: number; foto: Foto }) {
  const kanan = i % 2 === 1;
  return (
    <li className="relative" aria-label={`Bab ${i + 1} dari ${n}`}>
      {/* angka tahun besar bergaris di belakang kain: paling jauh, paling lambat */}
      <p
        className={`${s.kJauh} ${rozha} pointer-events-none absolute -top-4 ${kanan ? "-left-3" : "-right-3"} text-[5rem] leading-none text-transparent opacity-30 [-webkit-text-stroke:1.2px_#d9bd85]`}
        aria-hidden="true"
      >
        {c.tahun}
      </p>

      {/* simpul hati di garis emas */}
      <motion.span
        initial={{ opacity: 0, transform: "scale(0) rotate(-90deg)" }}
        whileInView={{ opacity: 1, transform: "scale(1) rotate(0deg)" }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative mx-auto grid size-7 place-items-center rounded-full bg-[#d9bd85] text-[#2f4560] shadow-[0_0_0_5px_#2f4560]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className={`${s.detak} size-4`} fill="currentColor" style={{ animationDelay: `${-i * 0.4}s` }}>
          <path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11Z" />
        </svg>
      </motion.span>

      {/* kain yang terbentang dari batang kayu */}
      <div className="relative mx-auto mt-5 w-[88%]">
        <Batang className="absolute inset-x-[-6%] -top-1.5 z-10" />
        <Gulir k={s.kKain} dari="perspective(1000px) rotateX(-88deg)" ke="perspective(1000px) rotateX(0deg)">
          <article className={`${s.kertas} relative rounded-b-md px-4 pt-5 pb-9 text-center text-[#3a3330] shadow-[0_28px_40px_-24px_rgb(0_0_0/0.8)]`}>
            <div className="relative aspect-square overflow-clip rounded-t-full rounded-b-sm border-[1.5px] border-[#8a4b35] p-[4px]">
              <div className="relative h-full w-full overflow-clip rounded-t-full rounded-b-[2px]">
                <div className={`${s.geserLambat} absolute inset-x-0 inset-y-[-9%]`}>
                  <Image src={foto.src} alt={foto.alt} fill sizes="(min-width: 440px) 300px, 80vw" className="object-cover" />
                </div>
              </div>
            </div>
            <Muncul>
              <p className="mt-5 text-[10px] tracking-[0.4em] text-[#8a4b35] uppercase">
                Bab {i + 1} · {c.tahun}
              </p>
            </Muncul>
            <Muncul delay={0.1}>
              <h3 className={`${rozha} mt-1 text-[1.6rem] leading-tight text-[#2f4560]`}>{c.judul}</h3>
            </Muncul>
            <Muncul delay={0.2}>
              <p className="mx-auto mt-2 max-w-[17rem] text-[14px] leading-relaxed text-[#3a3330]/85">{c.isi}</p>
            </Muncul>
            <Tumpal className="absolute inset-x-0 bottom-1.5 opacity-40" />
          </article>
        </Gulir>
      </div>

      {/* kuntul yang terbang melintasi bab mengikuti scroll */}
      <div className={`${s.kTerbang} pointer-events-none absolute top-[46%] ${kanan ? "right-0 -scale-x-100" : "left-0"}`} aria-hidden="true">
        <Burung w={34} jeda={-i * 0.2} />
      </div>
    </li>
  );
}
