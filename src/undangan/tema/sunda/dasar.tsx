"use client";

import { motion, type Variants } from "motion/react";
import { Fragment, type ReactNode } from "react";
import { AwanBatas, Pemisah } from "./ornamen";
import s from "./sunda.module.css";

// Bahan bersama bagian-bagian isi undangan Art Sunda: rangka bagian (dengan peralihan antarbagiannya), judul, dan
// efek teks yang muncul. Efek "muncul" memakai motion dengan `transform` utuh + opacity yang diserahkan ke mesin
// animasi browser (WAAPI), jadi tidak tertinggal dari scroll.

export const ease = [0.22, 1, 0.36, 1] as const;
export const rozha = "font-[family-name:var(--font-rozha)]";
export const script = "font-[family-name:var(--font-alex)]";
export const bata = "text-[#8a4b35]";

// Satu bagian undangan berlatar padat. Bagian berikutnya naik menutupinya sementara isinya mundur (turun lebih
// lambat dari scroll, kelas mundur) dan meredup tertutup selapis warna latarnya (kelas redup). Redupnya sengaja
// lapisan warna polos, bukan opacity isi: opacity pada isi sebesar ini (penuh elemen beranimasi) memaksa browser
// menggambar ulang seluruh isinya tiap frame, membuat scroll patah-patah & berkedip di Safari.
// batas: gugusan awan mega mendung berwarna latar bagian ini di tepi atasnya, menjorok ke bagian sebelumnya.
export function Bagian({
  id,
  nila = false,
  batas = true,
  mundur = true,
  className = "",
  luar,
  children,
}: {
  id?: string;
  nila?: boolean;
  batas?: boolean;
  mundur?: boolean;
  className?: string;
  luar?: ReactNode; // hiasan yang tidak ikut mundur
  children: ReactNode;
}) {
  return (
    <section id={id} className={`relative ${nila ? `${s.nilaPolos} text-[#f4eee2]` : s.kertasPolos}`}>
      {batas && <AwanBatas warna={nila ? "nila" : "krem"} />}
      {luar}
      <div className={`relative ${mundur ? s.mundur : ""} ${className}`}>{children}</div>
      {mundur && <div className={`${s.redup} pointer-events-none absolute inset-0 ${nila ? "bg-[#2f4560]" : "bg-[#f4eee2]"}`} aria-hidden="true" />}
    </section>
  );
}

export const gaya = {
  naik: { hidden: { opacity: 0, transform: "translateY(40px)" }, show: { opacity: 1, transform: "translateY(0px)" } },
  lembut: { hidden: { opacity: 0, transform: "translateY(16px) scale(0.97)" }, show: { opacity: 1, transform: "translateY(0px) scale(1)" } },
  zoom: { hidden: { opacity: 0, transform: "scale(0.8)" }, show: { opacity: 1, transform: "scale(1)" } },
} satisfies Record<string, Variants>;

export function Muncul({ as = "naik", delay = 0, className, children }: { as?: keyof typeof gaya; delay?: number; className?: string; children: ReactNode }) {
  return (
    <motion.div className={className} variants={gaya[as]} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1, ease, delay }}>
      {children}
    </motion.div>
  );
}

// Teks yang hurufnya naik satu per satu. Pemicunya diwarisi dari elemen motion di atasnya.
export function Huruf({ teks, jeda = 0, cepat = 0.04 }: { teks: string; jeda?: number; cepat?: number }) {
  const kata = teks.split(" ");
  let n = 0;
  return (
    <motion.span variants={{ hidden: {}, show: { transition: { staggerChildren: cepat, delayChildren: jeda } } }} aria-label={teks} role="text">
      {kata.map((k, ki) => (
        // spasi antarkata di luar kotak inline-block: spasi di ujung kotak itu dibuang browser
        <Fragment key={ki}>
          <span className="inline-block whitespace-nowrap" aria-hidden="true">
            {[...k].map((h) => (
              <motion.span
                key={n++}
                className="inline-block"
                variants={{ hidden: { opacity: 0, transform: "translateY(0.6em) rotate(8deg)" }, show: { opacity: 1, transform: "translateY(0em) rotate(0deg)", transition: { duration: 0.7, ease } } }}
              >
                {h}
              </motion.span>
            ))}
          </span>
          {ki < kata.length - 1 && " "}
        </Fragment>
      ))}
    </motion.span>
  );
}

// Tulisan sambung muncul dari kiri ke kanan seperti sedang ditulis
export const tulis = (duration = 1.4): Variants => ({ hidden: { clipPath: "inset(0% 100% 0% 0%)" }, show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration, ease: "easeInOut" } } });

// Judul bagian: tulisan sambung kecil, judul besar huruf demi huruf, lalu pembatas kujang yang melebar.
export function Judul({ kecil, children, terang = false }: { kecil?: string; children: string; terang?: boolean }) {
  return (
    <motion.div className="text-center" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.7 }}>
      {kecil && (
        <motion.p variants={tulis(1.3)} className={`${script} inline-block px-3 text-[1.9rem] leading-tight ${terang ? "text-[#d9bd85]" : bata}`}>
          {kecil}
        </motion.p>
      )}
      <h2 className={`${rozha} text-[2.1rem] leading-tight ${terang ? "text-[#f4eee2]" : "text-[#2f4560]"}`}>
        <Huruf teks={children} jeda={kecil ? 0.5 : 0} />
      </h2>
      <motion.div variants={{ hidden: { opacity: 0, transform: "scaleX(0.2)" }, show: { opacity: 1, transform: "scaleX(1)", transition: { duration: 1, ease, delay: 0.8 } } }}>
        <Pemisah terang={terang} className="mt-2" />
      </motion.div>
    </motion.div>
  );
}

// Batang kayu bertutup emas untuk gulungan naskah & kain yang dibentangkan
export function Batang({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none h-3.5 ${className}`} aria-hidden="true">
      <div className="absolute inset-x-2 inset-y-0 rounded-full bg-[linear-gradient(#a8703f,#e0a96c_35%,#8a5a36_70%,#5b3a22)] shadow-[0_6px_10px_-4px_rgb(0_0_0/0.55)]" />
      {[true, false].map((kiri) => (
        <span
          key={String(kiri)}
          className={`absolute top-1/2 h-5 w-3.5 -translate-y-1/2 rounded-[40%] bg-[radial-gradient(circle_at_35%_35%,#fbeec5,#c9a45c_55%,#7a5a2c)] ${kiri ? "left-0" : "right-0"}`}
        />
      ))}
    </div>
  );
}
