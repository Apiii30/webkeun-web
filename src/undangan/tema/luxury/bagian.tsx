"use client";

import { motion, type Variants } from "motion/react";
import Image from "next/image";
import type { ReactNode } from "react";
import { calendarLink } from "../../pakai";
import type { Undangan } from "../../types";
import { Galeri } from "./galeri";
import { Daun, GarisEmas, Kerlip, LabelTegak, Monogram, bodoni, script } from "./hias";
import { Amplop, Countdown, Ucapan, tombolGaris } from "./interaktif";
import s from "./luxury.module.css";
import { KreditWebkeun } from "../../kredit";

// Isi undangan tema Luxury: gaya majalah, blok taupe-ivory-espresso yang saling menumpuk dengan sudut lengkung besar.
// - Parallax memakai CSS scroll-driven animation (luxury.module.css), digerakkan GPU tanpa JavaScript.
// - Efek "muncul" memakai motion dengan `transform` utuh + opacity, yang diserahkan ke mesin animasi browser.
//   Clip-path hanya dipakai untuk efek sekali jalan (tirai foto).

const ease = [0.22, 1, 0.36, 1] as const;
const ROMAWI = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

/* ───────── pembantu animasi ───────── */

const gaya = {
  naik: { hidden: { opacity: 0, transform: "translateY(40px)" }, show: { opacity: 1, transform: "translateY(0px)" } },
  lembut: { hidden: { opacity: 0, transform: "translateY(16px)" }, show: { opacity: 1, transform: "translateY(0px)" } },
  kiri: { hidden: { opacity: 0, transform: "translateX(-50px)" }, show: { opacity: 1, transform: "translateX(0px)" } },
  kanan: { hidden: { opacity: 0, transform: "translateX(50px)" }, show: { opacity: 1, transform: "translateX(0px)" } },
  zoom: { hidden: { opacity: 0, transform: "scale(0.85)" }, show: { opacity: 1, transform: "scale(1)" } },
} satisfies Record<string, Variants>;

function Muncul({ as = "naik", delay = 0, className, children }: { as?: keyof typeof gaya; delay?: number; className?: string; children: ReactNode }) {
  return (
    <motion.div className={className} variants={gaya[as]} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1.1, ease, delay }}>
      {children}
    </motion.div>
  );
}

// Huruf naik satu per satu; pemicunya diwarisi dari elemen motion di atasnya
// kelas: dipasang di tiap huruf, mis. teks emas (gradasi yang di-clip ke teks pada induknya tidak ikut ke huruf yang
// bergerak sendiri, hurufnya jadi tak terlihat)
function Huruf({ teks, jeda = 0, cepat = 0.04, kelas = "" }: { teks: string; jeda?: number; cepat?: number; kelas?: string }) {
  const kata = teks.split(" ");
  let n = 0;
  return (
    <motion.span variants={{ hidden: {}, show: { transition: { staggerChildren: cepat, delayChildren: jeda } } }} aria-label={teks} role="text">
      {kata.map((k, ki) => (
        <span key={ki} className="inline-block whitespace-nowrap" aria-hidden="true">
          {[...k].map((h) => (
            <motion.span
              key={n++}
              className={`inline-block ${kelas}`}
              variants={{
                hidden: { opacity: 0, transform: "translateY(0.5em)" },
                show: { opacity: 1, transform: "translateY(0em)", transition: { duration: 0.8, ease } },
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

// Foto tersingkap seperti tirai. Bukan clip-path (yang digambar ulang tiap frame), melainkan dua lapis yang
// bergeser berlawanan: lapis tengah naik dari bawah (jendela yang terbuka), isinya turun dengan jarak yang sama
// sehingga foto tampak diam. Semuanya transform, jadi dijalankan GPU.
const TIRAI = [0.65, 0, 0.35, 1] as const;
function Tirai({ children, className = "", delay = 0, dari = "bawah" }: { children: ReactNode; className?: string; delay?: number; dari?: "bawah" | "atas" }) {
  const d = dari === "bawah" ? 101 : -101;
  const t = { duration: 1.4, ease: TIRAI, delay };
  return (
    <motion.div className={`overflow-hidden ${className}`} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
      <motion.div className="h-full w-full overflow-hidden" variants={{ hidden: { transform: `translateY(${d}%)` }, show: { transform: "translateY(0%)", transition: t } }}>
        <motion.div className="h-full w-full" variants={{ hidden: { transform: `translateY(${-d}%) scale(1.12)` }, show: { transform: "translateY(0%) scale(1)", transition: t } }}>
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Judul bagian: kata besar Bodoni dengan tulisan sambung yang menumpang miring di atasnya
function Judul({ besar, sambung, terang = false, className = "" }: { besar: string; sambung: string; terang?: boolean; className?: string }) {
  return (
    <motion.div className={`${s.pJudul} relative text-center ${className}`} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.7 }}>
      <h2 className={`${bodoni} text-[2.9rem] leading-none font-medium ${terang ? "text-[#f6f1e9]" : "text-[#8f7f68]"}`}>
        <Huruf teks={besar} cepat={0.05} />
      </h2>
      <motion.p
        variants={{ hidden: { opacity: 0, clipPath: "inset(0% 100% 0% 0%)" }, show: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.3, ease: "easeInOut", delay: 0.5 } } }}
        className={`${script} relative -mt-5 ml-[38%] -rotate-6 text-[3rem] leading-none ${terang ? "text-[#e9d5a1]" : "text-[#241d18]"}`}
      >
        {sambung}
      </motion.p>
    </motion.div>
  );
}

function pecahTanggal(tanggal: string) {
  const [hari, ...rest] = tanggal.split(",");
  const [angka, ...bt] = rest.join(",").trim().split(" ");
  return { hari: hari.trim(), angka, bulanTahun: bt.join(" ") };
}

/* ───────── 1. Beranda: foto penuh dengan tepi bawah melengkung, nama di bawahnya ───────── */

function Beranda({ u, opened }: { u: Undangan; opened: boolean }) {
  const tampil = opened ? "show" : "hidden";
  return (
    <section id="beranda" className={`${s.sek} relative bg-[#f6f1e9] pb-24`}>
      <div className="relative h-[60svh] min-h-[26rem] overflow-hidden rounded-b-[50%_14%]">
        <div className={`${s.fotoBeranda} absolute inset-0`}>
          <motion.div
            className="absolute inset-0"
            initial={{ transform: "scale(1.18)" }}
            animate={opened ? { transform: "scale(1)" } : {}}
            transition={{ duration: 2.4, ease }}
          >
            <Image src={u.foto.sampul} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} fill preload sizes="440px" className="object-cover object-[50%_30%]" />
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#241d18]/25 via-transparent to-[#241d18]/35" />
        <Kerlip n={8} />
      </div>

      <div className={`${s.tertutup} relative origin-top px-7 pt-10`}>
        <Daun n={1} className="-top-20 -right-20 w-44 opacity-60 [filter:brightness(0.75)_sepia(0.5)]" flip />
        <motion.p initial={{ opacity: 0 }} animate={opened ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 0.9 }} className="text-[12px] tracking-[0.35em] text-[#8f7f68] uppercase">
          The Wedding Of
        </motion.p>
        <motion.h1 initial="hidden" animate={tampil} className={`${bodoni} mt-2 text-[2.9rem] leading-[1.05] font-medium text-[#8f7f68]`}>
          <Huruf teks={`${u.wanita.panggilan} & ${u.pria.panggilan}`} jeda={1.1} cepat={0.06} />
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, transform: "scaleX(0)" }}
          animate={opened ? { opacity: 1, transform: "scaleX(1)" } : {}}
          transition={{ duration: 1.2, ease, delay: 1.8 }}
          className={`${s.emas} mt-4 h-px w-28 origin-left`}
        />
        <motion.p initial={{ opacity: 0, transform: "translateY(10px)" }} animate={opened ? { opacity: 1, transform: "translateY(0px)" } : {}} transition={{ duration: 1, delay: 2 }} className="mt-3 text-sm text-[#2b2420]/80">
          {u.tanggal}
        </motion.p>
      </div>
    </section>
  );
}

/* ───────── 2. Kolase monogram, ayat, hitung mundur (blok taupe) ───────── */

function Pembuka({ u }: { u: Undangan }) {
  const g = u.foto.galeri;
  const kolase = [g[0], g[1], g[2], g[3]].filter(Boolean);
  const words = u.ayat?.teks.split(" ") ?? [];
  return (
    <section className={`${s.naikLapis} relative z-10 -mt-12 rounded-tl-[5.5rem] bg-[#b2a28a] px-6 pt-14 pb-24 text-center text-[#f6f1e9]`}>
      <Daun n={3} className="-top-6 -right-14 w-52 opacity-35" delay={-3} />
      <Daun n={2} className="bottom-10 -left-16 w-48 opacity-25" flip delay={-6} />

      {/* kolase empat foto dalam lingkaran dengan monogram di tengah */}
      <motion.div
        className="relative mx-auto aspect-square w-[80%]"
        initial={{ opacity: 0, transform: "rotate(-25deg) scale(0.8)" }}
        whileInView={{ opacity: 1, transform: "rotate(0deg) scale(1)" }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.6, ease }}
      >
        <div className="grid h-full w-full grid-cols-2 gap-[3px] overflow-hidden rounded-full border-[3px] border-[#f6f1e9] bg-[#f6f1e9] shadow-[0_24px_50px_-24px_rgb(36_29_24/0.7)]">
          {kolase.map((f, i) => (
            <motion.div
              key={f.src}
              className="relative overflow-hidden"
              initial={{ opacity: 0, transform: "scale(1.3)" }}
              whileInView={{ opacity: 1, transform: "scale(1)" }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease, delay: 0.4 + i * 0.15 }}
            >
              <Image src={f.src} alt="" fill sizes="180px" className="object-cover" />
            </motion.div>
          ))}
        </div>
        <motion.div
          className="absolute inset-0 m-auto size-[42%] rounded-full bg-[#f6f1e9] p-2 shadow-[0_10px_30px_-10px_rgb(36_29_24/0.6)]"
          initial={{ opacity: 0, transform: "scale(0.4)" }}
          whileInView={{ opacity: 1, transform: "scale(1)" }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.34, 1.4, 0.64, 1], delay: 1.1 }}
        >
          <Monogram a={u.wanita.panggilan[0]} b={u.pria.panggilan[0]} className="h-full w-full text-[0.95rem]" />
        </motion.div>
      </motion.div>

      {u.ayat && (
        <motion.blockquote className={`${s.pJauh} mt-12`} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} transition={{ staggerChildren: 0.03 }}>
          <p className="text-[15px] leading-relaxed text-[#f6f1e9]/95">
            “
            {words.map((w, i) => (
              <motion.span key={i} className="inline-block" variants={{ hidden: { opacity: 0, transform: "translateY(10px)" }, show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.6, ease } } }}>
                {w}
                {" "}
              </motion.span>
            ))}
            ”
          </p>
          <motion.footer variants={gaya.zoom} className={`${bodoni} mt-4 text-base italic`}>
            ~ {u.ayat.sumber} ~
          </motion.footer>
        </motion.blockquote>
      )}

      <GarisEmas terang className="mt-10" />
      <Muncul as="lembut" className="mt-8">
        <p className="text-[13px] leading-relaxed text-[#f6f1e9]/90">Kami akan menikah, dan kami ingin kamu menjadi bagian dari hari istimewa kami.</p>
      </Muncul>
      <div className="mt-6">
        <Countdown target={u.mulai} />
      </div>
      <Muncul as="zoom" delay={0.3}>
        <a href={calendarLink(u)} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#f6f1e9] px-6 py-2.5 text-[12px] font-semibold tracking-[0.15em] text-[#8f7f68] uppercase">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M6 3h12v18l-6-4-6 4Z" />
          </svg>
          Save the Date
        </a>
      </Muncul>
    </section>
  );
}

/* ───────── 3. Mempelai: foto bersudut lengkung besar, label tegak raksasa ───────── */

function Mempelai({ u }: { u: Undangan }) {
  const orang = [
    { p: u.wanita, label: "The Bride" },
    { p: u.pria, label: "The Groom" },
  ];
  return (
    <section id="mempelai" className={`${s.naikLapis} relative z-20 -mt-12 rounded-tr-[5.5rem] bg-[#f6f1e9] pt-14 pb-20`}>
      <div className="px-7 text-center">
        <GarisEmas />
        {u.salam && (
          <Muncul as="lembut" className="mt-5">
            <p className={`${bodoni} text-[1.6rem] text-[#8f7f68] italic`}>{u.salam.buka}</p>
          </Muncul>
        )}
        <Muncul as="lembut" delay={0.2}>
          <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-[#2b2420]/80">{u.pembuka}</p>
        </Muncul>
      </div>

      {orang.map(({ p, label }, i) => {
        const kanan = i === 0; // foto mempelai wanita di kanan, pria di kiri
        return (
          <div key={p.nama} className={`${s.sek} relative ${i === 0 ? "mt-14" : "mt-6"}`}>
            {i === 1 && (
              <Muncul as="zoom" className="mb-6 text-center">
                <span className={`${script} text-[4.5rem] leading-none text-[#b48d4b]`}>&amp;</span>
              </Muncul>
            )}
            <LabelTegak className={`${s.labelGeser} absolute top-0 ${kanan ? "left-3 rotate-180" : "right-3"} text-[#b2a28a]`}>{label}</LabelTegak>
            <Tirai className={`relative aspect-[3/4] w-[74%] ${kanan ? "ml-auto" : ""}`}>
              <div className={`relative h-full w-full overflow-hidden ${kanan ? "rounded-tl-[7rem] rounded-br-[1.5rem]" : "rounded-tr-[7rem] rounded-bl-[1.5rem]"} shadow-[0_24px_40px_-24px_rgb(36_29_24/0.7)]`}>
                <div className={`${s.geserLambat} absolute inset-x-0 inset-y-[-8%]`}>
                  <Image src={p.foto} alt={p.nama} fill sizes="330px" className="object-cover object-[50%_20%]" />
                </div>
              </div>
            </Tirai>
            <motion.div className={`relative mt-5 px-7 ${kanan ? "text-left" : "text-right"}`} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}>
              <h3 className={`${bodoni} text-[1.75rem] leading-tight font-medium text-[#8f7f68]`}>
                <Huruf teks={p.nama} cepat={0.025} />
              </h3>
              <motion.p variants={gaya.lembut} transition={{ duration: 0.9, delay: 0.7 }} className={`mt-2 max-w-[16rem] text-sm leading-relaxed text-[#2b2420]/75 ${kanan ? "" : "ml-auto"}`}>
                {p.keterangan}
              </motion.p>
            </motion.div>
          </div>
        );
      })}
    </section>
  );
}

/* ───────── 4. Acara (blok taupe) ───────── */

// Kartu acara: foto, pita tegak bernama acara, angka tanggal besar. Tidak ada efek scroll di dalam kartu
// supaya tetap mulus di Safari; geraknya hanya animasi masuk sekali.
function KartuAcara({ u, a, i, foto }: { u: Undangan; a: Undangan["acara"][number]; i: number; foto: string }) {
  const { hari, angka, bulanTahun } = pecahTanggal(u.tanggal);
  const isi: Variants = { hidden: { opacity: 0, transform: "translateY(14px)" }, show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.8, ease } } };
  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
      <motion.article
        variants={{ hidden: { opacity: 0, transform: "translateY(60px)" }, show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 1.1, ease } } }}
        className={`overflow-hidden bg-[#f6f1e9] text-[#2b2420] shadow-[0_30px_50px_-28px_rgb(36_29_24/0.8)] ${i % 2 ? "rounded-tl-[5rem] rounded-br-[1.5rem]" : "rounded-tr-[5rem] rounded-bl-[1.5rem]"}`}
      >
        <Tirai dari="atas" delay={0.2} className="relative aspect-[16/11]">
          <div className="relative h-full w-full">
            <Image src={foto} alt="" fill sizes="400px" className="object-cover" />
          </div>
        </Tirai>
        <div className={`flex ${i % 2 ? "flex-row-reverse" : ""}`}>
          <div className="flex w-14 shrink-0 items-center justify-center bg-[#8f7f68] py-6">
            <p className={`${bodoni} text-xl tracking-[0.12em] whitespace-nowrap text-[#f6f1e9] uppercase [writing-mode:vertical-rl] ${i % 2 ? "" : "rotate-180"}`}>{a.nama}</p>
          </div>
          <motion.div className="flex-1 px-5 py-6" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } } }}>
            <motion.div variants={isi} className="flex items-center gap-3">
              <span className={`${bodoni} ${s.teksEmas} text-[3.8rem] leading-none font-semibold`}>{angka}</span>
              <span className="border-l border-[#b2a28a] pl-3 text-[12px] leading-snug font-bold tracking-[0.12em] uppercase">
                {hari}
                <br />
                {bulanTahun}
              </span>
            </motion.div>
            <motion.div variants={isi} className="mt-4 flex items-center gap-2 border-t border-[#b2a28a]/50 pt-4 text-sm">
              <svg viewBox="0 0 24 24" className="size-4 text-[#8f7f68]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              Pukul {a.jam}
            </motion.div>
            <motion.p variants={isi} className={`${bodoni} mt-4 text-lg text-[#8f7f68]`}>
              {u.lokasi.nama}
            </motion.p>
            <motion.p variants={isi} className="mt-1 text-sm leading-relaxed text-[#2b2420]/70">
              {u.lokasi.alamat}
            </motion.p>
            <motion.div variants={isi}>
              <a href={u.lokasi.maps} target="_blank" rel="noopener noreferrer" className={`${tombolGaris} mt-4`}>
                <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
                </svg>
                Google Maps
              </a>
            </motion.div>
          </motion.div>
        </div>
      </motion.article>
    </motion.div>
  );
}

function Acara({ u }: { u: Undangan }) {
  const foto = [u.foto.kutipan, u.foto.galeri[4]?.src ?? u.foto.sampul];
  return (
    <section id="acara" className={`${s.naikLapis} relative z-30 -mt-12 rounded-tl-[5.5rem] bg-[#b2a28a] px-5 pt-16 pb-24`}>
      <Daun n={1} className="top-24 -right-12 w-44 opacity-30" delay={-2} />
      <Judul besar="Wedding" sambung="Event" terang />
      <div className="mt-10 space-y-10">
        {u.acara.map((a, i) => (
          <KartuAcara key={a.nama} u={u} a={a} i={i} foto={foto[i % foto.length]} />
        ))}
      </div>
    </section>
  );
}

/* ───────── 5. Galeri (blok espresso) ───────── */

function BagianGaleri({ u }: { u: Undangan }) {
  return (
    <section id="galeri" className={`${s.naikLapis} relative z-40 -mt-12 rounded-tr-[5.5rem] bg-[#241d18] pt-16 pb-24`}>
      <Kerlip n={12} />
      <Judul besar="Gallery" sambung="Our" terang />
      <GarisEmas terang className="mt-4 mb-10" />
      <Galeri photos={u.foto.galeri} />
    </section>
  );
}

/* ───────── 6. Kisah cinta: bab-bab bergaya editorial ───────── */

function Bab({ c, i, foto, n }: { c: Undangan["cerita"][number]; i: number; foto: string; n: number }) {
  const kanan = i % 2 === 1;
  return (
    <article className={`${s.sek} relative pt-20`}>
      {/* benang emas dari bab sebelumnya, tumbuh mengikuti scroll */}
      {i > 0 && <span className={`${s.benang} absolute top-0 left-1/2 h-16 w-px origin-top bg-gradient-to-b from-transparent to-[#c8a96a]`} aria-hidden="true" />}
      {i > 0 && <span className={`${s.emas} absolute top-[4.1rem] left-1/2 size-2 -translate-x-1/2 rotate-45`} aria-hidden="true" />}
      {/* tahun raksasa bergaris, bergeser menyamping */}
      <p className={`${bodoni} ${s.garis} ${kanan ? s.tahunKiri : s.tahunKanan} pointer-events-none absolute top-14 ${kanan ? "-right-2" : "-left-2"} text-[7rem] leading-none text-[#c8a96a]/45`} aria-hidden="true">
        {c.tahun}
      </p>

      <div className={`relative flex items-end gap-4 ${kanan ? "flex-row-reverse" : ""}`}>
        <Tirai className="relative aspect-[3/4.3] w-[56%] shrink-0" delay={0.1}>
          <div className={`${s.emas} h-full w-full rounded-t-full p-[2px]`}>
            <div className="relative h-full w-full overflow-hidden rounded-t-full">
              <div className={`${s.geserLambat} absolute inset-x-0 inset-y-[-8%]`}>
                <Image src={foto} alt="" fill sizes="240px" className="object-cover" />
              </div>
            </div>
          </div>
        </Tirai>
        <Muncul as={kanan ? "kiri" : "kanan"} delay={0.3} className={`pb-14 ${kanan ? "text-right" : ""}`}>
          <p className="text-[10px] tracking-[0.4em] text-[#f6f1e9]/60 uppercase">Chapter</p>
          <p className={`${bodoni} ${s.teksEmas} text-[3.4rem] leading-none italic`}>{ROMAWI[i] ?? i + 1}</p>
          <p className="mt-1 text-[11px] tracking-[0.3em] text-[#f6f1e9]/60">
            {c.tahun} · {String(i + 1).padStart(2, "0")}/{String(n).padStart(2, "0")}
          </p>
        </Muncul>
      </div>

      <Muncul as="naik" delay={0.2} className={`relative -mt-10 ${kanan ? "mr-[18%]" : "ml-[18%]"}`}>
        <div className="rounded-2xl border border-[#c8a96a]/35 bg-[#1d1712]/92 p-5 shadow-[0_24px_40px_-24px_rgb(0_0_0/0.9)]">
          <h3 className={`${bodoni} text-[1.55rem] leading-tight text-[#f6f1e9] italic`}>{c.judul}</h3>
          <span className={`${s.emas} mt-2 block h-px w-12`} aria-hidden="true" />
          <p className="mt-3 text-sm leading-relaxed text-[#f6f1e9]/75">{c.isi}</p>
        </div>
      </Muncul>
    </article>
  );
}

function Kisah({ u }: { u: Undangan }) {
  const g = u.foto.galeri;
  // foto per bab, berputar dari galeri
  const urut = [5, 1, 0, 4, 2, 6, 3];
  return (
    <section id="cerita" className={`${s.naikLapis} relative z-50 -mt-12 overflow-x-clip rounded-tl-[5.5rem] bg-[radial-gradient(120%_60%_at_50%_0%,#2b231d_0%,#120e0b_70%)] px-6 pt-16 pb-24 text-[#f6f1e9] ring-1 ring-[#c8a96a]/25`}>
      <Kerlip n={14} />
      <div className="text-center">
        <Muncul as="lembut">
          <p className={`${script} ${s.teksEmas} text-[2.8rem] leading-none`}>True Story</p>
        </Muncul>
        <motion.h2 className={`${bodoni} mt-1 text-[2.4rem] leading-tight italic`} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.7 }}>
          <Huruf teks="Our Love Story" cepat={0.045} />
        </motion.h2>
        <GarisEmas terang className="mt-4" />
      </div>
      {u.cerita.map((c, i) => (
        <Bab key={c.tahun + c.judul} c={c} i={i} n={u.cerita.length} foto={(g[urut[i % urut.length]] ?? g[i % g.length]).src} />
      ))}
      <Muncul as="zoom" className="mt-16 flex flex-col items-center text-center">
        <Monogram a={u.wanita.panggilan[0]} b={u.pria.panggilan[0]} terang className="size-24 text-[0.85rem]" />
        <p className={`${script} mt-4 text-[2rem] text-[#e9d5a1]`}>dan cerita kami baru dimulai</p>
      </Muncul>
    </section>
  );
}

/* ───────── 7. RSVP & ucapan ───────── */

function BagianUcapan({ tamu }: { tamu?: string }) {
  return (
    <section id="ucapan" className={`${s.naikLapis} relative z-[60] -mt-12 rounded-tr-[5.5rem] bg-[#f6f1e9] px-5 pt-16 pb-20`}>
      <Judul besar="RSVP" sambung="Wishes" />
      <Muncul as="lembut" delay={0.3}>
        <p className="mx-auto mt-6 mb-7 max-w-[17rem] text-center text-sm text-[#2b2420]/70">Berikan ucapan terbaik untuk kedua mempelai & konfirmasi kehadiranmu</p>
      </Muncul>
      <Muncul as="naik" delay={0.1}>
        <Ucapan tamu={tamu} />
      </Muncul>
    </section>
  );
}

/* ───────── 8. Kirim hadiah (blok taupe) ───────── */

function Kado({ u }: { u: Undangan }) {
  return (
    <section id="kado" className={`${s.naikLapis} relative z-[70] -mt-12 rounded-tl-[5.5rem] bg-[#b2a28a] px-6 pt-16 pb-24 text-center`}>
      <Daun n={2} className="top-6 -left-14 w-44 opacity-30" delay={-4} />
      <Muncul as="naik" className="relative rounded-[2rem] bg-[#f6f1e9] px-6 pt-10 pb-8 shadow-[0_30px_50px_-28px_rgb(36_29_24/0.8)]">
        <motion.div
          initial={{ opacity: 0, transform: "translateY(-20px) rotate(-20deg)" }}
          whileInView={{ opacity: 1, transform: "translateY(0px) rotate(0deg)" }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.34, 1.5, 0.64, 1], delay: 0.4 }}
          className="mx-auto grid size-14 place-items-center rounded-full bg-[#241d18] text-[#e9d5a1]"
        >
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="4" y="9" width="16" height="11" rx="1.5" />
            <path d="M3 9h18M12 9v11M12 9S10 4 7.5 5 9 9 12 9Zm0 0s2-5 4.5-4S15 9 12 9Z" />
          </svg>
        </motion.div>
        <p className={`${bodoni} mt-4 text-[1.9rem] text-[#8f7f68]`}>Kirim Hadiah</p>
        <p className="mt-3 text-sm leading-relaxed text-[#2b2420]/75">
          Doa restumu adalah karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan tanda kasihmu, kamu dapat memberi kado secara cashless.
        </p>
        <div className="mt-6">
          <Amplop amplop={u.amplop} />
        </div>
      </Muncul>
    </section>
  );
}

/* ───────── 9. Penutup: foto penuh yang melebur ke ivory ───────── */

function Penutup({ u }: { u: Undangan }) {
  return (
    <section className={`${s.naikLapis} relative z-[80] -mt-12 overflow-hidden rounded-tr-[5.5rem] bg-[#f6f1e9] pb-[calc(7rem+var(--demo-h,0px))] text-center`}>
      <div className={`${s.sek} relative h-[64svh] min-h-[26rem] [mask-image:linear-gradient(to_bottom,black_60%,transparent)]`}>
        <div className={`${s.geserLambat} absolute inset-x-0 inset-y-[-8%]`}>
          <Image src={u.foto.belakang} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} fill sizes="440px" className="object-cover object-[50%_35%]" />
        </div>
      </div>
      <motion.div className="relative -mt-16 px-7" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} transition={{ staggerChildren: 0.2 }}>
        <motion.p variants={gaya.lembut} className="text-sm leading-relaxed text-[#2b2420]/80">
          Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.
        </motion.p>
        {u.salam && (
          <motion.p variants={gaya.lembut} className={`${bodoni} mt-4 text-lg text-[#8f7f68] italic`}>
            {u.salam.tutup}
          </motion.p>
        )}
        <motion.p variants={gaya.lembut} className="mt-8 text-[12px] tracking-[0.3em] text-[#2b2420]/60 uppercase">
          Kami yang berbahagia
        </motion.p>
        <p className={`${bodoni} mt-2 text-[2.8rem] leading-tight font-medium`}>
          <Huruf teks={`${u.wanita.panggilan} & ${u.pria.panggilan}`} cepat={0.07} kelas={s.teksEmas} />
        </p>
        <motion.div variants={gaya.zoom} className="mt-6 flex justify-center">
          <Monogram a={u.wanita.panggilan[0]} b={u.pria.panggilan[0]} className="size-20 text-[0.7rem]" />
        </motion.div>
      </motion.div>
      <KreditWebkeun className="relative mt-10 px-7 text-[#2b2420]" />
    </section>
  );
}

export function Isi({ u, opened, tamu }: { u: Undangan; opened: boolean; tamu?: string }) {
  return (
    <>
      <Beranda u={u} opened={opened} />
      <Pembuka u={u} />
      <Mempelai u={u} />
      <Acara u={u} />
      <BagianGaleri u={u} />
      <Kisah u={u} />
      <BagianUcapan tamu={tamu} />
      <Kado u={u} />
      <Penutup u={u} />
    </>
  );
}

