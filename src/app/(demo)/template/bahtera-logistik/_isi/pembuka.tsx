"use client";

import { easeInOut, motion, type MotionValue, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import s from "./bahtera.module.css";
import { fotoPembuka, layanan, pt } from "./data";
import { useDiam } from "./diam";
import { MONO, STENSIL } from "./gaya";

// Pembuka: kita berdiri tepat di belakang kontainer. Panggungnya sticky setinggi 2,6 layar; saat digulir
// kedua daun pintu berayun terbuka (3D, rotateY dari engselnya), pelabuhan di baliknya mundur pelan
// (zoom out), lalu profil singkat perusahaan muncul. "Kurangi gerakan": pintu langsung terbuka.

export function Pembuka() {
  const ref = useRef<HTMLElement>(null);
  const diam = useDiam();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const kiri = useTransform(p, [0.04, 0.5], [0, -104], { ease: easeInOut });
  const kanan = useTransform(p, [0.04, 0.5], [0, 104], { ease: easeInOut });
  const zoom = useTransform(p, [0, 0.65], [1.35, 1]);
  const gelap = useTransform(p, [0.3, 0.6], [0.2, 0.62]);
  const judulPintu = useTransform(p, [0, 0.1], [1, 0]);

  return (
    <section ref={ref} id="atas" className={`relative bg-[#10213a] ${diam ? "" : "h-[260svh]"}`}>
      <div className="sticky top-0 h-svh overflow-hidden [perspective:1500px]">
        {/* pelabuhan di balik pintu */}
        <motion.div style={{ scale: diam ? 1 : zoom }} className="absolute inset-0">
          <Image src={fotoPembuka.src} alt={fotoPembuka.alt} fill priority sizes="100vw" className="object-cover" />
        </motion.div>
        <motion.div style={{ opacity: diam ? 0.62 : gelap }} className="absolute inset-0 bg-[#0b1628]" />

        <Profil p={p} diam={diam} />

        {/* dua daun pintu */}
        {!diam && (
          <div className="pointer-events-none absolute inset-0 flex [transform-style:preserve-3d]" aria-hidden="true">
            <Daun sisi="kiri" putar={kiri} />
            <Daun sisi="kanan" putar={kanan} />
          </div>
        )}

        {/* tulisan & petunjuk di atas pintu, hilang saat pintu mulai dibuka */}
        {!diam && (
          <motion.div style={{ opacity: judulPintu }} className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-[#eeeae1]">
            <p className={`${MONO} rounded bg-[#10213a]/85 px-3 py-1.5 text-[11px] tracking-[0.18em] uppercase md:text-xs`}>{pt.nama}</p>
            <h1 className={`${STENSIL} mt-5 text-[13vw] leading-[0.86] drop-shadow-[0_4px_0_rgb(80_20_10/0.6)] md:text-[8.5vw]`}>
              Dari Perak
              <br />
              ke seluruh
              <br />
              Nusantara
            </h1>
            <p className={`${MONO} mt-8 flex items-center gap-2 rounded bg-[#10213a]/85 px-3 py-1.5 text-[11px] tracking-[0.14em] uppercase md:text-xs`}>
              <span className={`${s.kedip} size-2 rounded-full bg-[#f2b33d]`} />
              Gulir untuk membuka pintu
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function Profil({ p, diam }: { p: MotionValue<number>; diam: boolean }) {
  const o = useTransform(p, [0.42, 0.62], [0, 1]);
  const y = useTransform(p, [0.42, 0.7], ["6svh", "0svh"]);
  return (
    <motion.div style={diam ? { opacity: 1, y: 0 } : { opacity: o, y }} className="absolute inset-0 flex items-end">
      <div className="mx-auto w-full max-w-6xl px-5 pb-[9svh] text-[#eeeae1] md:px-8 md:pb-[10svh]">
        <p className={`${MONO} text-[11px] tracking-[0.16em] text-[#f2b33d] uppercase md:text-xs`}>
          Sejak {pt.sejak} · Tanjung Perak, Surabaya
        </p>
        <h2 className={`${STENSIL} mt-4 max-w-[15ch] text-[11vw] leading-[0.9] md:text-[5.6vw]`}>Logistik laut & darat untuk usaha yang tidak bisa menunggu</h2>
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <ul className={`${MONO} flex flex-wrap gap-2 text-[11px] uppercase md:text-xs`}>
            {layanan.map((l) => (
              <li key={l.nama} className="rounded border border-[#eeeae1]/40 px-2.5 py-1.5">
                {l.nama}
              </li>
            ))}
          </ul>
          <div className="flex gap-3">
            <a href="#penawaran" className="rounded bg-[#f2b33d] px-5 py-3 text-sm font-bold text-[#10213a] transition-transform hover:-translate-y-0.5">
              Minta penawaran
            </a>
            <a href="#lacak" className="rounded border-2 border-[#eeeae1] px-5 py-2.5 text-sm font-bold transition-colors hover:bg-[#eeeae1] hover:text-[#10213a]">
              Lacak kiriman
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Satu daun pintu kontainer, berengsel di tepi luar
function Daun({ sisi, putar }: { sisi: "kiri" | "kanan"; putar: MotionValue<number> }) {
  const kiri = sisi === "kiri";
  return (
    <motion.div
      style={{ rotateY: putar }}
      className={`relative h-full w-1/2 [transform-style:preserve-3d] ${kiri ? "origin-left" : "origin-right"}`}
    >
      {/* sisi luar */}
      <div className={`${s.pintu} absolute inset-0 [backface-visibility:hidden]`}>
        {/* rel atas & bawah */}
        <span className="absolute inset-x-0 top-0 h-[3.5%] bg-[#5c1f14]" />
        <span className="absolute inset-x-0 bottom-0 h-[4%] bg-[#5c1f14]" />
        {/* batang pengunci */}
        {(kiri ? ["24%", "62%"] : ["34%", "72%"]).map((x, i) => (
          <div key={x} className="absolute top-[3.5%] bottom-[4%]" style={{ left: x }}>
            <span className={`${s.batang} absolute inset-y-0 left-0 w-[9px] rounded-full md:w-3`} />
            {["12%", "40%", "70%", "92%"].map((y) => (
              <span key={y} className="absolute -left-1.5 h-4 w-[21px] rounded-sm bg-[#4a1a11] md:w-6" style={{ top: y }} />
            ))}
            {/* gagang */}
            <span
              className={`${s.batang} absolute h-2 w-12 rounded-full md:h-2.5 md:w-16`}
              style={{ top: i ? "56%" : "53%", left: kiri ? 6 : -44 }}
            />
          </div>
        ))}
        {kiri ? (
          <div className={`${STENSIL} absolute top-[8%] left-[7%] text-[#eeeae1]/90`}>
            <p className="text-[6vw] leading-none tracking-[0.04em] md:text-[2.6vw]">
              {pt.kode.split(" ")[0]}
            </p>
            <p className="mt-1 flex items-center gap-2 text-[6vw] leading-none md:text-[2.6vw]">
              {pt.kode.split(" ")[1]}
              <span className="border-2 border-current px-1.5 leading-none">{pt.cek}</span>
            </p>
            <p className="mt-2 text-[4vw] leading-none md:text-[1.4vw]">22G1</p>
          </div>
        ) : (
          <div className={`${MONO} absolute top-[8%] right-[7%] text-right text-[2.6vw] leading-snug font-bold text-[#eeeae1]/85 uppercase md:text-[0.85vw]`}>
            <p>Max gross 30.480 kg</p>
            <p>Tare 2.220 kg</p>
            <p>Net 28.260 kg</p>
            <p>Cu. cap 33,2 m³</p>
            <div className="mt-3 ml-auto w-[16vw] rounded-sm border border-black/30 bg-[#c7ccd1] p-1.5 text-[1.9vw] leading-tight font-bold text-[#2a2f35] md:w-[7vw] md:text-[0.55vw]">
              CSC safety approval
              <br />
              IDN-BKI 2609/17
            </div>
          </div>
        )}
      </div>
      {/* sisi dalam */}
      <div className={`${s.pintuDalam} absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]`} />
    </motion.div>
  );
}
