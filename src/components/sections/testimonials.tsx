"use client";

import { motion, MotionConfig, type Variants } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { type Testimoni, testimonials } from "@/lib/site";
import { SectionHeading } from "../brand";
import { Icon } from "../icons";
import { Mascot } from "../mascot";

// Testimoni klien, ditampilkan sebagai percakapan WhatsApp (memang lewat WhatsApp Webkeun ngobrol dengan klien).
// Saat terlihat: bintang muncul satu per satu, pesan klien masuk, lalu balasan Webkeun. Di sebelahnya HP berisi hasil
// kerjanya, supaya testimoninya bisa langsung dibuktikan. Testimoni berikutnya tampil sebagai kartu di bawahnya.

const pegas = { type: "spring", stiffness: 380, damping: 24 } as const;
const percakapan: Variants = { awal: {}, tampil: { transition: { staggerChildren: 0.55, delayChildren: 0.2 } } };
const gelembung: Variants = {
  awal: { opacity: 0, y: 14, scale: 0.85 },
  tampil: { opacity: 1, y: 0, scale: 1, transition: pegas },
};
const deretBintang: Variants = { awal: {}, tampil: { transition: { staggerChildren: 0.09, delayChildren: 0.35 } } };
const satuBintang: Variants = {
  awal: { opacity: 0, scale: 0, rotate: -40 },
  tampil: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 500, damping: 14 } },
};

function Bintang({ n, besar = false }: { n: number; besar?: boolean }) {
  return (
    <motion.span variants={deretBintang} className="flex gap-0.5" role="img" aria-label={`Rating ${n} dari 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <motion.svg key={i} variants={satuBintang} viewBox="0 0 24 24" className={besar ? "size-5" : "size-4"} aria-hidden="true">
          <path
            d="M12 2.8l2.75 5.57 6.15.9-4.45 4.33 1.05 6.12L12 16.83l-5.5 2.9 1.05-6.13L3.1 9.27l6.15-.9z"
            fill={i < n ? "#FFB020" : "#15132B"}
            fillOpacity={i < n ? 1 : 0.12}
            stroke={i < n ? "#E69500" : "none"}
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </motion.svg>
      ))}
    </motion.span>
  );
}

// Isi testimoni dengan potongan kalimat yang distabilo
function Isi({ t }: { t: Testimoni }) {
  const i = t.sorotan ? t.isi.indexOf(t.sorotan) : -1;
  if (i < 0) return <>{t.isi}</>;
  return (
    <>
      {t.isi.slice(0, i)}
      <mark className="rounded-[0.25em] bg-[#c8f4ea] box-decoration-clone text-ink shadow-[0.2em_0_0_#c8f4ea,-0.2em_0_0_#c8f4ea]">{t.sorotan}</mark>
      {t.isi.slice(i + t.sorotan!.length)}
    </>
  );
}

function Centang() {
  return (
    <svg viewBox="0 0 18 11" className="h-2.5 w-4" aria-label="Dibaca">
      <path d="M1 6l3.5 3.5L11 2M7 9.5l.5.5L16 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Utama({ t }: { t: Testimoni }) {
  return (
    <div className="grid gap-6 rounded-4xl bg-lilac p-3 sm:p-5 lg:grid-cols-[1fr_19rem] lg:gap-10 lg:p-8">
      {/* jendela chat */}
      <figure className="overflow-hidden rounded-3xl bg-white shadow-[0_30px_70px_-34px_rgb(21_19_43/0.45)]">
        <figcaption className="flex items-center gap-3 bg-brand px-4 py-3.5 text-white sm:px-5">
          <span className="relative size-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white/70">
            <Image src={t.foto} alt={`Foto ${t.nama}`} fill sizes="44px" className="object-cover object-[50%_18%]" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-bold">{t.nama}</span>
            <span className="block truncate text-xs text-white/75">{t.layanan}</span>
          </span>
          <span className="hidden items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold sm:flex">
            <Icon name="whatsapp" className="size-3.5" />
            WhatsApp
          </span>
        </figcaption>

        <motion.blockquote
          variants={percakapan}
          initial="awal"
          whileInView="tampil"
          viewport={{ once: true, amount: 0.45 }}
          className="flex min-h-[25rem] flex-col justify-end gap-2.5 bg-lilac-soft bg-[radial-gradient(rgb(91_61_245/0.09)_1.2px,transparent_1.2px)] [background-size:18px_18px] px-3 py-5 sm:px-5"
        >
          {/* pesan klien */}
          <motion.div variants={gelembung} className="relative max-w-[90%] origin-bottom-left self-start rounded-2xl rounded-bl-md bg-white px-4 pt-3 pb-2 shadow-sm sm:max-w-[82%]">
            <Bintang n={t.bintang} besar />
            <p className="mt-2 text-[15px] leading-relaxed text-ink/85 sm:text-base">
              <Isi t={t} />
            </p>
            <span className="mt-1 block text-right text-[11px] text-ink/40">{t.waktu}</span>
          </motion.div>
          {t.reaksi && (
            <motion.div variants={gelembung} className="origin-bottom-left self-start rounded-2xl rounded-bl-md bg-white px-3 py-1.5 text-2xl shadow-sm">
              <span aria-hidden="true">{t.reaksi}</span>
            </motion.div>
          )}

          {/* balasan Webkeun */}
          <motion.div variants={gelembung} className="mt-2 flex max-w-[88%] origin-bottom-right items-end gap-2 self-end sm:max-w-[75%]">
            <div className="rounded-2xl rounded-br-md bg-brand px-4 pt-2.5 pb-1.5 text-[15px] leading-relaxed text-white shadow-sm">
              {t.balasan}
              <span className="mt-0.5 flex items-center justify-end gap-1 text-[11px] text-white/70">
                {t.waktu.replace(/\d+$/, (m) => String(Math.min(59, +m + 3)).padStart(2, "0"))}
                <span className="text-mint">
                  <Centang />
                </span>
              </span>
            </div>
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white ring-2 ring-lilac">
              <Mascot mood="senyum" className="w-6" />
            </span>
          </motion.div>
        </motion.blockquote>
      </figure>

      {/* hasil kerjanya */}
      {t.karya && (
        <div className="relative mx-auto flex w-full max-w-[19rem] flex-col items-center justify-center pt-4 pb-2 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: 3 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[13.5rem] rounded-[2.2rem] bg-ink p-2 shadow-[0_30px_60px_-24px_rgb(21_19_43/0.6)]"
          >
            <div className="relative aspect-[1/2] overflow-hidden rounded-[1.75rem] bg-white">
              <Image src={t.karya.layar} alt={`Tampilan undangan ${t.panggilan} di HP`} fill sizes="216px" className="object-cover" />
            </div>
            <span className="absolute top-3.5 left-1/2 h-4 w-16 -translate-x-1/2 rounded-full bg-ink" aria-hidden="true" />

            {/* stiker rating */}
            <motion.span
              initial={{ opacity: 0, scale: 0, rotate: -30 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -10 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 420, damping: 15, delay: 1.1 }}
              className="absolute -top-5 -left-9 grid size-[5.5rem] place-items-center rounded-full bg-mint text-center text-ink shadow-lg ring-4 ring-white"
            >
              <span className="leading-none">
                <span className="block text-2xl font-extrabold">{t.bintang}.0</span>
                <span className="mt-0.5 block text-[10px] font-bold tracking-[0.12em] uppercase">bintang</span>
              </span>
            </motion.span>
          </motion.div>

          <Link
            href={t.karya.href}
            className="group mt-7 inline-flex items-center gap-3 rounded-full bg-ink py-1.5 pr-1.5 pl-5 text-[15px] font-semibold text-white transition-colors hover:bg-ink/85"
          >
            {t.karya.label}
            <span className="grid size-8 place-items-center rounded-full bg-white text-ink transition-transform group-hover:translate-x-0.5">
              <Icon name="arrow" className="size-4" strokeWidth={2.5} />
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}

function Kartu({ t }: { t: Testimoni }) {
  return (
    <motion.figure
      initial="awal"
      whileInView="tampil"
      viewport={{ once: true, amount: 0.5 }}
      variants={gelembung}
      className="flex flex-col rounded-3xl rounded-bl-md bg-lilac-soft p-6"
    >
      <Bintang n={t.bintang} />
      <blockquote className="mt-3 flex-1 leading-relaxed text-ink/80">
        <Isi t={t} />
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span className="relative size-10 shrink-0 overflow-hidden rounded-full">
          <Image src={t.foto} alt={`Foto ${t.nama}`} fill sizes="40px" className="object-cover" />
        </span>
        <span>
          <span className="block font-bold">{t.nama}</span>
          <span className="block text-sm text-ink/60">{t.layanan}</span>
        </span>
      </figcaption>
    </motion.figure>
  );
}

export function Testimonials() {
  const [utama, ...lainnya] = testimonials;
  if (!utama) return null;
  return (
    <MotionConfig reducedMotion="user">
      <section id="testimoni" className="border-t border-ink/10">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <SectionHeading top="Kata mereka yang" bottom="sudah pakai Webkeun" />
            <p className="max-w-sm text-lg text-ink/70 md:justify-self-end">
              Cerita dari klien yang undangan dan websitenya kami kerjakan.
            </p>
          </div>
          <div className="mt-10">
            <Utama t={utama} />
          </div>
          {lainnya.length > 0 && (
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lainnya.map((t) => (
                <Kartu key={t.nama} t={t} />
              ))}
            </div>
          )}
        </div>
      </section>
    </MotionConfig>
  );
}
