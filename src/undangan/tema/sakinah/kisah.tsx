"use client";

import { motion, useInView, useReducedMotion, useScroll } from "motion/react";
import { useRef } from "react";
import type { Undangan } from "../../types";
import { FotoLengkung, Muncul, Pembatas, marcellus, naskah } from "./hias";

// Perjalanan kami: tiap bab adalah jendela mihrab berpintu kisi emas. Saat jendela sudah cukup terlihat, kedua daun
// pintunya berayun membuka (3D) dan foto di baliknya mundur pelan ke ukuran asli; ceritanya naik di bawahnya.
// Pintu dibuka dengan animasi berbasis waktu, bukan mengikuti scroll: versi yang digerakkan scroll (pintu, foto &
// lentera dihitung ulang tiap kali layar bergulir) bergetar di HP. Jendela-jendela disambung rantai emas yang terisi
// mengikuti scroll. "Kurangi gerakan": tanpa pintu.

export function Kisah({ u }: { u: Undangan }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 60%"] });
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
        {u.cerita.map((c, i) => (
          <Bab key={c.tahun} c={c} i={i} foto={foto(i)} />
        ))}
      </div>
    </div>
  );
}

function Bab({ c, i, foto }: { c: Undangan["cerita"][number]; i: number; foto: Undangan["foto"]["galeri"][number] }) {
  const jendela = useRef<HTMLDivElement>(null);
  const kurangi = !!useReducedMotion();
  // pintu baru dibuka setelah jendela cukup terlihat (sebagian besar sudah masuk layar)
  const terlihat = useInView(jendela, { once: true, amount: 0.6 });

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
        <FotoLengkung src={foto.src} alt={foto.alt} sizes="(min-width: 440px) 280px, 64vw" posisi="50% 40%" pintu={kurangi ? undefined : terlihat ? 0.3 : false} />
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
