"use client";

import { AnimatePresence, motion, type MotionValue, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { type CSSProperties, useRef, useState } from "react";
import s from "./bahtera.module.css";
import { layanan } from "./data";
import { useDiam } from "./diam";
import { MONO, STENSIL } from "./gaya";

// Layanan sebagai tumpukan kontainer. Panggung sticky; tiap kontainer diturunkan derek (tali dari atas) satu per
// satu mengikuti scroll sampai menumpuk, dan rincian layanan di sampingnya berganti ke kontainer terakhir yang mendarat.

const N = layanan.length;
const segmen = (i: number) => [(i / N) * 0.82, ((i + 0.7) / N) * 0.82] as const;

export function Layanan() {
  const ref = useRef<HTMLElement>(null);
  const diam = useDiam();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [aktif, setAktif] = useState(0);
  useMotionValueEvent(p, "change", (v) => {
    let k = 0;
    for (let i = 0; i < N; i++) if (v >= segmen(i)[1] - 0.04) k = i;
    setAktif(k);
  });
  const l = layanan[diam ? N - 1 : aktif];

  return (
    <section ref={ref} id="layanan" className={`relative bg-[#eeeae1] text-[#10213a] ${diam ? "py-20" : "h-[420svh]"}`}>
      <div className={`${diam ? "" : "sticky top-0 h-svh"} flex flex-col justify-start overflow-hidden pt-[4.5rem] md:justify-center md:pt-0`}>
        <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
          <p className={`${MONO} text-[11px] tracking-[0.16em] text-[#b8432f] uppercase md:text-xs`}>● Layanan</p>
          <h2 className={`${STENSIL} mt-3 text-[11vw] leading-[0.88] md:text-[4.6vw]`}>Empat layanan, satu pintu</h2>

          <div className="mt-6 grid items-end gap-6 md:mt-10 md:grid-cols-[1.05fr_1fr] md:gap-14">
            {/* tumpukan */}
            <div className="relative mx-auto flex w-full max-w-[560px] flex-col-reverse">
              {/* flex-col-reverse: anak pertama tampil paling bawah (dasar tumpukan) */}
              <span className={`${s.bahaya} mt-1 h-2.5 w-full`} />
              {layanan.map((x, i) => (
                <Kontainer key={x.kode} x={x} i={i} p={p} diam={diam} />
              ))}
            </div>

            {/* rincian layanan aktif */}
            <div className="min-h-[19rem] md:min-h-[26rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={l.kode} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
                  <p className={`${MONO} text-[11px] uppercase md:text-xs`}>
                    <span className="mr-2 inline-block size-2.5 rounded-sm align-middle" style={{ backgroundColor: l.warna }} />
                    {String((diam ? N - 1 : aktif) + 1).padStart(2, "0")}/{String(N).padStart(2, "0")} · {l.sub}
                  </p>
                  <h3 className={`${STENSIL} mt-2 text-[2.4rem] leading-[0.92] md:text-[3.4rem]`}>{l.nama}</h3>
                  <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-[#10213a]/75 md:text-base">{l.isi}</p>
                  <ul className={`${MONO} mt-4 space-y-1.5 text-xs md:text-[13px]`}>
                    {l.poin.map((t) => (
                      <li key={t} className="flex gap-2">
                        <span style={{ color: l.warna }}>■</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="relative mt-5 hidden aspect-[16/7] overflow-hidden rounded md:block">
                    <Image src={l.f.src} alt={l.f.alt} fill sizes="40vw" className="object-cover" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Kontainer({ x, i, p, diam }: { x: (typeof layanan)[number]; i: number; p: MotionValue<number>; diam: boolean }) {
  const [a, b] = segmen(i);
  const y = useTransform(p, [a, b], ["-110svh", "0svh"]);
  const tali = useTransform(p, [b, b + 0.03], [1, 0]);
  const goyang = useTransform(p, [a, (a + b) / 2, b], [-2.5, 1.5, 0]);
  return (
    <motion.div style={diam ? { y: 0, rotate: 0 } : { y, rotate: goyang }} className="relative">
      {/* tali derek */}
      {!diam && (
        <motion.div style={{ opacity: tali }} className="absolute bottom-full left-1/2 h-[110svh] w-[90px] -translate-x-1/2" aria-hidden="true">
          <span className="absolute bottom-3 left-[18%] h-[60px] w-0.5 origin-bottom rotate-[32deg] bg-[#10213a]/70" />
          <span className="absolute bottom-3 right-[18%] h-[60px] w-0.5 origin-bottom -rotate-[32deg] bg-[#10213a]/70" />
          <span className="absolute inset-x-[calc(50%-1px)] top-0 bottom-[60px] w-0.5 bg-[#10213a]/70" />
          <span className="absolute bottom-[56px] left-1/2 size-3 -translate-x-1/2 rounded-full border-2 border-[#10213a] bg-[#f2b33d]" />
        </motion.div>
      )}
      <div
        className={`${s.seng} relative mb-[3px] flex aspect-[5/1] items-center justify-between rounded-[3px] border-y-[5px] border-black/25 px-[5%] text-[#eeeae1]`}
        style={{ "--w": x.warna } as CSSProperties}
      >
        {/* sudut (corner casting) */}
        {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "right-0 bottom-0"].map((c) => (
          <span key={c} className={`absolute ${c} size-[7%] max-h-4 max-w-4 bg-black/35`} />
        ))}
        <div className="min-w-0">
          <p className={`${STENSIL} truncate text-[5.2vw] leading-none md:text-[1.9rem]`}>{x.nama}</p>
          <p className={`${MONO} mt-1 text-[2.4vw] opacity-80 md:text-[11px]`}>{x.kode} {i + 1}</p>
        </div>
        {/* pintu di ujung kanan */}
        <div className="flex h-[70%] shrink-0 gap-[3px] opacity-60" aria-hidden="true">
          <span className="w-1 bg-black/40" />
          <span className="w-1 bg-black/40" />
        </div>
      </div>
    </motion.div>
  );
}
