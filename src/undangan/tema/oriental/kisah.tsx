"use client";

import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { type CSSProperties, useRef } from "react";
import type { Undangan } from "../../types";
import { Muncul, Pembatas, naskah, yuji } from "./hias";
import s from "./oriental.module.css";

// Kisah cinta berupa gulungan lukisan gantung (lizhou). Tiap bab tergantung di paku dengan tali merah; saat digulir ke
// layar, gulungannya terbuka ke bawah: rol atas diam, rol bawah turun dan memperlihatkan foto, cerita, dan stempel merah
// inisial mempelai. Digerakkan scroll (motion useScroll). "Kurangi gerakan": gulungan langsung terbuka.

export function Kisah({ u }: { u: Undangan }) {
  const foto = (i: number) => u.foto.galeri[(i * 2 + 1) % u.foto.galeri.length];
  const inisial = [u.wanita.panggilan[0], u.pria.panggilan[0]] as const;
  return (
    <div className="relative">
      <div className="relative z-10 px-6 text-center">
        <Muncul>
          <p className={`${yuji} text-[10.5px] tracking-[0.42em] text-[#9e1c22]/80 uppercase`}>Gulungan cerita kami</p>
        </Muncul>
        <Muncul jeda={0.1} dari="scale(0.82)">
          <h2 className={`${naskah} text-[3.7rem] leading-tight text-[#9e1c22]`}>Love Story</h2>
        </Muncul>
        <Muncul jeda={0.25}>
          <Pembatas />
        </Muncul>
      </div>
      <div className="relative mt-10 space-y-6">
        {u.cerita.map((c, i) => (
          <Gulungan key={c.tahun} c={c} i={i} foto={foto(i)} inisial={inisial} />
        ))}
      </div>
    </div>
  );
}

function Gulungan({ c, i, foto, inisial }: { c: Undangan["cerita"][number]; i: number; foto: Undangan["foto"]["galeri"][number]; inisial: readonly [string, string] }) {
  const ref = useRef<HTMLDivElement>(null);
  const terbuka = !!useReducedMotion();
  // mulai terbuka saat puncak gulungan masuk dari bawah, terbuka penuh saat puncaknya di sekitar 30% layar
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start 88%", "start 30%"] });
  const sisa = useTransform(p, [0, 1], [100, 0]); // persen yang masih tergulung
  const wadah = useMotionTemplate`translateY(${useTransform(sisa, (v) => -v)}%)`;
  const isi = useMotionTemplate`translateY(${sisa}%)`;
  const kiri = i % 2 === 0;
  return (
    <div ref={ref} className={`relative w-[78%] ${kiri ? "mr-auto ml-[7%]" : "mr-[7%] ml-auto"}`}>
      {/* paku & tali gantung */}
      <svg viewBox="0 0 100 18" className="mx-auto block w-[46%] overflow-visible" aria-hidden="true">
        <path d="M14 18 50 3 86 18" fill="none" stroke="#9e1c22" strokeWidth="1.2" />
        <circle cx="50" cy="3" r="2.6" fill="#c99a3e" />
      </svg>
      <div className={s.lentera} style={{ "--d": `${6 + i}s`, "--a": `${kiri ? 0.8 : -0.8}deg` } as CSSProperties}>
        {/* rol atas */}
        <Rol />
        <motion.div className="relative overflow-hidden" style={terbuka ? undefined : { transform: wadah }}>
          <motion.div style={terbuka ? undefined : { transform: isi }}>
            <div className="mx-[3%] bg-[#2f6b63] px-[5%] pt-[5%] pb-[7%] shadow-[0_18px_30px_-18px_rgb(30_10_5/0.6)]">
              <div className="bg-[#f8efdc] px-[6%] pt-[6%] pb-[7%] text-center ring-1 ring-[#c99a3e]">
                <div className="relative aspect-[4/3.6] overflow-hidden ring-1 ring-[#c99a3e]/60">
                  <Image src={foto.src} alt={foto.alt} fill sizes="(min-width: 440px) 300px, 70vw" className="object-cover" />
                </div>
                <p className={`${yuji} mt-4 text-[10px] tracking-[0.35em] text-[#9e1c22]/80 uppercase`}>
                  Bab {i + 1} · {c.tahun}
                </p>
                <h3 className={`${naskah} mt-1 text-[2.7rem] leading-none text-[#9e1c22]`}>{c.judul}</h3>
                <p className="mx-auto mt-2 max-w-[17rem] text-[14.5px] leading-relaxed text-[#3b1d16]/90">{c.isi}</p>
                {/* stempel merah inisial */}
                <div className="mt-4 flex justify-end pr-1">
                  <span
                    className={`${yuji} grid size-10 rotate-[-4deg] place-items-center rounded-[4px] bg-[#b3242b] text-[13px] leading-none text-[#fff1d6] shadow-[inset_0_0_0_2px_#b3242b,inset_0_0_0_3.5px_#fff1d6]`}
                  >
                    {inisial[0]}
                    {inisial[1]}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          {/* rol bawah: ikut tepi gulungan yang sedang terbuka */}
          <div className="relative -mt-[2px]">
            <Rol />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Rol kayu gelap berujung tutup emas
function Rol() {
  return (
    <div className="relative mx-auto h-3.5 w-full rounded-full bg-[linear-gradient(180deg,#6b3a23,#3b1d16_55%,#24110b)] shadow-[0_4px_8px_-3px_rgb(0_0_0/0.5)]">
      <span className="absolute inset-y-[-2px] left-0 w-[5%] rounded-l-full bg-[linear-gradient(180deg,#f6dc94,#9b7224)]" />
      <span className="absolute inset-y-[-2px] right-0 w-[5%] rounded-r-full bg-[linear-gradient(180deg,#f6dc94,#9b7224)]" />
    </div>
  );
}
