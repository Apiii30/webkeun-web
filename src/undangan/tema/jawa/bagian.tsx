"use client";

import { motion, type Variants } from "motion/react";
import { Fragment, type ReactNode } from "react";
import { calendarLink } from "../../pakai";
import type { Undangan } from "../../types";
import { RUMPUN_DASAR, RUMPUN_KANAN, RUMPUN_KIRI, SUDUT_KANAN, SUDUT_KIRI } from "./aset";
import { Amplop, Countdown, Galeri, Ucapan, tombolHijau } from "./interaktif";
import { Aksara, BingkaiKori, Bukit, Burung, Gunung, Gunungan, Janur, Kabut, KelopakJatuh, KembangKawung, Langit, Matahari, Pemisah, Rumpun, Rumput, Tepi } from "./ornamen";
import s from "./jawa.module.css";

// Isi undangan tema Jawa Klasik.
// - Efek yang mengikuti scroll (parallax) memakai CSS scroll-driven animation lewat kelas di jawa.module.css.
//   Lanskap beranda & penutup disusun berlapis (langit, gunung, bukit, rumput) yang bergeser dengan kecepatan berbeda.
// - Efek "muncul" memakai motion dengan `transform` utuh + opacity, yang diserahkan ke mesin animasi browser
//   (WAAPI) sehingga tidak tertinggal dari scroll. Clip-path dipakai hanya untuk efek sekali jalan.

const ease = [0.22, 1, 0.36, 1] as const;
const marcellus = "font-[family-name:var(--font-marcellus)]";
const script = "font-[family-name:var(--font-corinthia)]";
const hijau = "text-[#3d5243]";
const HIJAU = "#3d5243";
const KERTAS = "#eef0e6";
// Isi beranda mulai bergerak saat sampul sedang memudar (lihat Sampul di shell.tsx)
const BUKA = 1.2;

/* ───────── pembantu animasi ───────── */

const gaya = {
  naik: { hidden: { opacity: 0, transform: "translateY(40px)" }, show: { opacity: 1, transform: "translateY(0px)" } },
  lembut: { hidden: { opacity: 0, transform: "translateY(16px) scale(0.97)" }, show: { opacity: 1, transform: "translateY(0px) scale(1)" } },
  kiri: { hidden: { opacity: 0, transform: "translateX(-60px) rotate(-4deg)" }, show: { opacity: 1, transform: "translateX(0px) rotate(0deg)" } },
  kanan: { hidden: { opacity: 0, transform: "translateX(60px) rotate(4deg)" }, show: { opacity: 1, transform: "translateX(0px) rotate(0deg)" } },
  zoom: { hidden: { opacity: 0, transform: "scale(0.8)" }, show: { opacity: 1, transform: "scale(1)" } },
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
      {/* spasi diletakkan di luar kata (inline-block), karena spasi di ujung inline-block ikut terpangkas */}
      {kata.map((k, ki) => (
        <Fragment key={ki}>
          <span className="inline-block whitespace-nowrap" aria-hidden="true">
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
          </span>
          {ki < kata.length - 1 && " "}
        </Fragment>
      ))}
    </motion.span>
  );
}

// Tulisan sambung muncul dari kiri ke kanan seperti sedang ditulis
const tulis = (duration = 1.4): Variants => ({
  hidden: { clipPath: "inset(0% 100% 0% 0%)" },
  show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration, ease: "easeInOut" } },
});

// Judul bagian: tulisan sambung kecil, judul besar huruf demi huruf, lalu pembatas kawung yang melebar.
function Judul({ kecil, children, terang = false, gerak = true }: { kecil?: string; children: string; terang?: boolean; gerak?: boolean }) {
  return (
    <motion.div className={`${gerak ? s.pJudul : ""} text-center`} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.7 }}>
      {kecil && (
        <motion.p variants={tulis(1.3)} className={`${script} inline-block px-3 text-[2.4rem] leading-tight ${terang ? "text-[#e3c98a]" : "text-[#b08a4a]"}`}>
          {kecil}
        </motion.p>
      )}
      <h2 className={`${marcellus} text-[1.75rem] leading-tight tracking-[0.08em] uppercase ${terang ? "text-[#f4f1e4]" : hijau}`}>
        <Huruf teks={children} jeda={kecil ? 0.5 : 0} />
      </h2>
      <motion.div variants={{ hidden: { opacity: 0, transform: "scaleX(0.2)" }, show: { opacity: 1, transform: "scaleX(1)", transition: { duration: 1, ease, delay: 0.8 } } }}>
        <Pemisah terang={terang} className="mt-3" />
      </motion.div>
    </motion.div>
  );
}

// Foto naik dari dasar seperti pintu yang terangkat. Pemicu "terlihat" di pembungkus luar: elemen yang terpotong
// penuh oleh clip-path dianggap tidak terlihat, jadi animasinya tak akan mulai kalau pemicunya di elemen itu sendiri.
function BukaKori({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
      <motion.div
        variants={{
          hidden: { clipPath: "inset(100% 0% 0% 0% round 50% 50% 0 0)" },
          show: { clipPath: "inset(0% 0% 0% 0% round 0% 0% 0 0)", transition: { duration: 1.6, ease: [0.65, 0, 0.35, 1], delay } },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function hariTanggal(tanggal: string) {
  const [hari, ...rest] = tanggal.split(",");
  return { hari: hari.trim(), tgl: rest.join(",").trim() };
}

/* ───────── 1. Beranda: lanskap pagi berlapis, gunungan & nama di langit ───────── */

function Beranda({ u, opened }: { u: Undangan; opened: boolean }) {
  const tampil = opened ? "show" : "hidden";
  const muncul = (d: number, dari = "translateY(24px)") => ({
    initial: { opacity: 0, transform: dari },
    animate: opened ? { opacity: 1, transform: "translateY(0px)" } : {},
    transition: { duration: 1.2, ease, delay: BUKA + d },
  });
  return (
    <section id="beranda" className={`${s.sek} relative h-svh min-h-[40rem] overflow-hidden`}>
      <div className={`${s.lapisLangit} absolute inset-0`}>
        <Langit />
        <Matahari className="top-[12%] right-[14%] w-14" />
        <Burung className="top-[22%] left-0" delay={-7} />
        <Burung className="top-[31%] left-0" delay={-22} size={15} />
      </div>
      <div className={`${s.lapisJauh} absolute inset-0`}>
        <Gunung preload className="inset-x-0 bottom-[15%] h-[46%]" sizes="(min-width: 1024px) 440px, 100vw" />
        <Kabut className="bottom-[20%] h-24" />
      </div>
      <div className={`${s.lapisTengah} absolute inset-0`}>
        <Bukit lapis="tengah" className="inset-x-0 bottom-[6%] h-[20%]" />
        <Kabut balik className="bottom-[7%] h-20 opacity-70" />
      </div>
      <div className={`${s.lapisDekat} absolute inset-0 origin-bottom`}>
        <Bukit lapis="depan" className="inset-x-0 bottom-0 h-[12%]" />
        <Rumput className="inset-x-0 bottom-[5%] h-10" />
        <Rumpun items={[...RUMPUN_KIRI, ...RUMPUN_KANAN]} tampil={opened} jeda={BUKA + 0.3} className="inset-x-0 bottom-[calc(-3%+var(--demo-h,0px))] aspect-[1/0.5]" />
      </div>

      <div className={`${s.lapisIsi} relative flex h-full flex-col items-center px-6 pt-[9svh] text-center`}>
        <motion.div
          initial={{ opacity: 0, transform: "translateY(-20px) rotateY(90deg) scale(0.7)" }}
          animate={opened ? { opacity: 1, transform: "translateY(0px) rotateY(0deg) scale(1)" } : {}}
          transition={{ duration: 1.4, ease, delay: BUKA }}
        >
          <div className={s.dalang}>
            <Gunungan className="w-12" />
          </div>
        </motion.div>
        <motion.div {...muncul(0.3)}>
          <Aksara className="mt-3 text-lg leading-[2.2] text-[#3d5243]/80">ꦥꦮꦶꦮꦲꦤ꧀</Aksara>
          <p className="text-[11px] tracking-[0.4em] text-[#3d5243]/80 uppercase">The Wedding Of</p>
        </motion.div>
        <motion.h1 initial="hidden" animate={tampil} className={`${script} mt-2 text-[4.6rem] leading-[0.85] text-[#2f3d33]`}>
          <span className="block">
            <Huruf teks={u.wanita.panggilan} jeda={BUKA + 0.5} cepat={0.07} />
          </span>
          <motion.span
            className="block text-[3rem] text-[#b08a4a]"
            variants={{ hidden: { opacity: 0, transform: "scale(0.3) rotate(-30deg)" }, show: { opacity: 1, transform: "scale(1) rotate(0deg)", transition: { duration: 1, ease: [0.34, 1.56, 0.64, 1], delay: BUKA + 0.9 } } }}
          >
            &amp;
          </motion.span>
          <span className="block">
            <Huruf teks={u.pria.panggilan} jeda={BUKA + 1.1} cepat={0.07} />
          </span>
        </motion.h1>
        <motion.div {...muncul(1.7)} className="mt-4">
          <Pemisah />
          <p className={`${marcellus} mt-2 text-sm tracking-[0.25em] text-[#3d5243] uppercase`}>{u.tanggal}</p>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────── 2. Ayat: blok hijau bermotif truntum, gunungan samar di belakang ───────── */

function Ayat({ u }: { u: Undangan }) {
  if (!u.ayat) return null;
  const words = u.ayat.teks.split(" ");
  return (
    <section className={`${s.hijau} relative px-8 pt-16 pb-24 text-center text-[#f4f1e4]`}>
      <Tepi warna={HIJAU} className="absolute inset-x-0 -top-10" />
      <div className={`${s.truntum} absolute inset-0 opacity-[0.13]`} />
      <div className={`${s.pJauh} pointer-events-none absolute inset-x-0 top-6 flex justify-center opacity-[0.14]`}>
        <Gunungan className="w-56" />
      </div>
      <KembangKawung className={`${s.putar} absolute top-10 left-6 size-10 opacity-40`} warna="#e3c98a" />
      <KembangKawung className={`${s.putar} absolute right-6 bottom-20 size-12 opacity-30`} warna="#e3c98a" />

      <motion.div className="relative mx-auto w-16" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.8 }}>
        <motion.div variants={{ hidden: { opacity: 0, transform: "rotateY(180deg) scale(0.5)" }, show: { opacity: 1, transform: "rotateY(0deg) scale(1)", transition: { duration: 1.4, ease } } }}>
          <div className={s.dalang}>
            <Gunungan className="w-full" />
          </div>
        </motion.div>
      </motion.div>

      <motion.blockquote className="relative mt-8" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} transition={{ staggerChildren: 0.035 }}>
        <p className="text-[15px] leading-relaxed text-[#f4f1e4]/90">
          “
          {words.map((w, i) => (
            <Fragment key={i}>
              <motion.span
                className="inline-block"
                variants={{ hidden: { opacity: 0, transform: "translateY(12px)" }, show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.7, ease } } }}
              >
                {w}
              </motion.span>
              {i < words.length - 1 && " "}
            </Fragment>
          ))}
          ”
        </p>
        <motion.footer variants={gaya.zoom} className={`${marcellus} mt-5 text-lg tracking-wide text-[#e3c98a]`}>
          ({u.ayat.sumber})
        </motion.footer>
      </motion.blockquote>
      <Tepi warna={KERTAS} className="absolute inset-x-0 -bottom-px" />
    </section>
  );
}

/* ───────── 3. Salam & mempelai: foto dalam bingkai kori yang terangkat ───────── */

function Mempelai({ u }: { u: Undangan }) {
  const orang = [
    { p: u.wanita, hias: SUDUT_KIRI },
    { p: u.pria, hias: SUDUT_KANAN },
  ];
  return (
    <section id="mempelai" className="relative overflow-x-clip px-6 pt-12 pb-20 text-center">
      <div className={`${s.kawung} pointer-events-none absolute inset-x-0 top-0 h-72 opacity-[0.12] [mask-image:linear-gradient(to_bottom,black,transparent)]`} />
      <motion.div className="relative" initial="hidden" whileInView="show" viewport={{ once: true }}>
        <motion.div variants={gaya.lembut} transition={{ duration: 1 }}>
          <Aksara className="text-xl leading-[2.2] text-[#3d5243]/80">ꦱꦸꦒꦼꦁꦫꦮꦸꦃ</Aksara>
          <p className="mt-1 text-[11px] tracking-[0.4em] text-[#3d5243]/70 uppercase">Sugeng Rawuh</p>
        </motion.div>
        {u.salam && (
          <motion.p variants={tulis(1.8)} className={`${script} mt-3 px-2 text-[2.3rem] leading-tight whitespace-nowrap text-[#b08a4a]`}>
            {u.salam.buka}
          </motion.p>
        )}
      </motion.div>
      <Muncul as="lembut" delay={0.3}>
        <p className="mx-auto mt-3 max-w-xs text-[15px] leading-relaxed text-[#2f3d33]/85">{u.pembuka}</p>
      </Muncul>

      {orang.map(({ p, hias }, i) => (
        <div key={p.nama} className="relative">
          {i === 1 && (
            <motion.p
              initial={{ opacity: 0, transform: "scale(0.3) rotate(-40deg)" }}
              whileInView={{ opacity: 1, transform: "scale(1) rotate(0deg)" }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
              className={`${script} my-6 text-7xl text-[#b08a4a]`}
            >
              &amp;
            </motion.p>
          )}
          <div className={`relative mx-auto w-[64%] ${i === 0 ? "mt-12" : ""}`}>
            <BukaKori>
              <BingkaiKori src={p.foto} alt={p.nama} className="w-full" sizes="280px" posisi="50% 20%" fotoClass={s.geserLambat} />
            </BukaKori>
            <Rumpun items={hias} className="inset-x-[-16%] bottom-0 aspect-[1/0.6]" jeda={0.8} lebar={300} />
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}>
            <h3 className={`${marcellus} mt-8 text-[1.5rem] leading-snug ${hijau}`}>
              <Huruf teks={p.nama} jeda={0.2} cepat={0.03} />
            </h3>
            <motion.p
              variants={{ hidden: { opacity: 0, transform: "translateY(12px)" }, show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.9, delay: 0.8 } } }}
              className="mx-auto mt-1 max-w-[17rem] text-sm leading-relaxed text-[#2f3d33]/80"
            >
              {p.keterangan}
            </motion.p>
          </motion.div>
        </div>
      ))}
    </section>
  );
}

/* ───────── 4. Hitung mundur & 5. Acara: blok hijau dengan janur melengkung ───────── */

function HitungMundur({ u }: { u: Undangan }) {
  return (
    <div className="relative px-6 pt-36 pb-6">
      <motion.div
        initial={{ opacity: 0, transform: "translateY(70px) scale(0.94)" }}
        whileInView={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1.3, ease }}
        className={`${s.kertas} relative rounded-t-[9rem] rounded-b-[2rem] border border-[#c9a35f] p-1.5 shadow-[0_24px_40px_-24px_rgb(0_0_0/0.6)]`}
      >
        <div className="relative rounded-t-[8.6rem] rounded-b-[1.6rem] border border-dashed border-[#b08a4a]/45 px-5 pt-12 pb-7 text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} transition={{ staggerChildren: 0.15, delayChildren: 0.4 }}>
            <motion.div variants={gaya.zoom}>
              <KembangKawung className={`${s.putar} mx-auto size-10`} warna="#b08a4a" />
            </motion.div>
            <motion.p variants={gaya.lembut} className={`${script} mt-2 text-[2.2rem] leading-tight text-[#b08a4a]`}>
              Menghitung hari
            </motion.p>
            <motion.p variants={gaya.lembut} className="mt-1 text-[15px] leading-relaxed text-[#2f3d33]">
              Kami akan menikah, dan kami ingin kamu menjadi bagian dari hari istimewa kami!
            </motion.p>
            <motion.div variants={gaya.lembut} className="mt-6">
              <Countdown target={u.mulai} />
            </motion.div>
            <motion.p variants={gaya.lembut} className={`${marcellus} mt-6 text-lg tracking-wide ${hijau}`}>
              {u.tanggal}
            </motion.p>
            <motion.div variants={gaya.zoom}>
              <a href={calendarLink(u)} target="_blank" rel="noopener noreferrer" className={`${tombolHijau} mt-4`}>
                Simpan Tanggal
              </a>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// Kartu acara: lengkung tinggi dengan lanskap gunung kecil di dasarnya. Tidak memakai efek scroll di dalamnya,
// supaya tetap mulus di Safari.
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
        className={`${s.kertas} relative w-[88%] rounded-t-full rounded-b-[2rem] border border-[#c9a35f] p-1.5 shadow-[0_24px_40px_-24px_rgb(0_0_0/0.7)]`}
      >
        <div className="relative overflow-hidden rounded-t-full rounded-b-[1.6rem] border border-dashed border-[#b08a4a]/45 px-6 pt-16 pb-[44%] text-center">
          <motion.div variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.5 } } }} className="relative z-10">
            <motion.div variants={{ hidden: { opacity: 0, transform: "rotateY(90deg)" }, show: { opacity: 1, transform: "rotateY(0deg)", transition: { duration: 1, ease } } }}>
              <Gunungan className="mx-auto w-11" />
            </motion.div>
            <motion.h3 variants={tulis(1.1)} className={`${script} mt-2 px-2 text-[2.9rem] leading-tight text-[#b08a4a]`}>
              {a.nama}
            </motion.h3>
            <motion.p variants={isi} className="mt-2 text-xs tracking-[0.35em] text-[#3d5243] uppercase">
              {hari}
            </motion.p>
            <motion.p variants={isi} className={`${marcellus} text-[1.6rem] leading-tight ${hijau}`}>
              {tgl}
            </motion.p>
            <motion.p variants={isi} className="mt-1 text-sm text-[#2f3d33]/80">
              Pukul {a.jam}
            </motion.p>
            <motion.div variants={{ hidden: { opacity: 0, transform: "scaleX(0)" }, show: { opacity: 1, transform: "scaleX(1)", transition: { duration: 0.8 } } }} className="mx-auto my-4 flex w-40 items-center gap-3 text-[#b08a4a]">
              <span className="h-px flex-1 bg-current opacity-60" />
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
              </svg>
              <span className="h-px flex-1 bg-current opacity-60" />
            </motion.div>
            <motion.p variants={isi} className="font-semibold text-[#2f3d33]">
              {u.lokasi.nama}
            </motion.p>
            <motion.p variants={isi} className="mx-auto mt-1 max-w-[15rem] text-sm text-[#2f3d33]/75">
              {u.lokasi.alamat}
            </motion.p>
            <motion.div variants={gaya.zoom} transition={{ duration: 0.8, ease }}>
              <a href={u.lokasi.maps} target="_blank" rel="noopener noreferrer" className={`${tombolHijau} mt-5`}>
                Lihat Lokasi
              </a>
            </motion.div>
          </motion.div>
          {/* lanskap mini di dasar kartu */}
          <div className="absolute inset-x-0 bottom-0 h-[42%]">
            <Gunung className="inset-x-0 bottom-[16%] h-[80%] opacity-80" sizes="380px" posisi={i % 2 ? "56% 100%" : "45% 100%"} />
            <Kabut className="bottom-[14%] h-14" balik={i % 2 === 1} />
            <Bukit lapis="tengah" className="inset-x-0 bottom-0 h-[32%]" />
          </div>
        </div>
        <Rumpun items={RUMPUN_DASAR} muncul={false} className="inset-x-[-4%] -bottom-6 aspect-[1/0.42]" lebar={380} />
      </motion.article>
    </motion.div>
  );
}

function BlokAcara({ u }: { u: Undangan }) {
  return (
    <section className={`${s.hijau} relative overflow-x-clip pt-6 pb-24`}>
      <Tepi warna={HIJAU} className="absolute inset-x-0 -top-10" />
      <div className={`${s.kawung} absolute inset-0 opacity-[0.1]`} />
      {/* janur kuning melengkung mengapit, tanda ada hajat pernikahan */}
      <Muncul as="naik" className="absolute top-2 -left-2 h-64">
        <Janur className="h-full" />
      </Muncul>
      <Muncul as="naik" delay={0.2} className="absolute top-2 -right-2 h-64 -scale-x-100">
        <Janur className="h-full" style={{ animationDelay: "-2s" }} />
      </Muncul>
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
      <Tepi warna={KERTAS} className="absolute inset-x-0 -bottom-px" />
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
          <p className="mt-3 text-center text-xs tracking-wide text-[#2f3d33]/60">Ketuk foto untuk melihat lebih besar</p>
        </Muncul>
      </div>
      <div className="h-8" />
      <Galeri photos={u.foto.galeri} />
    </section>
  );
}

/* ───────── 7. Kisah: blok hijau dengan garis keemasan yang tumbuh ───────── */

function Kisah({ u }: { u: Undangan }) {
  const foto = u.foto.galeri[1] ?? u.foto.galeri[0];
  return (
    <section id="cerita" className={`${s.hijau} relative px-6 pt-14 pb-24 text-[#f4f1e4]`}>
      <Tepi warna={HIJAU} className="absolute inset-x-0 -top-10" />
      <div className={`${s.truntum} absolute inset-0 opacity-[0.1]`} />
      <BukaKori className="relative mx-auto w-[56%]">
        <BingkaiKori src={foto.src} alt={foto.alt} className="w-full" sizes="250px" terang fotoClass={s.geserLambat} />
      </BukaKori>
      <div className="relative mt-8">
        <Judul kecil="Perjalanan kami" terang>
          Kisah Cinta
        </Judul>
      </div>
      <ol className={`${s.sek} relative mt-10 space-y-9 pl-11`}>
        <span className="absolute top-2 bottom-2 left-[13px] w-px bg-[#e3c98a]/25" aria-hidden="true" />
        <span className={`${s.tumbuhGaris} absolute top-2 bottom-2 left-[13px] w-px origin-top bg-[#e3c98a]`} aria-hidden="true" />
        {u.cerita.map((c, i) => (
          <li key={c.tahun} className="relative">
            <motion.span
              initial={{ opacity: 0, transform: "scale(0) rotate(-90deg)" }}
              whileInView={{ opacity: 1, transform: "scale(1) rotate(0deg)" }}
              viewport={{ once: true, amount: 1 }}
              transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              className="absolute top-0 -left-11 grid size-7 place-items-center rounded-t-full rounded-b-md bg-[#e3c98a] text-[#3d5243]"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" className={`${s.detak} size-3.5`} fill="currentColor" style={{ animationDelay: `${-i * 0.4}s` }}>
                <path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11Z" />
              </svg>
            </motion.span>
            <Muncul as={i % 2 ? "kiri" : "kanan"} delay={0.1}>
              <p className="text-xs tracking-[0.25em] text-[#e3c98a]">{c.tahun}</p>
              <h3 className={`${marcellus} mt-0.5 text-xl tracking-wide`}>{c.judul}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#f4f1e4]/80">{c.isi}</p>
            </Muncul>
          </li>
        ))}
      </ol>
      <Tepi warna={KERTAS} className="absolute inset-x-0 -bottom-px" />
    </section>
  );
}

/* ───────── 8. Ucapan & RSVP ───────── */

function BagianUcapan({ tamu }: { tamu?: string }) {
  return (
    <section id="ucapan" className="relative px-5 pt-14 pb-12">
      <Judul kecil="Doa & restu">Ucapan</Judul>
      <Muncul as="lembut" delay={0.4}>
        <p className="mx-auto mt-3 mb-7 max-w-[17rem] text-center text-sm text-[#2f3d33]/75">Berikan ucapan terbaik untuk kedua mempelai & konfirmasi kehadiranmu</p>
      </Muncul>
      <Muncul as="naik" delay={0.2}>
        <Ucapan tamu={tamu} />
      </Muncul>
    </section>
  );
}

/* ───────── 9. Tanda kasih: kartu dengan pita hijau bermotif kawung di kiri ───────── */

function Kado({ u }: { u: Undangan }) {
  return (
    <section id="kado" className="relative px-5 pt-6 pb-16">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
        <motion.div
          variants={{ hidden: { clipPath: "inset(0% 100% 0% 0% round 1.5rem)" }, show: { clipPath: "inset(0% 0% 0% 0% round 1.5rem)", transition: { duration: 1.3, ease: [0.65, 0, 0.35, 1] } } }}
          className="relative flex overflow-hidden rounded-3xl border border-[#b08a4a]/40 bg-[#f7f8f1]/80"
        >
          <div className={`${s.hijau} relative flex w-14 shrink-0 items-center justify-center`}>
            <div className={`${s.kawung} absolute inset-0 opacity-20`} />
            <p className={`${marcellus} relative rotate-180 text-lg tracking-[0.15em] whitespace-nowrap text-[#f4f1e4] uppercase [writing-mode:vertical-rl]`}>Tanda Kasih</p>
          </div>
          <div className="relative px-5 py-7 text-center">
            <KembangKawung className={`${s.putar} absolute -right-4 -bottom-4 size-24 opacity-15`} warna="#3d5243" />
            <motion.p variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 0.8, duration: 0.8 } } }} className="relative text-sm leading-relaxed text-[#2f3d33]/85">
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

/* ───────── 10. Penutup: terima kasih, lalu lanskap senja yang naik dari bawah ───────── */

function Penutup({ u }: { u: Undangan }) {
  return (
    <section className={`${s.sek} relative flex min-h-svh flex-col items-center overflow-hidden px-6 pt-10 pb-[calc(40svh+var(--demo-h,0px))] text-center`}>
      <div className={`${s.mendekat} relative mt-4 w-[60%]`}>
        <BukaKori>
          <BingkaiKori src={u.foto.belakang} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} className="w-full" sizes="270px" />
        </BukaKori>
        <Rumpun items={SUDUT_KIRI} className="inset-x-[-14%] bottom-0 aspect-[1/0.6]" jeda={0.8} lebar={300} />
      </div>
      <motion.div className="relative z-10" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} transition={{ staggerChildren: 0.25 }}>
        <motion.p variants={gaya.lembut} className="mx-auto mt-8 max-w-xs text-[15px] leading-relaxed text-[#2f3d33]/85">
          Atas kehadiran dan doa restu Bapak/Ibu/Saudara/i sekalian, kami mengucapkan terima kasih.
        </motion.p>
        {u.salam && (
          <motion.p variants={tulis(1.6)} className={`${script} mt-3 px-2 text-[2.2rem] whitespace-nowrap text-[#b08a4a]`}>
            {u.salam.tutup}
          </motion.p>
        )}
        <motion.div variants={gaya.lembut} className="mt-4">
          <Aksara className="text-lg leading-[2.2] text-[#3d5243]/80">ꦩꦠꦸꦂꦤꦸꦮꦸꦤ꧀</Aksara>
          <p className="mt-0.5 text-[11px] tracking-[0.4em] text-[#3d5243]/70 uppercase">Matur Nuwun</p>
        </motion.div>
        <motion.p variants={gaya.lembut} className="mt-6 text-sm text-[#2f3d33]/70">
          Kami yang berbahagia
        </motion.p>
        <p className={`${script} mt-1 text-[3.6rem] leading-tight text-[#2f3d33]`}>
          <Huruf teks={`${u.wanita.panggilan} & ${u.pria.panggilan}`} cepat={0.07} />
        </p>
      </motion.div>

      {/* lanskap senja: gunung naik lebih lambat dari bukit di depannya */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48svh] [mask-image:linear-gradient(to_bottom,transparent,black_22%)]">
        <Langit senja />
        <Matahari className="top-[22%] left-[14%] w-12" />
        <Burung className="top-[20%] left-0" delay={-12} size={18} />
        <div className={`${s.masukJauh} absolute inset-0`}>
          <Gunung className="inset-x-0 bottom-[10%] h-[80%]" sizes="(min-width: 1024px) 440px, 100vw" posisi="40% 100%" />
          <Kabut className="bottom-[22%] h-20" balik />
        </div>
        <div className={`${s.masukTengah} absolute inset-0`}>
          <Bukit lapis="tengah" className="inset-x-0 bottom-[var(--demo-h,0px)] h-[26%]" />
        </div>
        <Bukit lapis="depan" className="inset-x-0 bottom-[var(--demo-h,0px)] h-[13%]" />
        <Rumput className="inset-x-0 bottom-[calc(5%+var(--demo-h,0px))] h-10" />
        <Rumpun items={[...RUMPUN_KIRI, ...RUMPUN_KANAN]} className="inset-x-0 bottom-[calc(-3%+var(--demo-h,0px))] aspect-[1/0.5]" jeda={0.2} />
      </div>
      <KelopakJatuh n={8} />
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
