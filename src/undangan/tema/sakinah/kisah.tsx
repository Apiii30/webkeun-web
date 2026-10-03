"use client";

import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import type { Undangan } from "../../types";
import { maskerLengkung } from "./aset";
import { DaunPintu, Lentera, Muncul, Pembatas, TepiLengkung, marcellus, naskah } from "./hias";

// Perjalanan kami: tiap bab adalah jendela mihrab berpintu kisi emas. Saat jendela digulir ke tengah layar, kedua daun
// pintunya berayun membuka (3D) dan foto di baliknya mundur pelan ke ukuran asli; ceritanya naik di bawahnya.
// Jendela-jendela disambung rantai emas yang terisi mengikuti scroll, dengan lentera kecil yang ikut turun.
// Digerakkan scroll (motion useScroll, dijalankan ScrollTimeline browser bila ada). "Kurangi gerakan": pintu
// langsung terbuka.

export function Kisah({ u }: { u: Undangan }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 60%"] });
  const lentera = useMotionTemplate`translateY(${useTransform(scrollYProgress, (v) => v * 100)}%)`;
  const foto = (i: number) => u.foto.galeri[(i * 2 + 1) % u.foto.galeri.length];
  return (
    <div className="relative">
      <div className="relative z-10 px-6 text-center">
        <Muncul>
          <p className={`${marcellus} text-[10px] tracking-[0.45em] text-[#8f6d34] uppercase`}>Ditakdirkan bertemu</p>
        </Muncul>
        <Muncul jeda={0.1} dari="scale(0.82)">
          <h2 className={`${naskah} text-[3.6rem] leading-tight text-[#0f3a31]`}>Perjalanan Kami</h2>
        </Muncul>
        <Muncul jeda={0.25}>
          <Pembatas />
        </Muncul>
      </div>
      <div ref={ref} className="relative mt-12 space-y-16 overflow-clip pb-4">
        {/* rantai emas yang menyambung jendela-jendela, terisi mengikuti scroll */}
        <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 border-l border-dashed border-[#b8955a]/50" aria-hidden="true" />
        <motion.div
          className="pointer-events-none absolute top-0 bottom-0 left-1/2 w-[2px] origin-top -translate-x-1/2 bg-gradient-to-b from-[#e9d29c] via-[#b8955a] to-[#0f3a31]"
          style={{ scaleY: scrollYProgress }}
          aria-hidden="true"
        />
        <motion.div className="pointer-events-none absolute inset-x-0 top-0 bottom-0" style={{ transform: lentera }} aria-hidden="true">
          <Lentera className="left-1/2 w-[7%] -translate-x-1/2 -translate-y-full" rantai="0px" d={3.6} a={4} />
        </motion.div>
        {u.cerita.map((c, i) => (
          <Bab key={c.tahun} c={c} i={i} foto={foto(i)} />
        ))}
      </div>
    </div>
  );
}

function Bab({ c, i, foto }: { c: Undangan["cerita"][number]; i: number; foto: Undangan["foto"]["galeri"][number] }) {
  const jendela = useRef<HTMLDivElement>(null);
  const terbuka = !!useReducedMotion();
  // dihitung dari posisi jendela: mulai saat jendela masuk dari bawah, selesai saat jendela sedikit di atas tengah layar
  const { scrollYProgress: p } = useScroll({ target: jendela, offset: ["start 85%", "center 45%"] });
  const sudut = useTransform(p, [0.25, 0.9], [0, 108]);
  const kiri = useMotionTemplate`rotateY(${useTransform(sudut, (v) => -v)}deg)`;
  const kanan = useMotionTemplate`rotateY(${sudut}deg)`;
  const bayang = useTransform(sudut, [0, 108], [0, 0.45]);
  const zoom = useMotionTemplate`scale(${useTransform(p, [0.25, 1], [1.28, 1])})`;
  const cahaya = useTransform(p, [0.3, 0.6, 0.95], [0, 0.85, 0]);

  return (
    <div className="relative px-8">
      <motion.div
        ref={jendela}
        className="relative mx-auto w-[64%]"
        initial={{ opacity: 0, transform: "translateY(60px) scale(0.92)" }}
        whileInView={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative aspect-[300/420]">
          <div className="absolute inset-0 overflow-hidden bg-[#fdfcf8]" style={{ ...maskerLengkung, perspective: "800px" }}>
            <motion.div className="absolute inset-0" style={terbuka ? undefined : { transform: zoom }}>
              <Image src={foto.src} alt={foto.alt} fill sizes="(min-width: 440px) 280px, 64vw" className="object-cover" />
            </motion.div>
            {/* cahaya hangat dari balik pintu saat mulai terbuka */}
            {!terbuka && <motion.div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_55%,#fffdf5,rgb(255_236_190/0.6)_50%,transparent)]" style={{ opacity: cahaya }} />}
            {!terbuka &&
              [false, true].map((kn) => (
                <motion.div key={String(kn)} className={`absolute inset-y-0 w-1/2 ${kn ? "right-0" : "left-0"}`} style={{ transformOrigin: kn ? "100% 50%" : "0% 50%", transform: kn ? kanan : kiri }}>
                  <DaunPintu kanan={kn} />
                  <motion.div className="absolute inset-0 bg-[#3b3424]" style={{ opacity: bayang }} />
                </motion.div>
              ))}
          </div>
          <TepiLengkung className="top-[-5.71%] left-[-8%] h-[111.43%] w-[116%]" />
        </div>
      </motion.div>

      <Muncul className="relative mt-9 text-center" amount={0.4}>
        <p className={`${marcellus} text-[10px] tracking-[0.35em] text-[#8f6d34] uppercase`}>
          Bab {i + 1} · {c.tahun}
        </p>
        <h3 className={`${naskah} mt-1 text-[2.8rem] leading-none text-[#0f3a31]`}>{c.judul}</h3>
        <p className="mx-auto mt-3 max-w-[18rem] rounded-2xl bg-[#fdfcf8]/85 px-4 py-3 text-[15.5px] leading-relaxed text-[#1d3d34]/90 ring-1 ring-[#b8955a]/30">{c.isi}</p>
      </Muncul>
    </div>
  );
}
