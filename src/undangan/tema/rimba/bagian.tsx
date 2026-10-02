"use client";

import { motion, type Variants } from "motion/react";
import Image from "next/image";
import type { ReactNode } from "react";
import { calendarLink } from "../../pakai";
import type { Undangan } from "../../types";
import { Bingkai, Depan, Kunang, Kupu, Rumpun } from "./alam";
import { ASET, RUMPUN_BAWAH } from "./aset";
import { Amplop, Countdown, Galeri, Ucapan, tombolEmas } from "./interaktif";
import s from "./rimba.module.css";

// Isi undangan tema Rimba.
// - Efek yang mengikuti scroll (parallax, garis tumbuh) memakai CSS scroll-driven animation
//   lewat kelas di rimba.module.css, jadi dijalankan GPU dan tidak kedut.
// - Efek "muncul" saat pertama terlihat memakai motion, hanya transform & opacity (plus clip-path sekali jalan).

const ease = [0.22, 1, 0.36, 1] as const;
const cinzel = "font-[family-name:var(--font-cinzel)]";
const script = "font-[family-name:var(--font-script)]";
const serif = "font-[family-name:var(--font-cormorant)]";
const emas = "text-[#e9d7a6]";

/* ───────── pembantu animasi ───────── */

// Teks yang hurufnya naik satu per satu. Pemicunya (hidden → show) diwarisi dari elemen motion di atasnya.
function Huruf({ teks, jeda = 0, cepat = 0.035 }: { teks: string; jeda?: number; cepat?: number }) {
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
                hidden: { opacity: 0, y: "0.7em", rotate: 10 },
                show: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.7, ease } },
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

// Judul bagian: tulisan sambung muncul seperti sedang ditulis, lalu judul besar naik huruf demi huruf.
// Saat di-scroll judul sedikit mendahului halaman (parallax). gerak={false} bila parallax dipasang di pembungkusnya.
function Judul({ kecil, children, className = "", gerak = true }: { kecil?: string; children: string; className?: string; gerak?: boolean }) {
  return (
    <motion.div className={`${gerak ? s.pJudul : ""} text-center ${className}`} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.7 }}>
      {kecil && (
        <motion.p
          variants={{ hidden: { clipPath: "inset(0% 100% 0% 0%)" }, show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.4, ease: "easeInOut" } } }}
          className={`${script} inline-block px-3 text-3xl text-[#c9a45c]`}
        >
          {kecil}
        </motion.p>
      )}
      <h2 className={`${cinzel} text-[1.7rem] leading-tight tracking-[0.14em] ${emas}`}>
        <Huruf teks={children} jeda={kecil ? 0.5 : 0} />
      </h2>
      <motion.span
        variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.2, ease, delay: 0.8 } } }}
        className="mx-auto mt-3 block h-px w-24 bg-gradient-to-r from-transparent via-[#c9a45c] to-transparent"
      />
    </motion.div>
  );
}

const gaya = {
  naik: { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } },
  lembut: { hidden: { opacity: 0, y: 16, scale: 0.97 }, show: { opacity: 1, y: 0, scale: 1 } },
  kiri: { hidden: { opacity: 0, x: -60, rotate: -4 }, show: { opacity: 1, x: 0, rotate: 0 } },
  kanan: { hidden: { opacity: 0, x: 60, rotate: 4 }, show: { opacity: 1, x: 0, rotate: 0 } },
  zoom: { hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } },
  putar: { hidden: { opacity: 0, rotate: -12, y: 40, scale: 0.9 }, show: { opacity: 1, rotate: 0, y: 0, scale: 1 } },
} satisfies Record<string, Variants>;

function Muncul({ as = "naik", delay = 0, className, children }: { as?: keyof typeof gaya; delay?: number; className?: string; children: ReactNode }) {
  return (
    <motion.div className={className} variants={gaya[as]} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1, ease, delay }}>
      {children}
    </motion.div>
  );
}

// Isi terbuka dari tengah seperti lensa. Pemicu "terlihat" dipasang di pembungkus luar: elemen yang
// terpotong penuh oleh clip-path dianggap tidak terlihat oleh browser, sehingga animasinya tak akan mulai.
function BukaLensa({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
      <motion.div variants={{ hidden: { clipPath: "circle(0% at 50% 50%)" }, show: { clipPath: "circle(75% at 50% 50%)", transition: { duration: 1.6, ease, delay } } }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

// Tulisan sambung yang muncul dari kiri ke kanan seperti sedang ditulis
const tulis = (duration = 1.4): Variants => ({
  hidden: { clipPath: "inset(0% 100% 0% 0%)" },
  show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration, ease: "easeInOut" } },
});

function hariTanggal(tanggal: string) {
  const [hari, ...rest] = tanggal.split(",");
  return { hari: hari.trim(), tgl: rest.join(",").trim() };
}

/* ───────── 1. Beranda ───────── */

function Beranda({ u, opened }: { u: Undangan; opened: boolean }) {
  return (
    <section id="beranda" className={`${s.sek} relative flex h-svh min-h-[42rem] flex-col items-center justify-center px-6 pb-28 text-center`}>
      <div className={`${s.keluarTurun} relative z-10 flex flex-col items-center`}>
        <motion.p initial={{ opacity: 0, y: -10 }} animate={opened ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.6 }} className={`${cinzel} text-xs tracking-[0.35em] ${emas}`}>
          The Wedding Of
        </motion.p>
        <motion.div
          initial={{ clipPath: "circle(0% at 50% 50%)", rotate: -6 }}
          animate={opened ? { clipPath: "circle(75% at 50% 50%)", rotate: 0 } : {}}
          transition={{ duration: 1.8, ease, delay: 0.3 }}
          className="mt-5"
        >
          <Bingkai src={u.foto.sampul} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} className="aspect-[3/4] h-[42svh] max-h-[24rem]" sizes="300px" preload hiasan={false} />
        </motion.div>
        <motion.h1 initial="hidden" animate={opened ? "show" : "hidden"} className={`${cinzel} mt-7 text-[2.3rem] leading-none tracking-[0.08em] ${emas} [text-shadow:0_2px_16px_rgb(0_0_0/0.6)]`}>
          <Huruf teks={`${u.wanita.panggilan} & ${u.pria.panggilan}`} jeda={1} cepat={0.06} />
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={opened ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 1.9 }} className="mt-3 text-sm tracking-wide">
          {u.tanggal}
        </motion.p>
      </div>
      <div className={`${s.keluarPelan} absolute inset-x-0 bottom-0 aspect-[1/0.62]`}>
        <Rumpun items={RUMPUN_BAWAH} className="inset-0" />
      </div>
      <Kupu className="top-[30%] left-[8%]" delay={-3} dekat />
      <Kupu a="kupuAntiopa" className="top-[60%] right-[22%]" delay={-11} w={30} dekat />
    </section>
  );
}

/* ───────── 2. Ayat: foto mendekat pelan, kata demi kata muncul ───────── */

function Ayat({ u }: { u: Undangan }) {
  if (!u.ayat) return null;
  const words = u.ayat.teks.split(" ");
  return (
    <section className={`${s.sek} relative pt-10 pb-16`}>
      <div className="relative h-[78svh]">
        {/* tepi atas & bawah foto melebur ke latar hutan. Masker dipasang di lapisan yang sama dengan
            animasi zoom-nya, jadi ikut digerakkan GPU tanpa digambar ulang tiap scroll. */}
        <div className={`${s.zoomKeluar} absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_22%,black_62%,transparent)]`}>
          <Image src={u.foto.kutipan} alt="" fill sizes="440px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b1610]/30 to-[#0b1610]/80" />
        </div>
        <motion.blockquote
          className={`${s.pJauh} absolute inset-x-0 bottom-[12%] px-8 text-center`}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ staggerChildren: 0.04 }}
        >
          <p className={`${serif} text-[1.3rem] leading-snug italic`}>
            “
            {words.map((w, i) => (
              <motion.span key={i} className="inline-block" variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}>
                {w}
                {" "}
              </motion.span>
            ))}
            ”
          </p>
          <motion.footer variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } }} className={`${cinzel} mt-5 text-sm tracking-[0.2em] ${emas}`}>
            — {u.ayat.sumber} —
          </motion.footer>
        </motion.blockquote>
      </div>
    </section>
  );
}

/* ───────── 3. Salam & mempelai ───────── */

function Mempelai({ u }: { u: Undangan }) {
  const orang = [
    { p: u.wanita, flip: false },
    { p: u.pria, flip: true },
  ];
  return (
    <section id="mempelai" className="relative px-6 py-20 text-center">
      {u.salam && (
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }}>
          <motion.p variants={tulis(1.8)} className={`${script} px-2 text-[2.6rem] leading-tight text-[#c9a45c]`}>
            {u.salam.buka}
          </motion.p>
        </motion.div>
      )}
      <Muncul as="lembut" delay={0.3}>
        <p className="mx-auto mt-4 max-w-xs text-[15px] leading-relaxed text-[#f3ede0]/85">{u.pembuka}</p>
      </Muncul>

      {orang.map(({ p, flip }, i) => (
        <div key={p.nama} className={`${s.sek} relative`}>
          {i === 1 && (
            <motion.p
              initial={{ opacity: 0, scale: 0.3, rotate: -40 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ type: "spring", stiffness: 80, damping: 10 }}
              className={`${script} my-6 text-6xl text-[#c9a45c]`}
            >
              &amp;
            </motion.p>
          )}
          {/* foto terbuka dari bawah ke atas seperti tirai, foto di dalamnya bergeser pelan saat di-scroll */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} className={`mx-auto w-[62%] ${i === 0 ? "mt-12" : ""}`}>
            <motion.div
              variants={{
                hidden: { clipPath: "inset(120% -20% -20% -20%)", y: 40 },
                show: { clipPath: "inset(-20% -20% -20% -20%)", y: 0, transition: { duration: 1.5, ease } },
              }}
            >
              <Bingkai src={p.foto} alt={p.nama} bentuk="lengkung" className="aspect-[3/4] w-full" sizes="280px" posisi="50% 20%" cermin={flip} fotoClass={s.geserLambat} />
            </motion.div>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}>
            <h3 className={`${cinzel} mt-6 text-[1.45rem] leading-snug ${emas}`}>
              <Huruf teks={p.nama} jeda={0.2} cepat={0.03} />
            </h3>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, delay: 0.8 } } }}
              className="mx-auto mt-2 max-w-[17rem] text-sm leading-relaxed text-[#f3ede0]/80"
            >
              {p.keterangan}
            </motion.p>
          </motion.div>
          <Kupu a={i ? "kupuVanessa" : "kupuSpeyeria"} className={`top-[15%] ${flip ? "left-[6%]" : "right-[10%]"}`} delay={-i * 7} w={30} dekat />
        </div>
      ))}
    </section>
  );
}

/* ───────── 4. Hitung mundur: panel lengkung yang tegak dari posisi miring ───────── */

function HitungMundur({ u }: { u: Undangan }) {
  return (
    <section className={`${s.sek} relative px-6 pt-10 pb-28 [perspective:900px]`}>
      <motion.div
        initial={{ rotateX: 40, opacity: 0, y: 80 }}
        whileInView={{ rotateX: 0, opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1.5, ease }}
        className="relative origin-bottom overflow-hidden rounded-t-full border border-[#c9a45c]/70 p-1.5"
      >
        <div className="relative overflow-hidden rounded-t-full px-6 pt-24 pb-14 text-center">
          <div className={`${s.geserLambat} absolute inset-x-0 inset-y-[-14%]`}>
            <Image src={ASET.hujan.src} alt="" fill sizes="420px" className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1610]/50 to-[#0b1610]/85" />
          <Kunang n={8} />
          <motion.div className="relative" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} transition={{ staggerChildren: 0.18, delayChildren: 0.5 }}>
            <motion.p variants={gaya.lembut} className={`${serif} text-xl leading-snug italic`}>
              Kami akan menikah, dan kami ingin kamu menjadi bagian dari hari istimewa kami!
            </motion.p>
            <motion.div variants={gaya.lembut} className="mt-8">
              <Countdown target={u.mulai} />
            </motion.div>
            <motion.p variants={gaya.lembut} className={`${cinzel} mt-7 text-sm tracking-[0.18em] ${emas}`}>
              {u.tanggal}
            </motion.p>
            <motion.div variants={gaya.zoom}>
              <a href={calendarLink(u)} target="_blank" rel="noopener noreferrer" className={`${tombolEmas} mt-6`}>
                Simpan Tanggal
              </a>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      <Rumpun items={RUMPUN_BAWAH.slice(0, 4)} className={`${s.pDekat} inset-x-0 -bottom-4 aspect-[1/0.5]`} />
    </section>
  );
}

/* ───────── 5. Acara: kartu oval yang terangkat & berputar tegak saat terlihat ───────── */

// Kartu acara ikut scroll biasa. Semua gerak masuknya memakai `transform` utuh + opacity, yang oleh Motion
// diserahkan ke mesin animasi browser (WAAPI) dan berjalan di GPU. Gerak per-properti (y, scale, rotateY) dan
// tanaman yang "tumbuh" dihitung JavaScript tiap frame: di Safari hasilnya tertinggal dari scroll dan
// kartu terlihat bergetar. Tanaman juga diletakkan di luar potongan oval agar Safari tidak menggambar ulang potongannya.
function KartuAcara({ u, a, i }: { u: Undangan; a: Undangan["acara"][number]; i: number }) {
  const { hari, tgl } = hariTanggal(u.tanggal);
  const isi: Variants = {
    hidden: { opacity: 0, transform: "translateY(14px)" },
    show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.8, ease } },
  };
  const miring = i % 2 ? 4 : -4;
  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="flex justify-center">
      <motion.article
        variants={{
          hidden: { opacity: 0, transform: `translateY(48px) scale(0.9) rotate(${miring}deg)` },
          show: { opacity: 1, transform: "translateY(0px) scale(1) rotate(0deg)", transition: { duration: 1.2, ease } },
        }}
        className="relative aspect-[3/4.6] h-[min(37rem,82svh)]"
      >
        <div className={`${s.emas} relative h-full w-full rounded-[50%] p-[3px] shadow-[0_24px_40px_-20px_rgb(0_0_0/0.9)]`}>
          <div className="relative h-full w-full overflow-hidden rounded-[50%] outline-1 -outline-offset-8 outline-[#f3dfa6]/70">
            <Image src={i % 2 ? ASET.hutan2.src : ASET.danau.src} alt="" fill sizes="380px" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0b1610]/40 via-[#0b1610]/70 to-[#0b1610]/85" />
            <motion.div
              className="relative flex h-full flex-col items-center justify-center px-9 pb-16 text-center"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.6 } } }}
            >
              <motion.p variants={tulis(1.2)} className={`${script} px-2 text-[2.6rem] leading-none text-[#e9d7a6]`}>
                {a.nama}
              </motion.p>
              <motion.p variants={isi} className={`${cinzel} mt-5 text-lg tracking-[0.25em]`}>
                {hari}
              </motion.p>
              <motion.p variants={isi} className={`${cinzel} text-2xl font-semibold ${emas}`}>
                {tgl}
              </motion.p>
              <motion.p variants={isi} className="mt-2 text-sm">
                Pukul {a.jam}
              </motion.p>
              <motion.div variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.8 } } }} className="my-4 flex w-40 items-center gap-3 text-[#c9a45c]">
                <span className="h-px flex-1 bg-current" />
                <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
                </svg>
                <span className="h-px flex-1 bg-current" />
              </motion.div>
              <motion.p variants={isi} className="font-semibold">
                {u.lokasi.nama}
              </motion.p>
              <motion.p variants={isi} className="mt-1 max-w-[14rem] text-sm text-[#f3ede0]/80">
                {u.lokasi.alamat}
              </motion.p>
              <motion.div
                variants={{ hidden: { opacity: 0, transform: "scale(0.8)" }, show: { opacity: 1, transform: "scale(1)", transition: { duration: 0.8, ease } } }}
              >
                <a href={u.lokasi.maps} target="_blank" rel="noopener noreferrer" className={`${tombolEmas} mt-5`}>
                  Lihat Peta
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
        <Rumpun items={RUMPUN_BAWAH.slice(2, 7)} muncul={false} className="inset-x-[6%] -bottom-[4%] aspect-[1/0.5]" />
      </motion.article>
    </motion.div>
  );
}

function Acara({ u }: { u: Undangan }) {
  return (
    <section id="acara" className="relative pt-16">
      <Judul kecil="Save the date">Acara</Judul>
      <div className="mt-10 space-y-12 px-6 pb-10">
        {u.acara.map((a, i) => (
          <KartuAcara key={a.nama} u={u} a={a} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ───────── 6. Galeri ───────── */

function BagianGaleri({ u }: { u: Undangan }) {
  return (
    <section id="galeri" className="relative px-5 pt-20 pb-16">
      <div className={s.pJudul}>
        <Judul kecil="Momen berharga" gerak={false}>
          Galeri
        </Judul>
        <Muncul as="lembut" delay={0.6}>
          <p className="mt-3 text-center text-xs tracking-wide text-[#f3ede0]/60">Ketuk foto untuk melihat lebih besar</p>
        </Muncul>
      </div>
      <div className="h-8" />
      <Galeri photos={u.foto.galeri} />
    </section>
  );
}

/* ───────── 7. Kisah: garis emas yang tumbuh mengikuti scroll ───────── */

function Kisah({ u }: { u: Undangan }) {
  return (
    <section id="cerita" className="relative px-5 pt-16 pb-20">
      <Judul kecil="Perjalanan kami">Kisah Cinta</Judul>
      <Muncul as="putar" className="relative mt-10 rounded-[2rem] border border-[#c9a45c]/25 bg-[#0d1a12]/75 px-5 py-8">
        <ol className={`${s.sek} relative space-y-9 pl-10`}>
          <span className="absolute top-2 bottom-2 left-[11px] w-px bg-[#c9a45c]/20" aria-hidden="true" />
          <span className={`${s.tumbuhGaris} absolute top-2 bottom-2 left-[11px] w-px origin-top bg-[#c9a45c]`} aria-hidden="true" />
          {u.cerita.map((c, i) => (
            <li key={c.tahun} className="relative">
              <motion.span
                initial={{ scale: 0, rotate: -90 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true, amount: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12 }}
                className="absolute top-0.5 -left-10 grid size-6 place-items-center rounded-full bg-[#c9a45c] text-[#13251b]"
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" className={`${s.detak} size-3.5`} fill="currentColor" style={{ animationDelay: `${-i * 0.4}s` }}>
                  <path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11Z" />
                </svg>
              </motion.span>
              <Muncul as={i % 2 ? "kiri" : "kanan"} delay={0.1}>
                <p className={`${cinzel} text-xs tracking-[0.25em] text-[#c9a45c]`}>{c.tahun}</p>
                <h3 className={`${cinzel} mt-1 text-lg ${emas}`}>{c.judul}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#f3ede0]/80">{c.isi}</p>
              </Muncul>
            </li>
          ))}
        </ol>
      </Muncul>
    </section>
  );
}

/* ───────── 8. Ucapan & RSVP: panel gading yang terangkat dari bawah ───────── */

function BagianUcapan({ tamu }: { tamu?: string }) {
  return (
    <section id="ucapan" className="relative px-5 pt-16 pb-16 [perspective:1000px]">
      <motion.div
        initial={{ opacity: 0, y: 100, rotateX: 25 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 1.3, ease }}
        className="relative origin-bottom rounded-t-full bg-[#f1ebdd] px-5 pt-14 pb-6 text-center text-[#1b2a1f] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)]"
      >
        <motion.div
          initial={{ rotate: -120, scale: 0.4, opacity: 0 }}
          whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 70, damping: 12, delay: 0.3 }}
          className="relative mx-auto size-36"
        >
          <div className="relative size-full overflow-hidden rounded-full border-[3px] border-[#c9a45c]">
            <Image src={ASET.danau.src} alt="" fill sizes="150px" className="object-cover" />
            <div className="absolute inset-0 grid place-items-center bg-[#0b1610]/55">
              <p className={`${cinzel} text-lg leading-tight tracking-[0.12em] text-[#f3ede0]`}>
                Ucapan
                <br />
                &amp; RSVP
              </p>
            </div>
          </div>
          <motion.div
            initial={{ scale: 0, rotate: -80 }}
            whileInView={{ scale: 1, rotate: -30 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 90, damping: 10, delay: 0.9 }}
            className="absolute -top-4 -left-8 w-20"
          >
            <Image src={ASET.provence.src} alt="" width={ASET.provence.w} height={ASET.provence.h} sizes="90px" className="h-auto w-full" />
          </motion.div>
        </motion.div>
        <Muncul as="lembut" delay={0.4}>
          <p className="mx-auto mt-5 mb-6 max-w-[16rem] text-sm text-[#1b2a1f]/80">Berikan ucapan terbaik untuk kedua mempelai & konfirmasi kehadiranmu</p>
        </Muncul>
        <Ucapan tamu={tamu} />
      </motion.div>
    </section>
  );
}

/* ───────── 9. Tanda kasih: lengkung terbuka dari tengah seperti pintu ───────── */

function Kado({ u }: { u: Undangan }) {
  return (
    <section id="kado" className={`${s.sek} relative px-6 pt-10 pb-28`}>
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        <motion.div
          variants={{
            hidden: { clipPath: "inset(0% 50% 0% 50%)" },
            show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.4, ease: [0.65, 0, 0.35, 1] } },
          }}
          className="relative overflow-hidden rounded-t-full border border-[#c9a45c]/70 p-1.5"
        >
          <div className="relative overflow-hidden rounded-t-full px-7 pt-24 pb-14 text-center">
            <div className={`${s.geserLambat} absolute inset-x-0 inset-y-[-14%]`}>
              <Image src={ASET.hutan2.src} alt="" fill sizes="420px" className="object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#0b1610]/45 to-[#0b1610]/85" />
            <Kunang n={7} />
            <motion.div className="relative" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.2, delayChildren: 0.9 } } }}>
              <motion.p variants={tulis(1.2)} className={`${script} px-2 text-4xl text-[#c9a45c]`}>
                Tanda Kasih
              </motion.p>
              <motion.p variants={gaya.lembut} className="mt-4 text-sm leading-relaxed text-[#f3ede0]/85">
                Doa restumu sudah lebih dari cukup. Namun jika ingin memberi tanda kasih, kamu bisa mengirimkannya lewat tombol di bawah.
              </motion.p>
              <motion.div variants={gaya.zoom} className="mt-6">
                <Amplop amplop={u.amplop} />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      <Rumpun items={RUMPUN_BAWAH.slice(3)} className={`${s.pDekat} inset-x-0 -bottom-6 aspect-[1/0.5]`} />
    </section>
  );
}

/* ───────── 10. Penutup ───────── */

function Penutup({ u }: { u: Undangan }) {
  return (
    <section className={`${s.sek} relative flex min-h-svh flex-col items-center justify-center overflow-clip px-6 pt-16 pb-[calc(16rem+var(--demo-h,0px))] text-center`}>
      <Kunang n={12} className={s.pJauh} />
      <div className={s.mendekat}>
        <BukaLensa>
          <Bingkai src={u.foto.belakang} alt={`${u.wanita.panggilan} & ${u.pria.panggilan}`} className="aspect-[3/4] h-[36svh] max-h-[20rem]" sizes="260px" />
        </BukaLensa>
      </div>
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} transition={{ staggerChildren: 0.25 }}>
        <motion.p variants={gaya.lembut} className="mx-auto mt-8 max-w-xs text-[15px] leading-relaxed text-[#f3ede0]/85">
          Atas kehadiran dan doa restu Bapak/Ibu/Saudara/i sekalian, kami mengucapkan terima kasih.
        </motion.p>
        {u.salam && (
          <motion.p variants={tulis(1.6)} className={`${script} mt-4 px-2 text-3xl text-[#c9a45c]`}>
            {u.salam.tutup}
          </motion.p>
        )}
        <motion.p variants={gaya.lembut} className="mt-6 text-sm text-[#f3ede0]/70">
          Kami yang berbahagia
        </motion.p>
        <p className={`${cinzel} mt-2 text-[2rem] tracking-[0.08em] ${emas}`}>
          <Huruf teks={`${u.wanita.panggilan} & ${u.pria.panggilan}`} cepat={0.07} />
        </p>
      </motion.div>
      <div className="absolute inset-x-0 bottom-[var(--demo-h,0px)] aspect-[1/0.62]">
        <Rumpun items={RUMPUN_BAWAH} className="inset-0" />
      </div>
      <Kupu className="top-[12%] left-[10%]" delay={-5} dekat />
      <Kupu a="kupuVanessa" className="bottom-[34%] left-[14%]" delay={-12} w={28} />
    </section>
  );
}

export function Isi({ u, opened, tamu }: { u: Undangan; opened: boolean; tamu?: string }) {
  return (
    <>
      <Beranda u={u} opened={opened} />
      <Ayat u={u} />
      <Depan a="tradescantia" sisi="kiri" className="-mt-24" />
      <Mempelai u={u} />
      <HitungMundur u={u} />
      <Acara u={u} />
      <BagianGaleri u={u} />
      <Depan a="pomifera" sisi="kiri" w="44%" />
      <Kisah u={u} />
      <BagianUcapan tamu={tamu} />
      <Kado u={u} />
      <Depan a="cinnamomea" sisi="kanan" w="46%" />
      <Penutup u={u} />
    </>
  );
}
