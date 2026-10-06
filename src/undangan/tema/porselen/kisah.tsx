"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Fragment, type ReactNode } from "react";
import { useParalaks } from "../../pakai";
import type { Undangan } from "../../types";
import { Bunga, Burung, Danau, Gambar, HALUS, Muncul, Pembatas, Perahu, gilda, naskah } from "./hias";
import s from "./porselen.module.css";

// Kisah cinta "Pelayaran": perjalanan berperahu dari bab ke bab.
//  - Tiap bab adalah kartu porselen yang bangkit berdiri dari danau dalam 3D (berporos di kakinya) saat digulir
//    masuk, tegak saat dibaca, lalu rebah lagi ke belakang saat lewat. Bab ganjil & genap miring ke arah berlawanan.
//  - Di antara bab ada selat: perahu layar menyeberanginya mengikuti scroll, bergantian ke kanan & ke kiri.
//  - Kedalaman: angka tahun bergaris di belakang kartu bergerak paling lambat, bunga di sampingnya paling cepat,
//    foto di dalam kartu bergeser pelan.
//  - Penutup: dua perahu dari kiri & kanan berlayar mendekat dan bertemu di tengah danau.
// Gerak yang mengikuti scroll murni CSS (scroll-driven animation, kelas k* di CSS), hanya transform & opacity, tanpa
// sticky & tanpa hitungan JavaScript per frame, jadi dijalankan GPU dan tidak bergetar. Browser yang tidak bisa
// menjalankannya dengan mulus (lihat useParalaks) mendapat versi berbasis waktu: kartu berdiri & perahu berlayar
// sekali saat terlihat.

type Cerita = Undangan["cerita"][number];
type Foto = Undangan["foto"]["galeri"][number];

export function Kisah({ u }: { u: Undangan }) {
  const paralaks = useParalaks();
  const n = u.cerita.length;
  const foto = (i: number) => u.foto.galeri[(i * 2 + 1) % u.foto.galeri.length];
  return (
    <section id="cerita" className={`${s.sek} ${s.kertas} relative overflow-clip pt-14`}>
      <svg viewBox="0 0 440 28" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-7 w-full -translate-y-[98%]" aria-hidden="true">
        <path d="M0 28V16C40 4 80 4 120 14s80 12 120 2 80-14 120-4 60 8 80 4V28Z" fill="#f6f3ec" />
      </svg>

      {/* pegunungan jauh di belakang judul */}
      <div className="pointer-events-none absolute inset-x-[-10%] top-[1%] opacity-30 [mask-image:linear-gradient(to_bottom,black_40%,transparent)]" aria-hidden="true">
        <div className={s.kJauh}>
          <Gambar a="gunung" sizes="(min-width: 440px) 480px, 120vw" />
        </div>
      </div>

      <div className="relative z-10 px-6 text-center">
        <Muncul>
          <p className="text-[10px] tracking-[0.45em] text-[#b8934f] uppercase">Perjalanan kami</p>
        </Muncul>
        <Muncul jeda={0.1} dari="scale(0.82)">
          <h2 className={`${naskah} text-[3rem] leading-tight text-[#1f3768]`}>Kisah Cinta</h2>
        </Muncul>
        <Muncul jeda={0.25}>
          <Pembatas />
        </Muncul>
      </div>

      <Selat ke={0} paralaks={paralaks} burung />
      {u.cerita.map((c, i) => (
        <Fragment key={c.tahun}>
          <Bab c={c} i={i} n={n} foto={foto(i)} paralaks={paralaks} />
          <Selat ke={i + 1} paralaks={paralaks} />
        </Fragment>
      ))}
      <Bertemu u={u} paralaks={paralaks} />
    </section>
  );
}

/* ───────── Satu bab: kartu porselen yang bangkit dari danau ───────── */

function Bab({ c, i, n, foto, paralaks }: { c: Cerita; i: number; n: number; foto: Foto; paralaks: boolean }) {
  const kanan = i % 2 === 1;
  return (
    <article className="relative px-[8%] pt-2 [perspective:1100px]" aria-label={`Bab ${i + 1} dari ${n}`}>
      {/* angka tahun besar bergaris: paling jauh, bergerak paling lambat */}
      <div className={`pointer-events-none absolute -top-10 ${kanan ? "left-[3%]" : "right-[3%]"}`} aria-hidden="true">
        <p className={`${s.kJauh} ${gilda} text-[5.4rem] leading-none text-transparent opacity-30 [-webkit-text-stroke:1.2px_#27427a]`}>{c.tahun}</p>
      </div>
      {/* bunga di samping kartu: paling dekat, bergerak paling cepat (di belakang kartu, tidak menutupi foto) */}
      <Bunga
        a={kanan ? "hortensia" : "peony"}
        className={`${s.kDekat} bottom-[12%] w-[40%] ${kanan ? "-left-[10%]" : "-right-[12%]"}`}
        sizes="160px"
        flip={!kanan}
        varian={kanan ? "B" : "A"}
      />

      <Timbul paralaks={paralaks} kanan={kanan}>
        <div className="relative rounded-[1.75rem] bg-[#fbfaf6] p-3 pb-7 shadow-[0_34px_40px_-26px_rgb(20_35_70/0.75)] ring-1 ring-[#27427a]/15">
          <span className="pointer-events-none absolute inset-[6px] rounded-[1.45rem] border border-[#b8934f]/45" aria-hidden="true" />
          <div className={`${s.kawung} relative rounded-[1.2rem] p-[5px]`}>
            <div className="relative aspect-[4/3.6] overflow-clip rounded-[0.95rem]">
              <div className={`${s.geserLambat} absolute inset-x-0 inset-y-[-10%]`}>
                <Image src={foto.src} alt={foto.alt} fill sizes="(min-width: 440px) 350px, 80vw" className="object-cover" />
              </div>
            </div>
          </div>
          <p className={`${gilda} relative mx-auto -mt-3.5 w-fit rounded-full bg-[#27427a] px-4 py-1.5 text-[10.5px] tracking-[0.32em] text-[#f3e3b4] uppercase ring-2 ring-[#fbfaf6]`}>
            Bab {i + 1} · {c.tahun}
          </p>
          <div className="px-4 text-center">
            <h3 className={`${naskah} mt-3 text-[2.5rem] leading-none text-[#1f3768]`}>{c.judul}</h3>
            <p className="mx-auto mt-3 max-w-[18.5rem] text-[14px] leading-relaxed text-[#27427a]/90">{c.isi}</p>
          </div>
        </div>
      </Timbul>
    </article>
  );
}

// Kartu berdiri dari danau, berporos di kakinya. paralaks: mengikuti scroll (CSS); selain itu sekali saat terlihat.
function Timbul({ paralaks, kanan, children }: { paralaks: boolean; kanan: boolean; children: ReactNode }) {
  if (paralaks) {
    return (
      <div className={`${kanan ? s.kTimbulB : s.kTimbulA} relative`} style={{ transformOrigin: "50% 100%" }}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      className="relative"
      style={{ transformOrigin: "50% 100%" }}
      initial={{ opacity: 0, transform: `perspective(1100px) rotateX(70deg) rotateY(${kanan ? -12 : 12}deg)` }}
      whileInView={{ opacity: 1, transform: "perspective(1100px) rotateX(0deg) rotateY(0deg)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.5, ease: HALUS, opacity: { duration: 0.6 } }}
    >
      {children}
    </motion.div>
  );
}

/* ───────── Selat: perahu menyeberang di antara bab ───────── */

function Selat({ ke, paralaks, burung }: { ke: number; paralaks: boolean; burung?: boolean }) {
  const kiri = ke % 2 === 1; // selat ke-0, 2, … ke kanan; 1, 3, … ke kiri
  const perahu = <Perahu className={`bottom-0 w-[11%] ${kiri ? "right-[3%]" : "left-[3%]"}`} flip={kiri} jeda={-ke * 3} />;
  return (
    <div className="relative h-24" aria-hidden="true">
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_38%,black_70%,transparent)]">
        <Danau className="inset-0" />
      </div>
      {burung && <Burung className="top-[6%] left-0" delay={-6} size={12} />}
      {paralaks ? (
        <div className={`${kiri ? s.kLayarKiri : s.kLayarKanan} absolute inset-x-0 bottom-[40%] h-14`}>{perahu}</div>
      ) : (
        <motion.div
          className="absolute inset-x-0 bottom-[40%] h-14"
          initial={{ transform: "translateX(0%)" }}
          whileInView={{ transform: `translateX(${kiri ? -84 : 84}%)` }}
          viewport={{ once: true, amount: 1 }}
          transition={{ duration: 7, ease: [0.45, 0, 0.4, 1] }}
        >
          {perahu}
        </motion.div>
      )}
    </div>
  );
}

/* ───────── Penutup kisah: dua perahu bertemu ───────── */

function Bertemu({ u, paralaks }: { u: Undangan; paralaks: boolean }) {
  const perahu = (kiri: boolean) => <Perahu className={`bottom-0 w-[13%] ${kiri ? "left-[32%]" : "right-[32%]"}`} flip={!kiri} jeda={kiri ? 0 : -5} />;
  const hati = (
    <svg viewBox="0 0 24 22" className="w-full drop-shadow-[0_2px_6px_rgb(184_147_79/0.6)]">
      <path d="M12 21 2.6 11.6A5.6 5.6 0 0 1 12 4a5.6 5.6 0 0 1 9.4 7.6Z" fill="#d8b56e" stroke="#fbfaf6" strokeWidth="1.4" />
    </svg>
  );
  return (
    <div className="relative mt-2 pb-2">
      <div className="relative z-10 px-8 text-center">
        <Muncul>
          <p className={`${naskah} text-[2.1rem] leading-tight text-[#1f3768]`}>Berlayar bersama</p>
        </Muncul>
        <Muncul jeda={0.15}>
          <p className="mx-auto mt-1 max-w-[17rem] text-[13px] leading-relaxed text-[#27427a]/80">
            Dua perahu, satu tujuan. {u.wanita.panggilan} &amp; {u.pria.panggilan} memulai pelayaran berikutnya.
          </p>
        </Muncul>
      </div>
      <div className="relative mt-3 h-40" aria-hidden="true">
        <Danau className="inset-x-0 top-[22%] bottom-0 [mask-image:linear-gradient(to_bottom,transparent,black_30%)]" />
        {paralaks ? (
          <>
            <div className={`${s.kTemuKiri} absolute inset-x-0 top-[6%] h-20`}>{perahu(true)}</div>
            <div className={`${s.kTemuKanan} absolute inset-x-0 top-[6%] h-20`}>{perahu(false)}</div>
            <div className={`${s.kBertemu} absolute top-[4%] left-[46%] w-[8%]`}>{hati}</div>
          </>
        ) : (
          <>
            {[true, false].map((kiri) => (
              <motion.div
                key={String(kiri)}
                className="absolute inset-x-0 top-[6%] h-20"
                initial={{ transform: `translateX(${kiri ? -46 : 46}%)` }}
                whileInView={{ transform: "translateX(0%)" }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 4, ease: [0.3, 0, 0.3, 1] }}
              >
                {perahu(kiri)}
              </motion.div>
            ))}
            <motion.div
              className="absolute top-[4%] left-[46%] w-[8%]"
              initial={{ opacity: 0, transform: "scale(0.3)" }}
              whileInView={{ opacity: 1, transform: "scale(1)" }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.8, ease: [0.34, 1.6, 0.64, 1], delay: 3.6 }}
            >
              {hati}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
