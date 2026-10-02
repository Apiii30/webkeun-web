"use client";

import { motion, type Variants } from "motion/react";
import Image from "next/image";
import type { ReactNode } from "react";
import { calendarLink } from "../../pakai";
import type { Undangan } from "../../types";
import { ASET, RUMPUN_DASAR, RUMPUN_GEDUNG, RUMPUN_SUDUT, RUMPUN_SUDUT_KANAN } from "./aset";
import { Amplop, Countdown, Galeri, Ucapan, tombolBata } from "./interaktif";
import { Aksara, Bingkai, GedungSate, Gelombang, Kujang, Kuntul, MegaMendung, MelatiJatuh, Pemisah, Rumpun, Siger, Tumpal } from "./ornamen";
import s from "./sunda.module.css";

// Isi undangan tema Art Sunda.
// - Efek yang mengikuti scroll (parallax) memakai CSS scroll-driven animation lewat kelas di sunda.module.css.
// - Efek "muncul" memakai motion dengan `transform` utuh + opacity, yang diserahkan ke mesin animasi browser
//   (WAAPI) sehingga tidak tertinggal dari scroll. Clip-path dipakai hanya untuk efek sekali jalan.

const ease = [0.22, 1, 0.36, 1] as const;
const rozha = "font-[family-name:var(--font-rozha)]";
const script = "font-[family-name:var(--font-alex)]";
const bata = "text-[#8a4b35]";
const NILA = "#2f4560";
const KRIM = "#f4eee2";

/* ───────── pembantu animasi ───────── */

const gaya = {
  naik: { hidden: { opacity: 0, transform: "translateY(40px)" }, show: { opacity: 1, transform: "translateY(0px)" } },
  lembut: { hidden: { opacity: 0, transform: "translateY(16px) scale(0.97)" }, show: { opacity: 1, transform: "translateY(0px) scale(1)" } },
  kiri: { hidden: { opacity: 0, transform: "translateX(-60px) rotate(-4deg)" }, show: { opacity: 1, transform: "translateX(0px) rotate(0deg)" } },
  kanan: { hidden: { opacity: 0, transform: "translateX(60px) rotate(4deg)" }, show: { opacity: 1, transform: "translateX(0px) rotate(0deg)" } },
  zoom: { hidden: { opacity: 0, transform: "scale(0.8)" }, show: { opacity: 1, transform: "scale(1)" } },
  putar: { hidden: { opacity: 0, transform: "translateY(40px) rotate(-8deg) scale(0.9)" }, show: { opacity: 1, transform: "translateY(0px) rotate(0deg) scale(1)" } },
} satisfies Record<string, Variants>;

function Muncul({ as = "naik", delay = 0, className, children }: { as?: keyof typeof gaya; delay?: number; className?: string; children: ReactNode }) {
  return (
    <motion.div className={className} variants={gaya[as]} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1, ease, delay }}>
      {children}
    </motion.div>
  );
}

// Teks yang hurufnya naik satu per satu. Pemicunya diwarisi dari elemen motion di atasnya.
function Huruf({ teks, jeda = 0, cepat = 0.04 }: { teks: string; jeda?: number; cepat?: number }) {
  const kata = teks.split(" ");
  let n = 0;
  return (
    <motion.span variants={{ hidden: {}, show: { transition: { staggerChildren: cepat, delayChildren: jeda } } }} aria-label={teks} role="text">
      {kata.map((k, ki) => (
        <span key={ki} className="inline-block whitespace-nowrap" aria-hidden="true">
          {[...k].map((h) => (
            <motion.span
              key={n++}
              className="inline-block"
              variants={{
                hidden: { opacity: 0, transform: "translateY(0.6em) rotate(8deg)" },
                show: { opacity: 1, transform: "translateY(0em) rotate(0deg)", transition: { duration: 0.7, ease } },
              }}
            >
              {h}
            </motion.span>
          ))}
          {ki < kata.length - 1 && " "}
        </span>
      ))}
    </motion.span>
  );
}

// Tulisan sambung muncul dari kiri ke kanan seperti sedang ditulis
const tulis = (duration = 1.4): Variants => ({
  hidden: { clipPath: "inset(0% 100% 0% 0%)" },
  show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration, ease: "easeInOut" } },
});

// Judul bagian: tulisan sambung kecil, judul besar huruf demi huruf, lalu pembatas kujang yang melebar.
function Judul({ kecil, children, terang = false, gerak = true }: { kecil?: string; children: string; terang?: boolean; gerak?: boolean }) {
  return (
    <motion.div className={`${gerak ? s.pJudul : ""} text-center`} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.7 }}>
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

// Foto terbuka dari tengah membentuk oval. Pemicu "terlihat" di pembungkus luar: elemen yang terpotong penuh
// oleh clip-path dianggap tidak terlihat, jadi animasinya tak akan mulai kalau pemicunya di elemen itu sendiri.
function BukaOval({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
      <motion.div variants={{ hidden: { clipPath: "ellipse(0% 0% at 50% 50%)" }, show: { clipPath: "ellipse(75% 75% at 50% 50%)", transition: { duration: 1.5, ease, delay } } }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

function hariTanggal(tanggal: string) {
  const [hari, ...rest] = tanggal.split(",");
  return { hari: hari.trim(), tgl: rest.join(",").trim() };
}

/* ───────── 1. Beranda: lengkung krem, siger, foto oval, Gedung Sate di kaki ───────── */

function Beranda({ u, opened }: { u: Undangan; opened: boolean }) {
  const tampil = opened ? "show" : "hidden";
  return (
    <section id="beranda" className={`${s.sek} relative h-svh min-h-[44rem] overflow-x-clip`}>
      {/* cetakan sawah di langit-langit, melebur ke krem */}
      <div className={`${s.geserLambat} absolute inset-x-0 top-0 h-[62%] opacity-30 [mask-image:linear-gradient(to_bottom,black_30%,transparent)]`}>
        <Image src={ASET.sawah.src} alt="" fill preload sizes="440px" className="object-cover object-top" />
      </div>
      <MegaMendung className={`${s.awan} absolute top-[5%] -left-6 w-36`} />
      <MegaMendung className={`${s.awan} absolute top-[14%] -right-8 w-32`} style={{ animationDelay: "-6s", animationDuration: "19s" }} />
      <Kuntul className="top-[9%] left-0" delay={-8} />
      <Kuntul className="top-[12%] left-0" delay={-11} size={20} />

      {/* lengkung krem tempat nama */}
      <div className={`${s.keluarTurun} absolute inset-x-[8%] top-[7%] bottom-[16%]`}>
        <motion.div
          initial={{ opacity: 0, transform: "translateY(40px)" }}
          animate={opened ? { opacity: 1, transform: "translateY(0px)" } : {}}
          transition={{ duration: 1.4, ease, delay: 0.2 }}
          className="absolute inset-0 rounded-t-full border border-[#8a4b35]/25 bg-[#fbf7ef]/75 shadow-[0_20px_40px_-30px_rgb(47_69_96/0.6)]"
        >
          <div className="absolute inset-[7px] rounded-t-full border border-dashed border-[#8a4b35]/25" />
        </motion.div>
        <div className="relative flex h-full flex-col items-center px-6 pt-[18%] text-center">
          <motion.div
            initial={{ opacity: 0, transform: "translateY(-30px) rotate(-12deg) scale(0.6)" }}
            animate={opened ? { opacity: 1, transform: "translateY(0px) rotate(0deg) scale(1)" } : {}}
            transition={{ duration: 1.2, ease, delay: 0.9 }}
          >
            <Siger className={`${s.melayang} w-24`} />
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={opened ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 0.7 }} className="mt-1 text-[11px] tracking-[0.35em] text-[#2f4560] uppercase">
            The Wedding Of
          </motion.p>
          <motion.div
            initial={{ clipPath: "ellipse(0% 0% at 50% 50%)" }}
            animate={opened ? { clipPath: "ellipse(75% 75% at 50% 50%)" } : {}}
            transition={{ duration: 1.6, ease, delay: 0.5 }}
            className="mt-4"
          >
            <Bingkai src={u.foto.sampul} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} className="aspect-[3/4.2] h-[27svh] max-h-[16rem]" sizes="220px" preload />
          </motion.div>
          <motion.h1 initial="hidden" animate={tampil} className={`${rozha} mt-5 text-[2.5rem] leading-none ${bata}`}>
            <Huruf teks={`${u.wanita.panggilan} & ${u.pria.panggilan}`} jeda={1.1} cepat={0.06} />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, transform: "translateY(10px)" }}
            animate={opened ? { opacity: 1, transform: "translateY(0px)" } : {}}
            transition={{ duration: 1, delay: 1.9 }}
            className="mt-3 text-sm tracking-[0.2em] text-[#2f4560] uppercase"
          >
            {u.tanggal}
          </motion.p>
        </div>
      </div>

      {/* Gedung Sate & rumpun bunga di kaki halaman */}
      {/* lebar gedung mengikuti tinggi layar, supaya di HP pendek menaranya tidak menimpa tanggal */}
      <div className={`${s.keluarPelan} absolute inset-x-0 bottom-[var(--demo-h,0px)]`}>
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, transform: "translateY(60px)" }}
            animate={opened ? { opacity: 1, transform: "translateY(0px)" } : {}}
            transition={{ duration: 1.6, ease, delay: 0.4 }}
            className="relative w-[min(112%,50svh)] shrink-0"
          >
            <GedungSate preload />
          </motion.div>
        </div>
        <Rumpun items={RUMPUN_GEDUNG} tampil={opened} jeda={0.8} className="inset-x-0 -bottom-2 aspect-[1/0.55]" />
      </div>
    </section>
  );
}

/* ───────── 2. Ayat: blok nila, dua kujang bersilang ───────── */

function Ayat({ u }: { u: Undangan }) {
  if (!u.ayat) return null;
  const words = u.ayat.teks.split(" ");
  return (
    <section className={`${s.nila} relative px-8 pt-14 pb-24 text-center text-[#f4eee2]`}>
      <Gelombang warna={NILA} className="absolute inset-x-0 -top-8" />
      <MegaMendung warna="emas" className={`${s.awan} absolute top-8 -left-10 w-40 opacity-25`} />
      <MegaMendung warna="emas" className={`${s.awan} absolute -right-12 bottom-24 w-44 opacity-20`} style={{ animationDelay: "-7s" }} />

      <motion.div className="relative mx-auto h-36 w-40" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}>
        <motion.div
          className="absolute top-0 left-1/2 h-36 w-12 -ml-6"
          variants={{ hidden: { opacity: 0, transform: "translateX(-70px) rotate(-60deg)" }, show: { opacity: 1, transform: "translateX(-14px) rotate(-24deg)", transition: { duration: 1.3, ease } } }}
        >
          <Kujang className="h-full w-full" />
        </motion.div>
        <motion.div
          className="absolute top-0 left-1/2 h-36 w-12 -ml-6"
          variants={{ hidden: { opacity: 0, transform: "translateX(70px) rotate(60deg) scaleX(-1)" }, show: { opacity: 1, transform: "translateX(14px) rotate(24deg) scaleX(-1)", transition: { duration: 1.3, ease } } }}
        >
          <Kujang className="h-full w-full" />
        </motion.div>
        <motion.div
          className="absolute -bottom-2 left-1/2 w-20 -ml-10"
          variants={{ hidden: { opacity: 0, transform: "scale(0.4)" }, show: { opacity: 1, transform: "scale(1)", transition: { duration: 1, ease, delay: 0.8 } } }}
        >
          <Image src={ASET.melati1.src} alt="" width={ASET.melati1.w} height={ASET.melati1.h} sizes="90px" className="h-auto w-full" />
        </motion.div>
      </motion.div>

      <motion.blockquote className={`${s.pJauh} relative mt-8`} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} transition={{ staggerChildren: 0.035 }}>
        <p className="text-[15px] leading-relaxed text-[#f4eee2]/90">
          “
          {words.map((w, i) => (
            <motion.span
              key={i}
              className="inline-block"
              variants={{ hidden: { opacity: 0, transform: "translateY(12px)" }, show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.6, ease } } }}
            >
              {w}
              {" "}
            </motion.span>
          ))}
          ”
        </p>
        <motion.footer variants={gaya.zoom} className={`${rozha} mt-5 text-lg text-[#d9bd85]`}>
          ({u.ayat.sumber})
        </motion.footer>
      </motion.blockquote>
      <Gelombang warna={KRIM} className="absolute inset-x-0 -bottom-px" />
    </section>
  );
}

/* ───────── 3. Salam & mempelai ───────── */

function Mempelai({ u }: { u: Undangan }) {
  const orang = [
    { p: u.wanita, hias: RUMPUN_SUDUT },
    { p: u.pria, hias: RUMPUN_SUDUT_KANAN },
  ];
  return (
    <section id="mempelai" className="relative px-6 pt-10 pb-20 text-center">
      <div className={`${s.pJauh} pointer-events-none absolute inset-x-0 top-0 h-80 opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent)]`}>
        <Image src={ASET.desa.src} alt="" fill sizes="440px" className="object-cover" />
      </div>
      <motion.div className="relative" initial="hidden" whileInView="show" viewport={{ once: true }}>
        <motion.div variants={gaya.lembut} transition={{ duration: 1 }}>
          <Aksara className="text-xl text-[#2f4560]/80">ᮞᮙ᮪ᮕᮥᮛᮞᮥᮔ᮪</Aksara>
          <p className="mt-1 text-[11px] tracking-[0.35em] text-[#2f4560]/70 uppercase">Sampurasun</p>
        </motion.div>
        {u.salam && (
          <motion.p variants={tulis(1.8)} className={`${script} mt-3 px-2 text-[1.85rem] leading-tight whitespace-nowrap ${bata}`}>
            {u.salam.buka}
          </motion.p>
        )}
      </motion.div>
      <Muncul as="lembut" delay={0.3}>
        <p className="mx-auto mt-3 max-w-xs text-[15px] leading-relaxed text-[#3a3330]/85">{u.pembuka}</p>
      </Muncul>

      {orang.map(({ p, hias }, i) => (
        <div key={p.nama} className={`${s.sek} relative`}>
          {i === 1 && (
            <motion.p
              initial={{ opacity: 0, transform: "scale(0.3) rotate(-40deg)" }}
              whileInView={{ opacity: 1, transform: "scale(1) rotate(0deg)" }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
              className={`${script} my-5 text-6xl ${bata}`}
            >
              &amp;
            </motion.p>
          )}
          <div className={`relative mx-auto w-[60%] ${i === 0 ? "mt-12" : ""}`}>
            <BukaOval>
              <Bingkai src={p.foto} alt={p.nama} className="aspect-[3/4] w-full" sizes="260px" posisi="50% 20%" fotoClass={s.geserLambat} />
            </BukaOval>
            <Rumpun items={hias} className="inset-x-[-14%] bottom-0 aspect-[1/0.6]" jeda={0.6} />
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}>
            <h3 className={`${rozha} mt-7 text-[1.65rem] leading-snug ${bata}`}>
              <Huruf teks={p.nama} jeda={0.2} cepat={0.03} />
            </h3>
            <motion.p variants={{ hidden: { opacity: 0, transform: "translateY(12px)" }, show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.9, delay: 0.8 } } }} className="mx-auto mt-1 max-w-[17rem] text-sm leading-relaxed text-[#3a3330]/80">
              {p.keterangan}
            </motion.p>
          </motion.div>
        </div>
      ))}
    </section>
  );
}

/* ───────── 4. Hitung mundur & 5. Acara: satu blok nila ───────── */

function HitungMundur({ u }: { u: Undangan }) {
  return (
    <div className="relative px-6 pt-14 pb-6">
      <motion.div
        initial={{ opacity: 0, transform: "translateY(70px) scale(0.94)" }}
        whileInView={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1.3, ease }}
        className={`${s.kertas} relative rounded-[2rem] border border-[#d9bd85] p-1.5 shadow-[0_24px_40px_-24px_rgb(0_0_0/0.6)]`}
      >
        <div className="relative rounded-[1.6rem] border border-dashed border-[#8a4b35]/35 px-5 pt-9 pb-7 text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} transition={{ staggerChildren: 0.15, delayChildren: 0.4 }}>
            <motion.div variants={gaya.zoom} className="mx-auto grid size-12 place-items-center rounded-full bg-[#2f4560] text-[#f4eee2]">
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="4" y="5" width="16" height="15" rx="2" />
                <path d="M8 3v4M16 3v4M4 10h16M10 14.5l1.5 1.5 3-3" />
              </svg>
            </motion.div>
            <motion.p variants={gaya.lembut} className="mt-4 text-[15px] leading-relaxed text-[#3a3330]">
              Kami akan menikah, dan kami ingin kamu menjadi bagian dari hari istimewa kami!
            </motion.p>
            <motion.div variants={gaya.lembut} className="mt-6">
              <Countdown target={u.mulai} />
            </motion.div>
            <motion.p variants={gaya.lembut} className={`${rozha} mt-6 text-lg ${bata}`}>
              {u.tanggal}
            </motion.p>
            <motion.div variants={gaya.zoom}>
              <a href={calendarLink(u)} target="_blank" rel="noopener noreferrer" className={`${tombolBata} mt-4`}>
                Simpan Tanggal
              </a>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// Kartu acara: lengkung tinggi krem dengan Gedung Sate di dasarnya. Tidak memakai efek scroll di dalamnya dan
// tidak memotong (overflow) isi yang bergerak, supaya tetap mulus di Safari.
function KartuAcara({ u, a, i }: { u: Undangan; a: Undangan["acara"][number]; i: number }) {
  const { hari, tgl } = hariTanggal(u.tanggal);
  const isi: Variants = {
    hidden: { opacity: 0, transform: "translateY(14px)" },
    show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.8, ease } },
  };
  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="flex justify-center">
      <motion.article
        variants={{
          hidden: { opacity: 0, transform: `translateY(56px) scale(0.92) rotate(${i % 2 ? 3 : -3}deg)` },
          show: { opacity: 1, transform: "translateY(0px) scale(1) rotate(0deg)", transition: { duration: 1.2, ease } },
        }}
        className={`${s.kertas} relative w-[88%] rounded-t-full rounded-b-[2rem] border border-[#d9bd85] p-1.5 shadow-[0_24px_40px_-24px_rgb(0_0_0/0.7)]`}
      >
        <div className="relative rounded-t-full rounded-b-[1.6rem] border border-dashed border-[#8a4b35]/35 px-6 pt-20 pb-[46%] text-center">
          <motion.div variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.5 } } }}>
            <motion.div variants={isi}>
              <Siger className="mx-auto w-16" />
            </motion.div>
            <motion.h3 variants={tulis(1.1)} className={`${script} mt-1 px-2 text-[2.6rem] leading-tight ${bata}`}>
              {a.nama}
            </motion.h3>
            <motion.p variants={isi} className="mt-3 text-xs tracking-[0.35em] text-[#2f4560] uppercase">
              {hari}
            </motion.p>
            <motion.p variants={isi} className={`${rozha} text-[1.7rem] leading-tight text-[#2f4560]`}>
              {tgl}
            </motion.p>
            <motion.p variants={isi} className="mt-1 text-sm text-[#3a3330]/80">
              Pukul {a.jam}
            </motion.p>
            <motion.div variants={{ hidden: { opacity: 0, transform: "scaleX(0)" }, show: { opacity: 1, transform: "scaleX(1)", transition: { duration: 0.8 } } }} className="mx-auto my-4 flex w-40 items-center gap-3 text-[#8a4b35]">
              <span className="h-px flex-1 bg-current opacity-50" />
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
              </svg>
              <span className="h-px flex-1 bg-current opacity-50" />
            </motion.div>
            <motion.p variants={isi} className="font-medium text-[#3a3330]">
              {u.lokasi.nama}
            </motion.p>
            <motion.p variants={isi} className="mx-auto mt-1 max-w-[15rem] text-sm text-[#3a3330]/75">
              {u.lokasi.alamat}
            </motion.p>
            <motion.div variants={gaya.zoom} transition={{ duration: 0.8, ease }}>
              <a href={u.lokasi.maps} target="_blank" rel="noopener noreferrer" className={`${tombolBata} mt-5`}>
                Lihat Lokasi
              </a>
            </motion.div>
          </motion.div>
          <GedungSate sizes="360px" className="absolute inset-x-3 bottom-3 opacity-90 [mask-image:linear-gradient(to_bottom,black_70%,transparent)]" />
        </div>
        <Rumpun items={RUMPUN_DASAR} muncul={false} className="inset-x-[-4%] -bottom-6 aspect-[1/0.42]" />
      </motion.article>
    </motion.div>
  );
}

function BlokAcara({ u }: { u: Undangan }) {
  return (
    <section className={`${s.nila} relative pt-10 pb-24`}>
      <Gelombang warna={NILA} className="absolute inset-x-0 -top-8" />
      <MegaMendung warna="emas" className={`${s.awan} absolute top-24 -right-10 w-40 opacity-20`} />
      <MegaMendung warna="emas" className={`${s.awan} absolute top-[46%] -left-12 w-44 opacity-20`} style={{ animationDelay: "-5s" }} />
      <HitungMundur u={u} />
      <div id="acara" className="pt-16">
        <Judul kecil="Save the date" terang>
          Akad & Resepsi
        </Judul>
        <div className="mt-10 space-y-16 px-4">
          {u.acara.map((a, i) => (
            <KartuAcara key={a.nama} u={u} a={a} i={i} />
          ))}
        </div>
      </div>
      <Gelombang warna={KRIM} className="absolute inset-x-0 -bottom-px" />
    </section>
  );
}

/* ───────── 6. Galeri ───────── */

function BagianGaleri({ u }: { u: Undangan }) {
  return (
    <section id="galeri" className="relative px-5 pt-14 pb-16">
      <div className={s.pJudul}>
        <Judul kecil="Momen berharga" gerak={false}>
          Galeri
        </Judul>
        <Muncul as="lembut" delay={0.6}>
          <p className="mt-3 text-center text-xs tracking-wide text-[#3a3330]/60">Ketuk foto untuk melihat lebih besar</p>
        </Muncul>
      </div>
      <div className="h-8" />
      <Galeri photos={u.foto.galeri} />
    </section>
  );
}

/* ───────── 7. Kisah: blok nila dengan garis keemasan yang tumbuh ───────── */

function Kisah({ u }: { u: Undangan }) {
  const foto = u.foto.galeri[1] ?? u.foto.galeri[0];
  return (
    <section id="cerita" className={`${s.nila} relative px-6 pt-12 pb-24 text-[#f4eee2]`}>
      <Gelombang warna={NILA} className="absolute inset-x-0 -top-8" />
      <MegaMendung warna="emas" className={`${s.awan} absolute top-10 -left-10 w-36 opacity-20`} />
      <BukaOval className="mx-auto w-[52%]">
        <Bingkai src={foto.src} alt={foto.alt} className="aspect-[3/4] w-full" sizes="230px" terang />
      </BukaOval>
      <div className="mt-8">
        <Judul kecil="Perjalanan kami" terang>
          Kisah Cinta
        </Judul>
      </div>
      <ol className={`${s.sek} relative mt-10 space-y-9 pl-10`}>
        <span className="absolute top-2 bottom-2 left-[11px] w-px bg-[#d9bd85]/25" aria-hidden="true" />
        <span className={`${s.tumbuhGaris} absolute top-2 bottom-2 left-[11px] w-px origin-top bg-[#d9bd85]`} aria-hidden="true" />
        {u.cerita.map((c, i) => (
          <li key={c.tahun} className="relative">
            <motion.span
              initial={{ opacity: 0, transform: "scale(0) rotate(-90deg)" }}
              whileInView={{ opacity: 1, transform: "scale(1) rotate(0deg)" }}
              viewport={{ once: true, amount: 1 }}
              transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              className="absolute top-0.5 -left-10 grid size-6 place-items-center rounded-full bg-[#d9bd85] text-[#2f4560]"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" className={`${s.detak} size-3.5`} fill="currentColor" style={{ animationDelay: `${-i * 0.4}s` }}>
                <path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11Z" />
              </svg>
            </motion.span>
            <Muncul as={i % 2 ? "kiri" : "kanan"} delay={0.1}>
              <p className="text-xs tracking-[0.25em] text-[#d9bd85]">{c.tahun}</p>
              <h3 className={`${rozha} mt-0.5 text-xl`}>{c.judul}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#f4eee2]/80">{c.isi}</p>
            </Muncul>
          </li>
        ))}
      </ol>
      <Gelombang warna={KRIM} className="absolute inset-x-0 -bottom-px" />
    </section>
  );
}

/* ───────── 8. Ucapan & RSVP ───────── */

function BagianUcapan({ tamu }: { tamu?: string }) {
  return (
    <section id="ucapan" className="relative px-5 pt-14 pb-12">
      <Judul kecil="Doa & restu">Ucapan</Judul>
      <Muncul as="lembut" delay={0.4}>
        <p className="mx-auto mt-3 mb-7 max-w-[17rem] text-center text-sm text-[#3a3330]/75">Berikan ucapan terbaik untuk kedua mempelai & konfirmasi kehadiranmu</p>
      </Muncul>
      <Muncul as="naik" delay={0.2}>
        <Ucapan tamu={tamu} />
      </Muncul>
    </section>
  );
}

/* ───────── 9. Tanda kasih: kartu dengan pita nila tegak di kiri ───────── */

function Kado({ u }: { u: Undangan }) {
  return (
    <section id="kado" className="relative px-5 pt-6 pb-16">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
        <motion.div
          variants={{ hidden: { clipPath: "inset(0% 100% 0% 0% round 1.5rem)" }, show: { clipPath: "inset(0% 0% 0% 0% round 1.5rem)", transition: { duration: 1.3, ease: [0.65, 0, 0.35, 1] } } }}
          className="relative flex overflow-hidden rounded-3xl border border-[#8a4b35]/35 bg-[#fbf7ef]/80"
        >
          <div className={`${s.nila} relative flex w-14 shrink-0 items-center justify-center`}>
            <p className={`${rozha} text-xl tracking-wide whitespace-nowrap text-[#f4eee2] [writing-mode:vertical-rl] rotate-180`}>Tanda Kasih</p>
          </div>
          <div className="relative px-5 py-7 text-center">
            <MegaMendung className="absolute -right-8 -bottom-6 w-32 opacity-15" />
            <motion.p variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 0.8, duration: 0.8 } } }} className="relative text-sm leading-relaxed text-[#3a3330]/85">
              Doa restumu sudah lebih dari cukup. Namun jika ingin memberi tanda kasih, kamu bisa mengirimkannya lewat tombol di bawah.
            </motion.p>
            <motion.div variants={{ hidden: { opacity: 0, transform: "scale(0.8)" }, show: { opacity: 1, transform: "scale(1)", transition: { delay: 1, duration: 0.8, ease } } }} className="relative mt-5">
              <Amplop amplop={u.amplop} />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ───────── 10. Penutup ───────── */

function Penutup({ u }: { u: Undangan }) {
  return (
    <section className={`${s.sek} relative flex min-h-svh flex-col items-center overflow-x-clip px-6 pt-10 pb-[calc(19rem+var(--demo-h,0px))] text-center`}>
      <Tumpal className="absolute inset-x-0 top-0 opacity-50" />
      <MegaMendung className={`${s.awan} absolute top-16 -left-8 w-32 opacity-90`} />
      <MegaMendung className={`${s.awan} absolute top-40 -right-10 w-28 opacity-90`} style={{ animationDelay: "-8s" }} />
      <div className={`${s.mendekat} relative mt-6 w-[62%]`}>
        <BukaOval>
          <Bingkai src={u.foto.belakang} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} className="aspect-[3/4] w-full" sizes="270px" />
        </BukaOval>
        <Rumpun items={RUMPUN_SUDUT} className="inset-x-[-12%] bottom-0 aspect-[1/0.6]" jeda={0.8} />
      </div>
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} transition={{ staggerChildren: 0.25 }}>
        <motion.p variants={gaya.lembut} className="mx-auto mt-8 max-w-xs text-[15px] leading-relaxed text-[#3a3330]/85">
          Atas kehadiran dan doa restu Bapak/Ibu/Saudara/i sekalian, kami mengucapkan terima kasih.
        </motion.p>
        {u.salam && (
          <motion.p variants={tulis(1.6)} className={`${script} mt-3 px-2 text-[1.75rem] whitespace-nowrap ${bata}`}>
            {u.salam.tutup}
          </motion.p>
        )}
        <motion.div variants={gaya.lembut} className="mt-5">
          <Aksara className="text-lg text-[#2f4560]/80">ᮠᮒᮥᮁ ᮔᮥᮠᮥᮔ᮪</Aksara>
          <p className="mt-0.5 text-[11px] tracking-[0.35em] text-[#2f4560]/70 uppercase">Hatur nuhun</p>
        </motion.div>
        <motion.p variants={gaya.lembut} className="mt-6 text-sm text-[#3a3330]/70">
          Kami yang berbahagia
        </motion.p>
        <p className={`${rozha} mt-1 text-[2.3rem] leading-tight ${bata}`}>
          <Huruf teks={`${u.wanita.panggilan} & ${u.pria.panggilan}`} cepat={0.07} />
        </p>
      </motion.div>

      <div className="absolute inset-x-0 bottom-[var(--demo-h,0px)]">
        <Muncul as="naik" className="relative -mx-[14%]">
          <GedungSate />
        </Muncul>
        <Rumpun items={RUMPUN_GEDUNG} className="inset-x-0 -bottom-2 aspect-[1/0.55]" jeda={0.3} />
      </div>
      <Kuntul className="top-[6%] left-0" delay={-14} />
      <MelatiJatuh n={6} />
    </section>
  );
}

export function Isi({ u, opened, tamu }: { u: Undangan; opened: boolean; tamu?: string }) {
  return (
    <>
      <Beranda u={u} opened={opened} />
      <Ayat u={u} />
      <Mempelai u={u} />
      <BlokAcara u={u} />
      <BagianGaleri u={u} />
      <Kisah u={u} />
      <BagianUcapan tamu={tamu} />
      <Kado u={u} />
      <Penutup u={u} />
    </>
  );
}
